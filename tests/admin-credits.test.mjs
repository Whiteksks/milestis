import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { database, field, load } from './support/firestore-transactions.mjs'

class HttpsError extends Error {
  constructor(code, message) { super(message); this.code = code }
}
const fails = (message) => (error) => error.message === message
function fixture() {
  const f = database()
  const users = new Map([
    ['admin', { uid: 'admin', email: 'admin@example.com', customClaims: { creditsAdmin: true } }],
    ['customer', { uid: 'customer', email: 'customer@example.com', displayName: 'Customer' }],
    ['other', { uid: 'other', email: 'other@example.com' }],
  ])
  for (const uid of users.keys()) f.put(`users/${uid}`, { balance: { total: 0, bonus: 0, subscription: 0, purchased: 0 } })
  const missing = () => { throw Object.assign(new Error('No account'), { code: 'auth/user-not-found' }) }
  const { adminCredits } = load('functions/src/transactions/admin/index.ts', {
    'firebase-functions/v2/https': { onCall: (_config, handler) => handler, HttpsError },
    'firebase-functions/v2': { logger: { error() {} } },
    'firebase-admin/firestore': { FieldValue: field },
    'firebase-admin/auth': { getAuth: () => ({
      getUser: async (uid) => users.get(uid) ?? missing(),
      getUserByEmail: async (email) => {
        if (email === 'invalid@') throw Object.assign(new Error('Malformed email'), { code: 'auth/invalid-email' })
        return [...users.values()].find((user) => user.email === email) ?? missing()
      },
    }) },
    '../../lib/firebaseAdmin': { db: f.db }, '../lib/firebaseAdmin': { db: f.db },
  })
  const call = (data, uid = 'admin') => adminCredits({ data, auth: uid ? { uid, token: { creditsAdmin: true } } : null })
  const grant = (overrides = {}, uid) => call({ action: 'grant', targetUid: 'customer', amount: 200, reason: 'Compensation for failed publication', requestId: 'request-123456789', ...overrides }, uid)
  return { ...f, users, call, grant, history: () => [...f.records.entries()].filter(([key]) => key.startsWith('transactions/')) }
}

test('unauthenticated and unprivileged callers cannot look up users or grant credits', async () => {
  const f = fixture()
  await assert.rejects(f.call({ action: 'lookup', identifier: 'customer' }, null), fails('AUTH_REQUIRED'))
  await assert.rejects(f.call({ action: 'lookup', identifier: 'customer' }, 'other'), fails('CREDITS_ADMIN_REQUIRED'))
  await assert.rejects(f.grant({}, 'other'), fails('CREDITS_ADMIN_REQUIRED'))
  assert.equal(f.history().length, 0)
})

test('role removal and disabled administrators override a stale privileged ID token', async () => {
  const f = fixture()
  f.users.get('admin').customClaims = { admin: true, support: true, creditsAdmin: false }
  await assert.rejects(f.grant(), fails('CREDITS_ADMIN_REQUIRED'))
  f.users.get('admin').customClaims.creditsAdmin = true
  f.users.get('admin').disabled = true
  await assert.rejects(f.grant(), fails('CREDITS_ADMIN_REQUIRED'))
})

test('lookup by UID and email returns only account and balance information', async () => {
  const f = fixture()
  const byUid = await f.call({ action: 'lookup', identifier: 'customer' })
  assert.deepEqual(await f.call({ action: 'lookup', identifier: ' customer@example.com ' }), byUid)
  assert.deepEqual(byUid, { uid: 'customer', email: 'customer@example.com', displayName: 'Customer',
    balance: { total: 0, bonus: 0, purchased: 0, subscription: 0 }, availableCredits: 0, needsReconciliation: false })
  await assert.rejects(f.call({ action: 'lookup', identifier: 'missing' }), fails('ACCOUNT_NOT_FOUND'))
  await assert.rejects(f.call({ action: 'lookup', identifier: '../customer' }), fails('INVALID_ACCOUNT'))
  await assert.rejects(f.call({ action: 'lookup', identifier: 'invalid@' }), fails('INVALID_ACCOUNT'))
})

