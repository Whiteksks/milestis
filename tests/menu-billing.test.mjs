import test from 'node:test'
import assert from 'node:assert/strict'
import { database, field, load } from './support/firestore-transactions.mjs'

const model = load('functions/src/projects/menu/billing/model.ts', {})
const JAN = Date.parse('2027-01-31T12:34:56.789Z')
const FEB = Date.parse('2027-02-28T12:34:56.789Z')
const MAR = Date.parse('2027-03-31T12:34:56.789Z')
const DAY = 86400_000
const code = (expected) => (error) => error.code === expected
const identity = async (value) => value

function draft(count = 0) {
  const dishes = Array.from({ length: Math.max(count, 1) }, (_, i) => ({ id: `dish-${i}`, categoryId: 'food', name: `Dish ${i}`, description: '', priceMinor: 100, visible: true }))
  const image = { asset: { src: 'https://example.com/photo.webp', width: 100, height: 100 } }
  return { theme: { currentTemplateId: 'menu-classic' }, content: {
    sectionContent: { venue: { name: 'Cafe', description: '', currency: 'KZT' }, categories: [{ id: 'food', name: 'Food', visible: true }], dishes,
      homePageId: 'home', pages: [{ id: 'home', name: '', path: '/', content: { categoryIds: ['food'] } }] },
    sectionVisibility: { showVenue: true, showMenu: true }, imageContent: {
      dishes: Object.fromEntries(dishes.slice(0, count).map((dish) => [dish.id, image])), logo: image, pageBackgrounds: { home: image },
    },
  } }
}

function fixture(t, credits = 3000) {
  t.mock.timers.enable({ apis: ['Date'], now: JAN })
  const f = database()
  f.put('users/owner', { balance: { total: credits, subscription: 0, bonus: 0, purchased: credits }, stats: { totalCreditsSpent: 0 } })
  f.put('users/owner/creditLots/purchased', { bucket: 'purchased', totalAmount: credits, remainingAmount: credits, expiresAtMillis: Number.MAX_SAFE_INTEGER, createdAtMillis: 1 })
  f.put('projects/menu', { ownerId: 'owner', name: 'Cafe', mode: 'menu', status: 'active', isPublished: false })
  f.put('projects/menu/data/content', draft())
  const mocks = { 'firebase-admin/firestore': { FieldValue: field },
    '../../../lib/firebaseAdmin': { db: f.db }, '../lib/firebaseAdmin': { db: f.db } }
  const service = load('functions/src/projects/menu/billing/service.ts', mocks)
  const publish = load('functions/src/projects/menu/publish.ts', { ...mocks, './billing/service': service })
  const publishQuote = (quote, copy = identity) => publish.publishMenuSnapshot(f.db, 'owner', { projectId: 'menu', slug: 'my-cafe', locale: 'ru', quoteId: quote.quoteId }, copy)
  return { ...f, ...service, publishQuote,
    publish: async (plan) => publishQuote(await service.reviewMenuBilling('owner', 'menu', plan)),
    project: () => f.records.get('projects/menu'), balance: () => f.records.get('users/owner').balance.total,
    history: () => [...f.records.entries()].filter(([key]) => key.startsWith('transactions/')).map(([, data]) => data),
  }
}

