import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseEnv } from 'node:util'
import { NextRequest, NextResponse } from 'next/server.js'
import { createSourceLoader } from './support/source-loader.mjs'

const root = path.resolve(import.meta.dirname, '..')

function loader(mocks = {}) {
  return createSourceLoader({
    'next-intl/middleware': () => () => NextResponse.next(),
    './i18n/routing': { routing: { defaultLocale: 'en' } },
    'server-only': {},
    ...mocks,
  })
}
const { createSiteConfig, createAllowedOrigins, createFunctionsConfig, buildPublishedUrl } = loader()('functions/src/config/project.ts')
const site = createSiteConfig({ appUrl: 'https://app.example.test', publishedSiteUrl: 'https://pages.example.test', supportEmail: 'support@example.test' })

test('origin configuration rejects credentials, paths, missing values and ambiguous hostnames', () => {
  for (const appUrl of [undefined, '', '/relative', 'ftp://example.test', 'https://user:password@example.test', 'https://app.example.test/path', 'https://app.example.test?key=value', 'https://app.example.test#fragment']) {
    assert.throws(() => createSiteConfig({ ...site, appUrl }))
  }
  assert.throws(() => createSiteConfig({ ...site, publishedSiteUrl: site.appUrl }))
  assert.throws(() => createSiteConfig({ ...site, appUrl: 'https://app.pages.example.test' }), /outside the published project/)
  assert.throws(() => createSiteConfig({ ...site, supportEmail: 'not-an-email' }))
})

test('CORS permits configured project origins and rejects suffix, localhost and nested-host impostors', () => {
  const patterns = createAllowedOrigins(site, 'http://localhost:3000')
  const allowed = origin => patterns.some(pattern => pattern.test(origin))
  for (const origin of [site.appUrl, site.publishedSiteUrl, 'https://cafe.pages.example.test', 'http://localhost:3000']) assert.equal(allowed(origin), true, origin)
  for (const origin of ['https://notapp.example.test', 'https://app.example.test.attacker.test', 'https://pages.example.test.attacker.test', 'https://localhost.attacker.test', 'https://random.hosted.app', 'https://foo.bar.pages.example.test', 'http://app.example.test', 'http://localhost:3001', 'https://cafe.pages.example.test:444']) assert.equal(allowed(origin), false, origin)
})

test('published URLs and endpoints support a different owner, region, scheme and local port', () => {
  assert.equal(buildPublishedUrl('http://pages.localhost:3000', 'cafe', true), 'http://cafe.pages.localhost:3000')
  assert.equal(buildPublishedUrl('http://pages.localhost:3000', 'album', false), 'http://pages.localhost:3000/album')
  assert.throws(() => buildPublishedUrl(site.publishedSiteUrl, '../escape', true))
  assert.equal(createFunctionsConfig('other-project', 'europe-west12').baseUrl, 'https://europe-west12-other-project.cloudfunctions.net')
  assert.equal(createFunctionsConfig('demo-project', 'us-central1', 'http://127.0.0.1:5001').baseUrl, 'http://127.0.0.1:5001/demo-project/us-central1')
  assert.throws(() => createFunctionsConfig('old_project', 'us-central1'))
  assert.throws(() => createFunctionsConfig('demo-project', 'us-central1', 'https://localhost:5001'), /must use HTTP/)
})

