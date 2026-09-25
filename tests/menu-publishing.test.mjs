import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const dependency = createRequire(import.meta.url)
const cache = new Map()
let storageBucket
const field = {
  serverTimestamp: () => ({ operation: 'timestamp' }),
  delete: () => ({ operation: 'delete' }),
  increment: (amount) => ({ operation: 'increment', amount }),
}
function load(file) {
  let filename = path.resolve(root, file)
  if (!path.extname(filename)) filename = existsSync(`${filename}.ts`) ? `${filename}.ts` : path.join(filename, 'index.ts')
  if (cache.has(filename)) return cache.get(filename).exports
  const module = { exports: {} }
  cache.set(filename, module)
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
  const require = (id) => {
    // These publication routes must bypass locale routing. Next-intl's ESM
    // middleware requires Next's bundler and is deliberately not invoked here.
    if (id === 'next-intl/middleware') return () => () => assert.fail('Unexpected locale rewrite for a published URL')
    if (id === './i18n/routing') return { routing: { defaultLocale: 'en' } }
    if (id === 'firebase-admin/firestore') return { FieldValue: field }
    if (id === 'firebase-admin/storage') return { getStorage: () => ({ bucket: () => storageBucket }) }
    if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id))
    return dependency(id)
  }
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename })(require, module, module.exports)
  return module.exports
}
const { prepareMenuSnapshot } = load('functions/src/projects/menu/snapshot.ts')
const { publishMenuSnapshot, validateMenuPublishInput } = load('functions/src/projects/menu/publish.ts')
const { copyMenuMedia } = load('functions/src/projects/menu/media.ts')
const { buildPublishedProjectUrl } = load('src/lib/slug/url.ts')
const { getPublishedGlobalProject } = load('src/lib/projects/published-global.ts')
const { isSlugMode } = load('src/lib/slug/policy.ts')

function draft() {
  return {
    theme: { currentTheme: 'parchment', currentTemplateId: 'menu-classic', customDecorations: [{ src: 'private-decoration' }] },
    content: {
      sectionContent: { venue: { name: 'Cafe', description: '', currency: 'KZT' }, categories: [{ id: 'breakfast', name: 'Breakfast', visible: true }], dishes: [{ id: 'toast', categoryId: 'breakfast', name: 'Toast', description: '', priceMinor: 1299, visible: true }] },
      sectionVisibility: { showVenue: true, showMenu: true }, imageContent: { dishes: {} },
    },
  }
}

// Small atomic transaction double. Test the real service against changes between
// its two transactions; never connect these tests to a real Firebase project.
function database(project = {}) {
  let revision = 0
  const records = new Map()
  const revisions = new Map()
  const put = (key, value) => { records.set(key, structuredClone(value)); revisions.set(key, ++revision) }
  put('projects/p1', { ownerId: 'owner', mode: 'menu', status: 'active', isPublished: false, ...project })
  put('projects/p1/data/content', draft())
  put('users/owner', { balance: { total: 200 }, 'stats.projectsPublished': 0 })
  const ref = (key) => ({ path: key, collection: (name) => ({ doc: (id) => ref(`${key}/${name}/${id}`) }) })
  const snap = (reference) => {
    const version = revisions.get(reference.path)
    return { exists: records.has(reference.path), data: () => structuredClone(records.get(reference.path)), updateTime: version ? { value: version, isEqual: (other) => other.value === version } : undefined }
  }
  const db = {
    collection: (name) => ({ doc: (id) => ref(`${name}/${id}`) }),
    runTransaction: async (callback) => {
      const writes = []
      const result = await callback({
        get: async (reference) => snap(reference), getAll: async (...references) => references.map(snap),
        set: (reference, value) => writes.push(['set', reference.path, value]),
        update: (reference, value) => writes.push(['update', reference.path, value]),
      })
      for (const [kind, key, value] of writes) {
        assert.ok(kind === 'set' || records.has(key), `Cannot update missing ${key}`)
        const next = kind === 'set' ? {} : structuredClone(records.get(key))
        for (const [name, item] of Object.entries(value)) {
          if (item?.operation === 'delete') delete next[name]
          else if (item?.operation === 'increment') next[name] = (next[name] ?? 0) + item.amount
          else next[name] = item?.operation === 'timestamp' ? 'now' : item
        }
        put(key, next)
      }
      return result
    },
  }
  return { db, records, put }
}
const input = { projectId: 'p1', slug: 'my-cafe', locale: 'ru' }
const identity = async (snapshot) => snapshot
const errorCode = (code) => (error) => error.code === code