test('billing HTTP endpoint authenticates, validates requests and cannot charge during review', async (t) => {
  const f = fixture(t)
  const { menuBilling } = load('functions/src/projects/menuBilling.ts', {
    'firebase-functions/v2/https': { onRequest: (_options, handler) => handler },
    'firebase-functions/v2': { logger: { error() {} } },
    'firebase-admin/auth': { getAuth: () => ({ verifyIdToken: async (token) => {
      if (token === 'invalid') throw new Error('bad token')
      return { uid: token }
    } }) },
    '../lib/cors': { ALLOWED_ORIGINS: [] },
    'firebase-admin/firestore': { FieldValue: field },
    '../../../lib/firebaseAdmin': { db: f.db }, '../lib/firebaseAdmin': { db: f.db },
  })
  const call = async (body, token = 'owner', method = 'POST', bytes = 0) => {
    let status = 200, result
    await menuBilling({ method, body, rawBody: Buffer.alloc(bytes), headers: token ? { authorization: `Bearer ${token}` } : {} }, {
      status(value) { status = value; return this }, json(value) { result = value },
    })
    return { status, result }
  }
  assert.equal((await call({}, 'owner', 'GET')).status, 405)
  assert.equal((await call({}, null)).status, 401)
  assert.equal((await call({}, 'invalid')).status, 401)
  assert.equal((await call({}, 'owner', 'POST', 4097)).status, 413)
  assert.equal((await call({ projectId: '../menu', action: 'review' })).status, 400)
  assert.equal((await call({ projectId: 'menu', action: 'review', planId: 'fake' })).status, 400)
  const reviewed = await call({ projectId: 'menu', action: 'review', planId: 'menu-150' })
  assert.equal(reviewed.status, 200)
  assert.equal(reviewed.result.amount, 500)
  assert.equal(f.balance(), 3000)
  assert.equal(f.project().isPublished, false)
  assert.equal((await call({ projectId: 'menu', action: 'status' }, 'someone-else')).status, 403)
  // Reproduce the production failure: a profile balance changed without its lots.
  f.put('users/owner', { balance: { total: 9000, purchased: 9000, subscription: 0, bonus: 0 } })
  assert.deepEqual(await call({ projectId: 'menu', action: 'status' }), { status: 200, result: { billing: null } })
  assert.deepEqual(await call({ projectId: 'menu', action: 'review' }), { status: 409, result: { error: 'BALANCE_INCONSISTENT' } })
  assert.equal(f.balance(), 9000)
  assert.equal(f.history().length, 0)
})

test('inconsistent credits cannot block subscription cancellation or partially publish a pending quote', async (t) => {
  const f = fixture(t)
  await f.publish()
  const quote = await f.reviewMenuBilling('owner', 'menu', 'menu-100')
  const before = structuredClone(f.records.get('published_projects/menu'))
  f.put('users/owner', { balance: { total: 9000, purchased: 9000, subscription: 0, bonus: 0 } })
  const { publishMenu } = load('functions/src/projects/publishMenu.ts', {
    'firebase-functions/v2/https': { onRequest: (_options, handler) => handler },
    'firebase-functions/v2': { logger: { error() {} } },
    'firebase-admin/auth': { getAuth: () => ({ verifyIdToken: async () => ({ uid: 'owner' }) }) },
    'firebase-admin/firestore': { FieldValue: field },
    '../lib/cors': { ALLOWED_ORIGINS: [] },
    '../lib/firebaseAdmin': { db: f.db }, '../../../lib/firebaseAdmin': { db: f.db },
    './menu/media': { copyMenuMedia: identity },
  })
  let status, body
  await publishMenu({ method: 'POST', headers: { authorization: 'Bearer owner' }, rawBody: Buffer.alloc(0),
    body: { projectId: 'menu', slug: 'my-cafe', locale: 'ru', quoteId: quote.quoteId } }, {
    status(value) { status = value; return this }, json(value) { body = value },
  })
  assert.equal(status, 409)
  assert.deepEqual(body, { error: 'BALANCE_INCONSISTENT' })
  assert.deepEqual(f.records.get('published_projects/menu'), before)
  assert.equal(f.balance(), 9000)
  assert.equal(f.history().length, 1)
  const result = await f.setMenuAutoRenew('owner', 'menu', false, f.project().menuBilling.revision)
  assert.equal(result.billing.autoRenew, false)
  assert.equal((await f.menuBillingStatus('owner', 'menu')).billing.autoRenew, false)
})

