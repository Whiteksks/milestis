import test from 'node:test'
import assert from 'node:assert/strict'
import { database, field, load } from './support/firestore-transactions.mjs'

const future = () => Date.now() + 86_400_000
const code = (expected) => (error) => error.code === expected
const spend = (amount, key = 'spend-1') => ({ uid: 'owner', idempotencyKey: key, category: 'credit', direction: 'out', credit: { type: 'spend', amount } })
function fixture() {
  const state = database()
  state.put('users/owner', { balance: { total: 0, purchased: 0, subscription: 0, bonus: 0 }, stats: { totalCreditsSpent: 0 } })
  const engine = load('functions/src/transactions/engine.ts', {
    'firebase-admin/firestore': { FieldValue: field }, '../lib/firebaseAdmin': { db: state.db },
  })
  const lot = (id, bucket, amount, expiry = future(), createdAtMillis = 1) => {
    state.put(`users/owner/creditLots/${id}`, { bucket, totalAmount: amount, remainingAmount: amount, expiresAtMillis: expiry, createdAtMillis })
    const user = structuredClone(state.records.get('users/owner'))
    user.balance[bucket] += amount
    user.balance.total += amount
    state.put('users/owner', user)
  }
  return { ...state, ...engine, lot, user: () => state.records.get('users/owner'), history: () => [...state.records.entries()].filter(([key]) => key.startsWith('transactions/')).map(([, data]) => data) }
}

test('grant and replay produce one lot and one history record, including optional undefined fields', async () => {
  const f = fixture()
  const request = { uid: 'owner', idempotencyKey: 'grant', category: 'credit', direction: 'in', credit: { type: 'grant', amount: 200, creditBucket: 'purchased', meta: { reason: 'topup', optional: undefined } } }
  const first = await f.processTransaction(request)
  const replay = await f.processTransaction({ ...request, createdAtIso: 'later' })
  assert.equal(replay.idempotent, true)
  assert.equal(first.tid, replay.tid)
  assert.equal(f.user().balance.total, 200)
  assert.equal(f.history().length, 1)
  assert.equal([...f.records.keys()].filter((key) => key.includes('/creditLots/')).length, 1)
})

test('spend crosses all three buckets atomically and consumes earliest lots first', async () => {
  const f = fixture()
  const end = future()
  f.lot('later', 'subscription', 40, end + 1000)
  f.lot('earlier', 'subscription', 60, end)
  f.lot('bonus', 'bonus', 50)
  f.lot('purchased', 'purchased', 100, Number.MAX_SAFE_INTEGER)
  await f.processTransaction(spend(200))
  assert.deepEqual(f.user().balance, { total: 50, subscription: 0, bonus: 0, purchased: 50 })
  assert.equal(f.user().stats.totalCreditsSpent, 200)
  assert.equal(f.records.get('users/owner/creditLots/purchased').remainingAmount, 50)
  const replay = await f.processTransaction(spend(200))
  assert.equal(replay.idempotent, true)
  assert.equal(f.history().length, 1)
})

test('partial spend selects earliest expiry and then oldest grant within a bucket', async () => {
  const f = fixture()
  const end = future()
  f.lot('newer', 'subscription', 50, end, 2)
  f.lot('older', 'subscription', 50, end, 1)
  f.lot('later-expiry', 'subscription', 50, end + 100, 0)
  await f.processTransaction(spend(60))
  assert.equal(f.records.get('users/owner/creditLots/older').remainingAmount, 0)
  assert.equal(f.records.get('users/owner/creditLots/newer').remainingAmount, 40)
  assert.equal(f.records.get('users/owner/creditLots/later-expiry').remainingAmount, 50)
})

test('expired credits cannot fund a spend even before the scheduler runs', async () => {
  const f = fixture()
  f.lot('expired', 'subscription', 200, 0)
  f.lot('purchased', 'purchased', 100)
  const before = structuredClone(f.records)
  await assert.rejects(f.processTransaction(spend(200)), code('insufficient_funds'))
  assert.deepEqual(f.records, before)
  await f.processTransaction(spend(100))
  assert.equal(f.records.get('users/owner/creditLots/expired').remainingAmount, 200)
  assert.equal(f.records.get('users/owner/creditLots/purchased').remainingAmount, 0)
})

test('query errors, failed commits and inconsistent balances cannot partially debit', async () => {
  for (const failure of ['failQuery', 'failCommit', 'inconsistent', 'invalid-total']) {
    const f = fixture()
    f.lot('bonus', 'bonus', 200)
    if (failure === 'inconsistent') f.records.get('users/owner/creditLots/bonus').remainingAmount = 150
    else if (failure === 'invalid-total') f.user().balance.total = 250
    else f.controls[failure] = true
    const before = structuredClone(f.records)
    await assert.rejects(f.processTransaction(spend(200)))
    assert.deepEqual(f.records, before)
  }
})

test('idempotency rejects changed amount, owner, direction and grant source', async () => {
  const f = fixture()
  f.lot('bonus', 'bonus', 200)
  await f.processTransaction(spend(50))
  for (const request of [spend(60), { ...spend(50), uid: 'someone-else' },
    { ...spend(50), direction: 'in', credit: { type: 'grant', amount: 50, creditBucket: 'purchased' } }]) {
    await assert.rejects(f.processTransaction(request), code('idempotency_conflict'))
  }
  const grant = { uid: 'owner', idempotencyKey: 'grant', category: 'credit', direction: 'in', credit: { type: 'grant', amount: 50, creditBucket: 'bonus' } }
  await f.processTransaction(grant)
  await assert.rejects(f.processTransaction({ ...grant, credit: { ...grant.credit, creditBucket: 'purchased' } }), code('idempotency_conflict'))
})