test('publication filters private dishes/images and strips decorations without mutating the draft', () => {
  const data = draft()
  data.content.sectionContent.dishes.push({ ...data.content.sectionContent.dishes[0], id: 'secret', name: 'Unannounced dish', visible: false })
  data.content.imageContent.dishes.secret = { asset: { src: 'private' } }
  const before = structuredClone(data)
  const published = prepareMenuSnapshot(data)
  assert.equal(published.content.sectionContent.dishes.length, 1)
  assert.deepEqual(published.content.imageContent.dishes, {})
  assert.deepEqual(published.theme.customDecorations, [])
  assert.deepEqual(data, before)
})

test('rejects empty or malformed menus while allowing a deliberate zero price', () => {
  const data = draft()
  data.content.sectionContent.venue.name = ' '
  assert.throws(() => prepareMenuSnapshot(data), errorCode('VENUE_REQUIRED'))
  data.content.sectionContent.venue.name = 'Cafe'
  data.content.sectionContent.dishes[0].priceMinor = null
  assert.throws(() => prepareMenuSnapshot(data), errorCode('EMPTY_MENU'))
  data.content.sectionContent.dishes[0].priceMinor = -1
  assert.throws(() => prepareMenuSnapshot(data), errorCode('INVALID_MENU'))
  data.content.sectionContent.dishes[0].priceMinor = 0
  assert.equal(prepareMenuSnapshot(data).content.sectionContent.dishes[0].priceMinor, 0)
  data.content.sectionVisibility.showMenu = false
  assert.throws(() => prepareMenuSnapshot(data), errorCode('EMPTY_MENU'))
})

test('first publication and updates keep the project editable, the draft intact, the address stable and credits untouched', async () => {
  const { db, records, put } = database()
  const original = structuredClone(records.get('projects/p1/data/content'))
  await publishMenuSnapshot(db, 'owner', input, identity)
  assert.deepEqual(records.get('projects/p1/data/content'), original)
  assert.equal(records.get('projects/p1').status, 'active')
  assert.equal(records.get('projects/p1').isPublished, true)
  assert.equal(records.get('projects/p1').publishLockId, undefined)
  assert.equal(records.get('published_projects/p1').locale, 'ru')
  const updated = draft()
  updated.content.sectionContent.dishes[0].priceMinor = 500
  put('projects/p1/data/content', updated)
  await publishMenuSnapshot(db, 'owner', input, identity)
  assert.equal(records.get('published_projects/p1').content.sectionContent.dishes[0].priceMinor, 500)
  assert.equal(records.get('projects/p1').publishVersion, 2)
  assert.equal(records.get('projects/p1').publishedSlug, 'my-cafe')
  assert.deepEqual(records.get('users/owner'), { balance: { total: 200 }, 'stats.projectsPublished': 1 })
})

test('unpublished menu reactivates on its reserved URL and cannot change it', async () => {
  const { db, records, put } = database({ publishedSlug: 'my-cafe', publishVersion: 1 })
  put('published_project_slugs/my-cafe', { projectId: 'p1' })
  await assert.rejects(publishMenuSnapshot(db, 'owner', { ...input, slug: 'other-cafe' }, identity), errorCode('SLUG_IMMUTABLE'))
  await publishMenuSnapshot(db, 'owner', input, identity)
  assert.equal(records.get('published_projects/p1').isPublished, true)
  assert.equal(records.get('published_project_slugs/my-cafe').projectId, 'p1')
})

test('ownership, mode, status and lease are checked before media work', async () => {
  for (const [override, uid, code] of [[{}, 'attacker', 'FORBIDDEN'], [{ mode: 'portfolio' }, 'owner', 'NOT_PUBLISHABLE'], [{ status: 'deleted' }, 'owner', 'NOT_PUBLISHABLE'], [{ publishLockExpiresAtMillis: Date.now() + 60000 }, 'owner', 'PUBLISH_IN_PROGRESS']]) {
    const { db } = database(override)
    await assert.rejects(publishMenuSnapshot(db, uid, input, async () => assert.fail('must not copy media')), errorCode(code))
  }
})