test('renewal scheduler visits more than two pages and continues after a project failure', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: JAN })
  const f = database()
  for (let index = 0; index < 205; index++) f.put(`projects/menu-${index}`, { menuBilling: { autoRenew: true, nextAttemptAtMillis: JAN } })
  f.put('projects/not-due', { menuBilling: { autoRenew: true, nextAttemptAtMillis: JAN + DAY } })
  f.put('projects/canceled', { menuBilling: { autoRenew: false, nextAttemptAtMillis: JAN } })
  const visited = new Set()
  let summary
  const { renewMenuBillingCron } = load('functions/src/projects/menu/billing/renewal.ts', {
    'firebase-functions/v2/scheduler': { onSchedule: (_options, handler) => handler },
    'firebase-functions/v2': { logger: { error() {}, info: (_message, value) => { summary = value } } },
    '../../../lib/firebaseAdmin': { db: f.db },
    './service': { renewMenuBillingPeriod: async (id) => {
      assert.ok(!visited.has(id)); visited.add(id)
      if (id === 'menu-0') throw new Error('isolated failure')
      f.put(`projects/${id}`, { menuBilling: { autoRenew: true, nextAttemptAtMillis: JAN + DAY } })
      return 'renewed'
    } },
  })
  await renewMenuBillingCron()
  assert.equal(visited.size, 205)
  assert.deepEqual(summary, { renewed: 204, past_due: 0, suspended: 0, skipped: 0, failed: 1, complete: true })
})

test('package boundaries include 0/50/100/150/200 and reject 201', () => {
  for (const [count, cost] of [[0, 200], [50, 200], [51, 350], [100, 350], [101, 500], [150, 500], [151, 650], [200, 650]]) {
    assert.equal(model.minimumMenuPlan(count).monthlyCredits, cost)
  }
  assert.throws(() => model.minimumMenuPlan(201), code('PHOTO_LIMIT_EXCEEDED'))
  assert.equal(model.menuPeriodBoundary(JAN, 1), FEB)
  assert.equal(model.menuPeriodBoundary(JAN, 2), MAR)
  assert.equal(model.menuPeriodBoundary(JAN, 13), Date.parse('2028-02-29T12:34:56.789Z'))
})

test('count includes public dishes once across pages, excludes hidden/unassigned dishes, logo and covers', async (t) => {
  const f = fixture(t)
  const content = draft(51)
  content.content.sectionContent.dishes[0].visible = false
  content.content.sectionContent.pages.push({ id: 'second', path: '/second', name: 'Second', content: { categoryIds: ['food'] } })
  content.content.imageContent.dishes.unused = { asset: { src: 'https://example.com/unused.webp', width: 100, height: 100 } }
  f.put('projects/menu/data/content', content)
  const quote = await f.reviewMenuBilling('owner', 'menu')
  assert.equal(quote.photoCount, 50)
  assert.equal(quote.amount, 200)
  // Shared URLs across different dishes still occupy separate dish photo slots.
  content.content.sectionContent.dishes[0].visible = true
  f.put('projects/menu/data/content', content)
  assert.equal((await f.reviewMenuBilling('owner', 'menu')).amount, 350)
})

test('first publication atomically charges the package and a retry returns the same receipt', async (t) => {
  const f = fixture(t)
  const quote = await f.reviewMenuBilling('owner', 'menu')
  assert.equal(f.balance(), 3000)
  assert.equal(quote.availableCredits, 3000)
  const first = await f.publishQuote(quote)
  assert.equal(first.billing.periodEndMillis, FEB)
  assert.equal(f.project().isPublished, true)
  assert.equal(f.balance(), 2800)
  assert.deepEqual(await f.publishQuote(quote), first)
  assert.equal(f.history().length, 1)
  assert.equal(f.history()[0].meta.reason, 'menu_monthly')
  await f.publish()
  assert.equal(f.balance(), 2800)
  assert.equal(f.history().length, 1)
})

test('upgrade costs the full difference and downgrade takes effect at renewal', async (t) => {
  const f = fixture(t)
  await f.publish('menu-50')
  t.mock.timers.setTime(FEB - DAY)
  f.put('projects/menu/data/content', draft(51))
  const upgrade = await f.reviewMenuBilling('owner', 'menu', 'menu-100')
  assert.equal(upgrade.amount, 150)
  await f.publishQuote(upgrade)
  assert.equal(f.balance(), 2650)
  assert.equal(f.project().menuBilling.periodEndMillis, FEB)
  assert.equal(f.history()[1].meta.reason, 'menu_upgrade')
  f.put('projects/menu/data/content', draft(50))
  const lower = await f.reviewMenuBilling('owner', 'menu', 'menu-50')
  assert.equal(lower.amount, 0)
  await f.publishQuote(lower)
  assert.equal(f.project().menuBilling.planId, 'menu-100')
  assert.equal(f.project().menuBilling.nextPlanId, 'menu-50')
  t.mock.timers.setTime(FEB)
  assert.equal(await f.renewMenuBillingPeriod('menu'), 'renewed')
  assert.equal(f.balance(), 2450)
  assert.equal(f.project().menuBilling.planId, 'menu-50')
  assert.equal(f.project().menuBilling.periodEndMillis, MAR)
})