test('CSP permits the local Functions emulator in development and rejects it in production', async t => {
  const previous = { mode: process.env.NODE_ENV, origin: process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN }
  t.after(() => {
    for (const [key, value] of [['NODE_ENV', previous.mode], ['NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN', previous.origin]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value
    }
  })
  const loadConfig = () => loader({ 'next-intl/plugin': () => config => config })('next.config.ts').default
  const policy = async config => (await config.headers())[0].headers.find(header => header.key === 'Content-Security-Policy').value
  process.env.NODE_ENV = 'development'
  process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN = 'http://127.0.0.1:5001'
  const development = await policy(loadConfig())
  assert.match(development, /connect-src[^;]* http:\/\/127\.0\.0\.1:5001(?:;|$)/)
  assert.equal(development.includes('upgrade-insecure-requests'), false)
  process.env.NODE_ENV = 'production'
  assert.throws(loadConfig, /development only/)
  delete process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN
  assert.ok((await policy(loadConfig())).includes('upgrade-insecure-requests'))
})

test('environment loading selects production files explicitly and rejects production emulator settings', () => {
  const work = mkdtempSync(path.join(tmpdir(), 'milestis-env-'))
  writeFileSync(path.join(work, '.env.development.local'), 'NEXT_PUBLIC_APP_URL=http://localhost:3000\n')
  writeFileSync(path.join(work, '.env.production.local'), 'NEXT_PUBLIC_APP_URL=https://production.example.test\n')
  const env = { ...process.env }
  delete env.NEXT_PUBLIC_APP_URL
  delete env.NODE_ENV
  const moduleUrl = pathToFileURL(path.join(root, 'scripts/project-environment.mjs')).href
  for (const production of [false, true]) {
    const script = `import { loadProjectEnvironment } from ${JSON.stringify(moduleUrl)}; console.log(loadProjectEnvironment({ production: ${production} }).NEXT_PUBLIC_APP_URL)`
    const result = spawnSync(process.execPath, ['--input-type=module', '--eval', script], { cwd: work, env, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
    assert.equal(result.stdout.trim(), production ? 'https://production.example.test' : 'http://localhost:3000')
  }
  const script = `import { validateProjectEnvironment } from ${JSON.stringify(moduleUrl)}; validateProjectEnvironment({ NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN: 'http://localhost:5001' }, { production: true })`
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', script], { cwd: work, env, encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /development only/)
})

test('proxy blocks localized unfinished pages and internal APIs before redirects and API bypass', () => {
  const { proxy } = loader()('src/proxy.ts')
  for (const route of ['/dashboard/analytics', '/ru/dashboard/analytics', '/kz/dashboard/templates/detail', '/en/admin/settings', '/api/internal', '/api/internal/debug']) {
    assert.equal(proxy(new NextRequest(`${site.appUrl}${route}`)).status, 404, route)
  }
  assert.notEqual(proxy(new NextRequest(`${site.appUrl}/dashboard/analytics-extra`)).status, 404)
  assert.notEqual(proxy(new NextRequest(`${site.appUrl}/api/projects/check-slug`)).status, 404)
})

test('proxy resolves configured publication hosts without accepting nested or spoofed domains', () => {
  const { proxy } = loader()('src/proxy.ts')
  const request = value => new NextRequest(value, { headers: { host: new URL(value).host } })
  const response = proxy(request('https://cafe.pages.example.test/drinks?share=token'))
  const target = new URL(response.headers.get('x-middleware-rewrite'))
  assert.equal(target.pathname, '/sites/cafe/drinks')
  assert.equal(target.search, '?share=token')
  for (const host of ['cafe.pages.example.test.attacker.test', 'foo.bar.pages.example.test']) {
    assert.equal(proxy(request(`https://${host}/drinks`)).headers.get('x-middleware-rewrite'), null)
  }
  assert.equal(new URL(proxy(request('https://pages.example.test/')).headers.get('location')).origin, site.appUrl)
})

test('crawler discovery uses the configured domain and bypasses locale redirects', async () => {
  const load = loader()
  const { proxy } = load('src/proxy.ts')
  assert.equal(proxy(new NextRequest(`${site.appUrl}/llms.txt`)).headers.get('x-middleware-rewrite'), null)
  const response = load('src/app/llms.txt/route.ts').GET()
  const content = await response.text()
  assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8')
  assert.ok(content.includes(`${site.appUrl}/en/help`))
  assert.ok(content.includes('*.pages.example.test'))
  assert.equal(content.includes('milestis.com'), false)
})

test('Polar refuses a missing or mistyped environment instead of selecting production', t => {
  const previous = process.env.POLAR_SERVER
  t.after(() => { process.env.POLAR_SERVER = previous })
  const { getPolarConfig } = loader()('src/config/server.ts')
  delete process.env.POLAR_SERVER
  assert.throws(getPolarConfig, /POLAR_SERVER/)
  process.env.POLAR_SERVER = 'prodution'
  assert.throws(getPolarConfig, /POLAR_SERVER/)
})

test('credit checkout only returns to valid paths on the configured application origin', async () => {
  const checkouts = []
  const { POST } = loader({
    '@/config/server': { getBillingProducts: () => ({ credits: 'test-product' }) },
    '@/lib/billing/polar': { getPolarClient: () => ({ checkouts: { create: async input => { checkouts.push(input); return { url: 'https://checkout.example.test' } } } }) },
    '@/lib/api/require-auth': { requireAuth: async () => ({ uid: 'customer' }) },
    '@/lib/firebase/admin': { adminDb: { collection: () => ({ doc: () => ({ get: async () => ({ exists: true, data: () => ({ email: 'customer@example.test' }) }) }) }) } },
    '@/lib/billing/billing.utils': { getEffectiveSubscriptionFeatures: () => ({ creditTopupRatePerDollar: 1 }) },
  })('src/app/api/billing/buy-credits/route.ts')
  for (const returnTo of ['//attacker.example.test', '/\\attacker.example.test', '/\t/attacker.example.test', '//', 'https://attacker.example.test', '/ru/account/billing?checkout=success']) {
    const response = await POST(new NextRequest(`${site.appUrl}/api/billing/buy-credits`, { method: 'POST', body: JSON.stringify({ credits: 10, returnTo }) }))
    assert.equal(response.status, 200)
    const target = new URL(checkouts.at(-1).successUrl)
    assert.equal(target.origin, site.appUrl, returnTo)
    assert.equal(target.pathname, returnTo.startsWith('/ru/') ? '/ru/account/billing' : '/account/billing')
  }
})

test('production Firebase initialization never enables an inherited App Check debug token', t => {
  const previous = { mode: process.env.NODE_ENV, debug: process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN, siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, window: globalThis.window, self: globalThis.self }
  t.after(() => {
    for (const [key, value] of [['NODE_ENV', previous.mode], ['NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN', previous.debug], ['NEXT_PUBLIC_RECAPTCHA_SITE_KEY', previous.siteKey]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value
    }
    if (previous.window === undefined) delete globalThis.window; else globalThis.window = previous.window
    if (previous.self === undefined) delete globalThis.self; else globalThis.self = previous.self
  })
  process.env.NODE_ENV = 'production'
  process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN = 'debug-token-sentinel'
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'public-site-key'
  globalThis.window = {}
  globalThis.self = {}
  let initialized = 0
  loader({
    'firebase/app': { initializeApp: () => ({}) },
    'firebase/auth': { getAuth: () => ({}) },
    'firebase/storage': { getStorage: () => ({}) },
    'firebase/functions': { getFunctions: () => ({}), connectFunctionsEmulator: () => {} },
    'firebase/firestore': { initializeFirestore: () => ({}), persistentLocalCache: () => ({}), persistentMultipleTabManager: () => ({}) },
    'firebase/app-check': { initializeAppCheck: () => { initialized++ }, ReCaptchaV3Provider: class {} },
  })('src/lib/firebase/firebase.ts')
  assert.equal(globalThis.self.FIREBASE_APPCHECK_DEBUG_TOKEN, undefined)
  assert.equal(initialized, 1)
})

test('configuration generation is repeatable, portable and never writes server credentials or debug tokens', () => {
  const work = mkdtempSync(path.join(tmpdir(), 'milestis-config-'))
  mkdirSync(path.join(work, 'functions'))
  writeFileSync(path.join(work, 'firebase.json'), JSON.stringify({ firestore: { location: 'old-region', rules: 'firestore.rules' } }))
  const firebaseRc = { projects: { default: 'old-project', staging: 'staging-project' }, targets: { 'staging-project': { storage: { assets: ['staging-bucket'] } } } }
  writeFileSync(path.join(work, '.firebaserc'), JSON.stringify(firebaseRc))
  const unmanagedValue = 'first line\nNEXT_PUBLIC_APP_URL=inside-an-unrelated-value\nlast line'
  writeFileSync(path.join(work, 'functions/.env'), `CUSTOM_VALUE="${unmanagedValue}"\n export NEXT_PUBLIC_APP_URL = https://old.example.test\n`)
  const env = { ...process.env, NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'other-project', NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION: 'us-central1', FIRESTORE_LOCATION: 'us-central1', NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'public-site-key', OPENAI_API_KEY: 'private-ai-sentinel', POLAR_ACCESS_TOKEN: 'private-polar-sentinel', NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN: 'private-debug-sentinel', CORS_EXTRA_ORIGINS: 'http://LOCALHOST:3000/' }
  for (const name of ['POLAR_CREDITS_PRODUCT_ID', 'POLAR_PRODUCT_CREATOR_MONTHLY', 'POLAR_PRODUCT_CREATOR_YEARLY', 'POLAR_PRODUCT_ARCHIVE_MONTHLY', 'POLAR_PRODUCT_ARCHIVE_YEARLY']) env[name] = '11111111-1111-4111-8111-111111111111'
  const run = args => spawnSync(process.execPath, [path.join(root, 'scripts/configure-project.mjs'), ...args], { cwd: work, env, encoding: 'utf8' })
  const result = run([])
  assert.equal(result.status, 0, result.stderr)
  assert.equal(run(['--check']).status, 0)
  const contents = ['apphosting.yaml', '.firebaserc', 'firebase.json', 'storage-cors.json', 'functions/.env'].map(file => readFileSync(path.join(work, file), 'utf8')).join('\n')
  for (const secret of ['private-ai-sentinel', 'private-polar-sentinel', 'private-debug-sentinel']) assert.equal(contents.includes(secret), false)
  assert.equal(contents.includes('milestis.com'), false)
  assert.equal(contents.includes('milestis.site'), false)
  assert.deepEqual(JSON.parse(readFileSync(path.join(work, '.firebaserc'), 'utf8')), { ...firebaseRc, projects: { ...firebaseRc.projects, default: 'other-project' } })
  assert.equal(JSON.parse(readFileSync(path.join(work, 'firebase.json'), 'utf8')).firestore.location, 'us-central1')
  const functionsEnv = parseEnv(readFileSync(path.join(work, 'functions/.env'), 'utf8'))
  assert.equal(functionsEnv.CUSTOM_VALUE, unmanagedValue)
  assert.equal(functionsEnv.NEXT_PUBLIC_APP_URL, env.NEXT_PUBLIC_APP_URL)
  assert.ok(JSON.parse(readFileSync(path.join(work, 'storage-cors.json'), 'utf8'))[0].origin.includes('http://localhost:3000'))
})