test('slug reservations reject both an existing collision and one created during copying', async () => {
  for (const afterCopy of [false, true]) {
    const { db, records, put } = database()
    const collide = () => put('published_project_slugs/my-cafe', { projectId: 'other' })
    if (!afterCopy) collide()
    await assert.rejects(publishMenuSnapshot(db, 'owner', input, async (snapshot) => { collide(); return snapshot }), errorCode('SLUG_TAKEN'))
    assert.equal(records.get('published_projects/p1'), undefined)
    assert.equal(records.get('projects/p1').publishLockId, undefined)
  }
})

test('draft changes during copying preserve the live snapshot and release the lease', async () => {
  const { db, records, put } = database()
  put('published_projects/p1', { previous: true })
  await assert.rejects(publishMenuSnapshot(db, 'owner', input, async (snapshot) => { put('projects/p1/data/content', draft()); return snapshot }), errorCode('DRAFT_CHANGED'))
  assert.deepEqual(records.get('published_projects/p1'), { previous: true })
  assert.equal(records.get('projects/p1').publishLockId, undefined)
})

test('unpublish during copying cancels the pending update', async () => {
  const { db, records, put } = database({ isPublished: true, publishedSlug: 'my-cafe' })
  await assert.rejects(publishMenuSnapshot(db, 'owner', input, async (snapshot) => {
    put('projects/p1', { ...records.get('projects/p1'), isPublished: false, publishLockId: null })
    put('published_projects/p1', { isPublished: false })
    return snapshot
  }), errorCode('PUBLISH_CANCELLED'))
  assert.deepEqual(records.get('published_projects/p1'), { isPublished: false })
})

test('storage failures leave both draft and live menu unchanged', async () => {
  const { db, records, put } = database()
  const original = structuredClone(records.get('projects/p1/data/content'))
  put('published_projects/p1', { previous: true })
  await assert.rejects(publishMenuSnapshot(db, 'owner', input, async () => { throw new Error('Missing upload') }), /Missing upload/)
  assert.deepEqual(records.get('published_projects/p1'), { previous: true })
  assert.deepEqual(records.get('projects/p1/data/content'), original)
  assert.equal(records.get('projects/p1').publishLockId, undefined)
})

test('media copies only owned uploads, reuses generations, preserves originals and rejects cross-project paths', async () => {
  const sourcePath = 'users/owner/projects/p1/images/photo/full.webp'
  const files = new Map([[sourcePath, { generation: '123', metadata: { firebaseStorageDownloadTokens: 'private-token' } }]])
  let copies = 0
  storageBucket = {
    name: 'test-bucket', file: (name) => ({
      name, exists: async () => [files.has(name)],
      getMetadata: async () => { if (!files.has(name)) throw new Error('Missing'); return [structuredClone(files.get(name))] },
      copy: async (target) => { copies++; files.set(target.name, structuredClone(files.get(name))) },
      setMetadata: async (metadata) => files.set(name, { ...files.get(name), ...metadata }),
    }),
  }
  const url = (objectPath, bucket = 'test-bucket') => `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectPath)}?alt=media&token=private-token`
  const image = { asset: { src: url(sourcePath) }, crop: { assetSrc: url(sourcePath) } }
  const first = await copyMenuMedia(image, 'owner', 'p1')
  assert.match(first.asset.src, /public%2Fp1%2Fmenu%2F/)
  assert.equal(first.asset.src, first.crop.assetSrc)
  assert.deepEqual(await copyMenuMedia(image, 'owner', 'p1'), first)
  assert.equal(copies, 1)
  assert.ok(files.has(sourcePath))
  files.get(sourcePath).generation = '124'
  assert.notEqual((await copyMenuMedia(image, 'owner', 'p1')).asset.src, first.asset.src)
  for (const bad of [url('users/other/projects/p1/photo'), url(sourcePath, 'other-bucket'), 'blob:local-only', 'javascript:alert(1)']) {
    await assert.rejects(copyMenuMedia({ asset: { src: bad } }, 'owner', 'p1'), errorCode('INVALID_IMAGE'))
  }
})