test('publication rejects a package too small and forbids more than 200 photos', async (t) => {
  const f = fixture(t)
  f.put('projects/menu/data/content', draft(51))
  await assert.rejects(f.reviewMenuBilling('owner', 'menu', 'menu-50'), code('PHOTO_LIMIT_EXCEEDED'))
  f.put('projects/menu/data/content', draft(201))
  // The existing catalog itself is capped at 200 dishes before pricing runs.
  await assert.rejects(f.reviewMenuBilling('owner', 'menu'), code('INVALID_MENU'))
  assert.equal(f.history().length, 0)
})

test('expired, unauthorized and changed-content quotes cannot publish or debit', async (t) => {
  const f = fixture(t)
  await assert.rejects(f.reviewMenuBilling('someone', 'menu'), code('FORBIDDEN'))
  const quote = await f.reviewMenuBilling('owner', 'menu')
  f.put('projects/menu/data/content', draft(1))
  await assert.rejects(f.publishQuote(quote), code('DRAFT_CHANGED'))
  const next = await f.reviewMenuBilling('owner', 'menu')
  t.mock.timers.setTime(JAN + 11 * 60_000)
  await assert.rejects(f.publishQuote(next), code('QUOTE_EXPIRED'))
  assert.equal(f.balance(), 3000)
  assert.equal(f.project().isPublished, false)
})

test('image-copy failure and content changes during copying preserve balance and previous publication', async (t) => {
  const f = fixture(t)
  await f.publish()
  f.put('projects/menu/data/content', draft(51))
  const quote = await f.reviewMenuBilling('owner', 'menu')
  const live = structuredClone(f.records.get('published_projects/menu'))
  await assert.rejects(f.publishQuote(quote, async () => { throw new Error('Storage failed') }), /Storage failed/)
  assert.equal(f.balance(), 2800)
  await assert.rejects(f.publishQuote(quote, async (snapshot) => {
    f.put('projects/menu/data/content', draft(52)); return snapshot
  }), code('DRAFT_CHANGED'))
  assert.equal(f.balance(), 2800)
  assert.deepEqual(f.records.get('published_projects/menu'), live)
})

test('insufficient credits fail before publication and quote excludes expired credits', async (t) => {
  const f = fixture(t, 100)
  f.put('users/owner/creditLots/expired', { bucket: 'subscription', totalAmount: 500, remainingAmount: 500, expiresAtMillis: JAN - 1, createdAtMillis: 1 })
  const user = structuredClone(f.records.get('users/owner'))
  user.balance.subscription = 500; user.balance.total = 600; f.put('users/owner', user)
  const quote = await f.reviewMenuBilling('owner', 'menu')
  assert.equal(quote.availableCredits, 100)
  await assert.rejects(f.publishQuote(quote), code('insufficient_funds'))
  assert.equal(f.balance(), 600)
  assert.equal(f.project().menuBilling, undefined)
  assert.equal(f.project().isPublished, false)
})

test('concurrent publication quotes and renewal workers never double-charge', async (t) => {
  const f = fixture(t)
  const a = await f.reviewMenuBilling('owner', 'menu')
  const b = await f.reviewMenuBilling('owner', 'menu')
  const results = await Promise.allSettled([f.publishQuote(a), f.publishQuote(b)])
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
  assert.equal(f.balance(), 2800)
  t.mock.timers.setTime(FEB)
  await Promise.all([f.renewMenuBillingPeriod('menu'), f.renewMenuBillingPeriod('menu')])
  assert.equal(f.balance(), 2600)
  assert.equal(f.history().length, 2)
})