test('compensation atomically creates bonus lot, balance and auditable history', async () => {
  const f = fixture()
  const result = await f.grant({ bucket: 'purchased', adminUid: 'forged', expiresAtMillis: 1 })
  assert.equal(result.balance.total, 200)
  assert.equal(result.balance.bonus, 200)
  assert.equal(result.balance.purchased, 0)
  const lot = [...f.records.entries()].find(([key]) => key.startsWith('users/customer/creditLots/'))[1]
  assert.equal(lot.remainingAmount, 200)
  assert.equal(lot.expiresAtMillis, Number.MAX_SAFE_INTEGER)
  const history = f.history()[0][1]
  assert.equal(history.type, 'admin_adjustment')
  assert.deepEqual(history.meta, { reason: 'support_compensation', note: 'Compensation for failed publication', adminUid: 'admin' })
})

test('concurrent and lost-response retries produce one compensation', async () => {
  const f = fixture()
  const results = await Promise.all([f.grant(), f.grant()])
  assert.equal(results[0].tid, results[1].tid)
  assert.equal(f.history().length, 1)
  assert.equal((await f.grant()).idempotent, true)
  assert.equal(f.records.get('users/customer').balance.total, 200)
})

test('same request cannot be repurposed for a different amount, user or reason', async () => {
  const f = fixture()
  await f.grant()
  for (const override of [{ amount: 201 }, { targetUid: 'other' }, { reason: 'Another reason' }]) {
    await assert.rejects(f.grant(override), fails('REQUEST_CONFLICT'))
  }
  assert.equal(f.history().length, 1)
})

test('invalid values and disabled targets are rejected before writing', async () => {
  const f = fixture()
  for (const amount of [0, -1, 0.5, NaN, Infinity, 100001, '200']) await assert.rejects(f.grant({ amount }), fails('INVALID_COMPENSATION'))
  for (const override of [{ reason: '  ' }, { reason: 'a'.repeat(501) }, { requestId: '../bad' }, { targetUid: 'bad/uid' }]) {
    await assert.rejects(f.grant(override), fails('INVALID_COMPENSATION'))
  }
  f.users.get('customer').disabled = true
  await assert.rejects(f.grant(), fails('ACCOUNT_DISABLED'))
  assert.equal(f.history().length, 0)
})

test('manual balance changes are visible in lookup and are never silently converted to credits', async () => {
  const f = fixture()
  f.put('users/customer', { balance: { total: 9000, purchased: 9000, bonus: 0, subscription: 0 } })
  const account = await f.call({ action: 'lookup', identifier: 'customer' })
  assert.equal(account.needsReconciliation, true)
  assert.equal(account.availableCredits, null)
  await assert.rejects(f.grant(), fails('BALANCE_INCONSISTENT'))
  assert.equal(f.records.get('users/customer').balance.total, 9000)
  assert.equal(f.history().length, 0)
})

test('failed commit changes nothing and the exact request can safely be retried', async () => {
  const f = fixture()
  f.controls.failCommit = true
  await assert.rejects(f.grant(), fails('INTERNAL_ERROR'))
  assert.equal(f.history().length, 0)
  assert.equal(f.records.get('users/customer').balance.total, 0)
  f.controls.failCommit = false
  assert.equal((await f.grant()).balance.total, 200)
})

test('role provisioning preserves unrelated custom claims and removes only creditsAdmin', () => {
  const require = createRequire(import.meta.url)
  const { nextClaims } = require('../functions/scripts/set-credits-admin.cjs')
  const existing = { otherRole: true, tenant: 'example' }
  const granted = nextClaims(existing, true)
  assert.deepEqual(granted, { ...existing, creditsAdmin: true })
  assert.deepEqual(nextClaims(granted, false), existing)
  assert.equal(existing.creditsAdmin, undefined)
})