test('request validation and share URLs agree without altering legacy URLs', () => {
  for (const invalid of ['__proto__', 'constructor', 'toString', 'unknown', null]) assert.equal(isSlugMode(invalid), false)
  assert.equal(isSlugMode('menu'), true)
  assert.deepEqual(validateMenuPublishInput({ ...input, slug: ' My-Cafe ' }), input)
  assert.throws(() => validateMenuPublishInput({ ...input, projectId: '../other' }), errorCode('INVALID_PAYLOAD'))
  assert.throws(() => validateMenuPublishInput({ ...input, locale: 'xx' }), errorCode('INVALID_PAYLOAD'))
  assert.throws(() => validateMenuPublishInput({ ...input, slug: 'ab' }), errorCode('INVALID_SLUG'))
  assert.equal(buildPublishedProjectUrl('menu', 'my-cafe', 'ignored'), 'https://my-cafe.milestis.site')
  assert.equal(buildPublishedProjectUrl('portfolio', 'my-cafe'), 'https://my-cafe.milestis.site')
  assert.equal(buildPublishedProjectUrl('event', 'party', 'token'), 'https://milestis.site/party?share=token')
})

test('the same subdomain resolver returns menu or portfolio by stored mode, never a private project', async () => {
  const { db, records } = database()
  await publishMenuSnapshot(db, 'owner', input, identity)
  const reader = { collection: (name) => ({ doc: (id) => ({ get: async () => ({ id, data: () => records.get(`${name}/${id}`) }) }) }) }
  assert.equal((await getPublishedGlobalProject(reader, 'my-cafe')).mode, 'menu')
  assert.equal(await getPublishedGlobalProject(reader, 'missing'), null)
  records.get('projects/p1').status = 'deleted'
  assert.equal(await getPublishedGlobalProject(reader, 'my-cafe'), null)
  records.get('projects/p1').status = 'active'
  records.get('published_projects/p1').isPublished = false
  assert.equal(await getPublishedGlobalProject(reader, 'my-cafe'), null)
  records.get('published_projects/p1').isPublished = true
  records.get('published_projects/p1').mode = 'portfolio'
  assert.equal(await getPublishedGlobalProject(reader, 'my-cafe'), null, 'reservation and document modes must agree')
  records.get('published_project_slugs/my-cafe').mode = 'portfolio'
  assert.equal((await getPublishedGlobalProject(reader, 'my-cafe')).mode, 'portfolio')
  records.get('published_projects/p1').mode = 'photobook'
  records.get('published_project_slugs/my-cafe').mode = 'photobook'
  assert.equal(await getPublishedGlobalProject(reader, 'my-cafe'), null)
})

test('a successful commit does not perform a fallible cleanup transaction afterwards', async () => {
  const { db, records } = database()
  const original = db.runTransaction
  let transactions = 0
  db.runTransaction = async (callback) => {
    if (++transactions > 2) throw new Error('Firestore unavailable after commit')
    return original(callback)
  }
  assert.deepEqual(await publishMenuSnapshot(db, 'owner', input, identity), { ok: true, publishedSlug: 'my-cafe' })
  assert.equal(records.get('projects/p1').publishLockId, undefined)
})

test('proxy preserves subdomain paths and private project links', () => {
  const { proxy } = load('src/proxy.ts')
  const { NextRequest } = dependency('next/server')
  const request = (url) => new NextRequest(url, { headers: { host: new URL(url).host } })
  for (const suffix of ['/', '/opengraph-image', '/drinks']) {
    const response = proxy(request(`https://my-cafe.milestis.site${suffix}`))
    assert.equal(new URL(response.headers.get('x-middleware-rewrite')).pathname, `/sites/my-cafe${suffix === '/' ? '' : suffix}`)
  }
  const privatePage = proxy(request('https://milestis.site/album?share=secret'))
  assert.equal(new URL(privatePage.headers.get('x-middleware-rewrite')).pathname, '/sites/album')
  assert.equal(new URL(privatePage.headers.get('x-middleware-rewrite')).searchParams.get('share'), 'secret')
})