test('cancel auto-renewal preserves paid access and invalidates a pending quote; resume is explicit', async (t) => {
  const f = fixture(t)
  await f.publish()
  const quote = await f.reviewMenuBilling('owner', 'menu')
  await f.setMenuAutoRenew('owner', 'menu', false, f.project().menuBilling.revision)
  assert.equal(model.hasMenuAccess(f.project().menuBilling), true)
  await assert.rejects(f.publishQuote(quote), code('BILLING_STATE_CHANGED'))
  await f.setMenuAutoRenew('owner', 'menu', true, f.project().menuBilling.revision)
  await f.setMenuAutoRenew('owner', 'menu', false, f.project().menuBilling.revision)
  t.mock.timers.setTime(FEB)
  assert.equal(model.hasMenuAccess(f.project().menuBilling), false)
  assert.equal(await f.renewMenuBillingPeriod('menu'), 'skipped')
  await assert.rejects(f.setMenuAutoRenew('owner', 'menu', true, f.project().menuBilling.revision), code('PAYMENT_REQUIRED'))
  assert.equal(f.balance(), 2800)
})

test('grace retries, suspension and reactivation never charge missed months', async (t) => {
  const f = fixture(t, 200)
  await f.publish()
  t.mock.timers.setTime(FEB)
  assert.equal(await f.renewMenuBillingPeriod('menu'), 'past_due')
  assert.equal(model.hasMenuAccess(f.project().menuBilling), true)
  t.mock.timers.setTime(FEB + 3 * DAY)
  assert.equal(model.hasMenuAccess(f.project().menuBilling), false)
  assert.equal(await f.renewMenuBillingPeriod('menu'), 'suspended')
  const restart = Date.parse('2027-06-15T10:00:00Z'); t.mock.timers.setTime(restart)
  // Top up through the same ledger shape.
  const user = structuredClone(f.records.get('users/owner')); user.balance.total = user.balance.purchased = 200; f.put('users/owner', user)
  f.put('users/owner/creditLots/topup', { bucket: 'purchased', totalAmount: 200, remainingAmount: 200, expiresAtMillis: Number.MAX_SAFE_INTEGER, createdAtMillis: restart })
  await f.publish()
  assert.equal(f.project().menuBilling.anchorAtMillis, restart)
  assert.equal(f.project().menuBilling.periodEndMillis, Date.parse('2027-07-15T10:00:00Z'))
  assert.equal(f.balance(), 0)
  assert.equal(f.history().length, 2)
})

test('deleted and unpublished menus do not renew; corruption does not become a funds error', async (t) => {
  const f = fixture(t)
  await f.publish()
  t.mock.timers.setTime(FEB)
  f.controls.failQuery = true
  await assert.rejects(f.renewMenuBillingPeriod('menu'), /Missing Firestore index/)
  assert.equal(f.project().menuBilling.status, 'active')
  f.controls.failQuery = false
  f.controls.beforeCommit = () => f.put('projects/menu', { ...f.project(), status: 'deleted' })
  assert.equal(await f.renewMenuBillingPeriod('menu'), 'suspended')
  assert.equal(f.balance(), 2800)
  assert.equal(await f.renewMenuBillingPeriod('missing'), 'skipped')
})

test('public resolver never returns unpaid or expired menu content, but retains access in grace', async (t) => {
  const f = fixture(t)
  const { getPublishedGlobalProject } = load('src/lib/projects/published-global.ts', {})
  await f.publish()
  assert.equal((await getPublishedGlobalProject(f.db, 'my-cafe')).mode, 'menu')
  t.mock.timers.setTime(FEB + DAY)
  assert.ok(await getPublishedGlobalProject(f.db, 'my-cafe'))
  t.mock.timers.setTime(FEB + 3 * DAY)
  assert.equal(await getPublishedGlobalProject(f.db, 'my-cafe'), null)
  f.put('projects/menu', { ...f.project(), menuBilling: null })
  assert.equal(await getPublishedGlobalProject(f.db, 'my-cafe'), null)
})