test('more than 200 empty and outstanding lots do not hide available credit', async () => {
  const f = fixture()
  for (let i = 0; i < 250; i++) f.lot(`closed-${i}`, 'bonus', 0, 0)
  for (let i = 0; i < 210; i++) f.lot(`open-${i}`, 'bonus', 1)
  await f.processTransaction(spend(210))
  assert.equal(f.user().balance.total, 0)
})

test('concurrent spends retry and cannot overspend the same balance', async () => {
  const f = fixture()
  f.lot('purchased', 'purchased', 200)
  const outcomes = await Promise.allSettled([f.processTransaction(spend(200, 'a')), f.processTransaction(spend(200, 'b'))])
  assert.equal(outcomes.filter((result) => result.status === 'fulfilled').length, 1)
  assert.equal(outcomes.find((result) => result.status === 'rejected').reason.code, 'insufficient_funds')
  assert.ok(f.controls.retries > 0)
  assert.equal(f.user().balance.total, 0)
  assert.equal(f.history().length, 1)
})

test('expiry uses the current remainder, records the exact amount and never counts as spending', async () => {
  const f = fixture()
  f.lot('sub', 'subscription', 200)
  f.lot('purchased', 'purchased', 100)
  await f.processTransaction(spend(150))
  f.put('users/owner/creditLots/sub', { ...f.records.get('users/owner/creditLots/sub'), expiresAtMillis: 0 })
  const result = await f.expireCreditLot('owner', 'sub')
  assert.equal(result.transaction.amount, 50)
  assert.deepEqual(f.user().balance, { total: 100, purchased: 100, subscription: 0, bonus: 0 })
  assert.equal(f.user().stats.totalCreditsSpent, 150)
  assert.equal(await f.expireCreditLot('owner', 'sub'), null)
  assert.equal(f.history().length, 2)
})

test('missing, depleted and not-yet-expired lots cannot consume other credits', async () => {
  const f = fixture()
  f.lot('empty', 'subscription', 0, 0)
  f.lot('purchased', 'purchased', 200)
  const before = structuredClone(f.records)
  for (const id of ['empty', 'missing', 'purchased']) assert.equal(await f.expireCreditLot('owner', id), null)
  assert.deepEqual(f.records, before)
  const invalidPaths = ['users/other/creditLots/x', 'users/owner/creditLots/x/nested/y', 'users/owner/creditLots/empty']
  for (const expireLotPath of invalidPaths) {
    await assert.rejects(f.processTransaction({ ...spend(10, expireLotPath), credit: { type: 'expire', amount: 10, expireLotPath } }), code('invalid_argument'))
  }
  assert.deepEqual(f.records, before)
})

test('concurrent expiry workers create a single expiration record', async () => {
  const f = fixture()
  f.lot('expired', 'subscription', 200, 0)
  const results = await Promise.all([f.expireCreditLot('owner', 'expired'), f.expireCreditLot('owner', 'expired')])
  assert.equal(results.filter(Boolean).length, 1)
  assert.equal(f.history().length, 1)
  assert.equal(f.user().balance.total, 0)
  assert.equal(f.user().stats.totalCreditsSpent, 0)
})

test('invalid fractional, infinite, negative and zero credit amounts are rejected', async () => {
  const f = fixture()
  for (const amount of [0, -1, 0.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(f.processTransaction(spend(amount)), code('invalid_argument'))
  }
  assert.equal(f.history().length, 0)
})

test('billing records do not alter credits or spending statistics', async () => {
  const f = fixture()
  f.lot('purchased', 'purchased', 20)
  await f.processTransaction({ uid: 'owner', idempotencyKey: 'payment', category: 'billing', direction: 'in', billing: { type: 'buy_credits', amountMinor: 2000, currency: 'USD' } })
  assert.equal(f.user().balance.total, 20)
  assert.equal(f.user().stats.totalCreditsSpent, 0)
  assert.equal(f.history()[0].amountMinor, 2000)
})

test('scheduler pages beyond 500 lots, excludes empty lots and advances past individual failures', async () => {
  const f = database()
  for (let i = 0; i < 550; i++) {
    f.put(`users/owner/creditLots/empty-${i}`, { remainingAmount: 0, expiresAtMillis: 0 })
    f.put(`users/owner/creditLots/open-${String(i).padStart(3, '0')}`, { remainingAmount: 1, expiresAtMillis: 1 })
  }
  f.put('users/owner/creditLots/future', { remainingAmount: 1, expiresAtMillis: future() })
  const visited = []
  const logs = []
  const { expireCreditsCron } = load('functions/src/transactions/triggers/expireCreditsCron.ts', {
    'firebase-functions/v2/scheduler': { onSchedule: (options, run) => ({ options, run }) },
    'firebase-functions/v2': { logger: { info: (...args) => logs.push(args), error: () => {}, warn: () => {} } },
    '../../lib/firebaseAdmin': { db: f.db },
    '../engine': { expireCreditLot: async (uid, lotId) => {
      visited.push(lotId)
      if (lotId === 'open-000') throw new Error('Inconsistent account')
      f.put(`users/${uid}/creditLots/${lotId}`, { remainingAmount: 0, expiresAtMillis: 1 })
      return { idempotent: false }
    } },
  })
  await expireCreditsCron.run()
  assert.equal(new Set(visited).size, 550)
  assert.equal(visited.length, 550)
  assert.equal(f.controls.queryReads, 3)
  assert.deepEqual(logs.at(-1)[1], { processed: 549, skipped: 0, failed: 1, scanned: 550, complete: true })
  assert.equal(expireCreditsCron.options.schedule, 'every 60 minutes')
})
