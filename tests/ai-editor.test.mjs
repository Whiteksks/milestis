import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
import { createStore } from 'zustand/vanilla'
import { NextRequest } from 'next/server.js'

const dependency = createRequire(import.meta.url)
const root = process.cwd()
function loader(mocks = {}) {
  const cache = new Map()
  function load(file) {
    const filename = path.resolve(root, existsSync(file) ? file : `${file}.ts`)
    if (cache.has(filename)) return cache.get(filename).exports
    const sourceModule = { exports: {} }
    cache.set(filename, sourceModule)
    const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText
    const require = (id) => {
      if (id === 'server-only') return {}
      if (Object.hasOwn(mocks, id)) return mocks[id]
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id))
      if (id.startsWith('@/')) return load(path.join(root, 'src', id.slice(2)))
      return dependency(id)
    }
    vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`, { filename })(require, sourceModule, sourceModule.exports)
    return sourceModule.exports
  }
  return load
}
const load = loader()
const { createMenuContent } = load('functions/src/domain/menu/content.ts')
const { strictSchema, readAiResult } = load('src/lib/ai/core/schema.ts')
const { AiServiceError } = load('src/lib/ai/server/openai.ts')
const tick = () => new Promise((resolve) => setImmediate(resolve))

test('strict outputs preserve unknown prices and remove omitted optional fields', () => {
  const schema = { type: 'object', required: ['price'], properties: {
    price: { type: 'integer', nullable: true, minimum: 0 }, photoId: { type: 'string', enum: ['photo-a'] },
  } }
  const strict = strictSchema(schema)
  assert.deepEqual(strict.required, ['price', 'photoId'])
  assert.equal(strict.additionalProperties, false)
  assert.deepEqual(readAiResult(schema, { price: null, photoId: null }), { price: null })
  assert.throws(() => readAiResult(schema, { price: -1 }), /AI_INVALID_RESPONSE/)
  assert.throws(() => readAiResult(schema, { price: 10, photoId: 'someone-elses-photo' }), /AI_INVALID_RESPONSE/)
  assert.throws(() => readAiResult(schema, { price: 10, extra: 'unexpected' }), /AI_INVALID_RESPONSE/)
})

test('GPT transport uses current dynamic schemas, handles reasoning output and keeps secrets server side', async (t) => {
  const previousKey = process.env.OPENAI_API_KEY
  process.env.OPENAI_API_KEY = 'test-key'
  t.after(() => { if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey })
  const calls = []
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    const body = JSON.parse(options.body)
    calls.push(body)
    return Response.json({ status: 'completed', output: [
      { type: 'reasoning', summary: [] },
      { type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ photoId: body.text.format.schema.properties.photoId.enum[0] }) }] },
    ] })
  })
  const { callNarrow } = load('src/lib/ai/server/openai.ts')
  for (const photoId of ['old-photo', 'new-photo']) {
    const result = await callNarrow({ cacheKey: 'same:section', systemPrompt: 'write', contents: [{ role: 'user', parts: [{ text: 'hello' }] }],
      schema: { type: 'object', required: ['photoId'], properties: { photoId: { type: 'string', enum: [photoId] } } },
    })
    assert.equal(result.photoId, photoId)
  }
  assert.equal(calls[0].model, 'gpt-6-sol')
  assert.equal(calls[0].store, false)
  assert.equal(calls[0].text.format.strict, true)
  assert.equal(calls[0].text.format.name, 'same_section')
})

test('incomplete, refused and invalid GPT responses never reach the editor', async (t) => {
  const previousKey = process.env.OPENAI_API_KEY
  process.env.OPENAI_API_KEY = 'test-key'
  t.after(() => { if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey })
  const { callNarrow } = load('src/lib/ai/server/openai.ts')
  const options = { cacheKey: 'test', systemPrompt: '', contents: [], schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } } }
  for (const [body, error] of [
    [{ status: 'incomplete', output: [] }, /AI_INCOMPLETE_RESPONSE/],
    [{ status: 'completed', output: [{ type: 'message', content: [{ type: 'refusal' }] }] }, /AI_REFUSED/],
    [{ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: '{"name":3}' }] }] }, /AI_INVALID_RESPONSE/],
  ]) {
    const mocked = t.mock.method(globalThis, 'fetch', async () => Response.json(body))
    await assert.rejects(callNarrow(options), error)
    mocked.mock.restore()
  }
})

function menuHarness(resultPromise) {
  const content = createStore(() => ({ menuContent: createMenuContent(), menuImages: { dishes: {}, pageBackgrounds: {} } }))
  const theme = createStore(() => ({ currentTemplateId: 'menu-classic', currentTheme: 'parchment' }))
  const ui = createStore(() => ({ projectId: 'p', editorMode: 'menu', activeMenuPageId: 'home' }))
  const brief = createStore((set) => ({ hasGenerated: false, markGenerated: () => set({ hasGenerated: true }) }))
  const calls = []
  const { runMenuPipeline } = loader({
    '../client': { requestAi: async (...args) => { calls.push(args); return await resultPromise } },
    '@/editor/lib/store/content': { useContentStore: content },
    '@/editor/lib/store/theme': { useThemeStore: theme },
    '@/editor/lib/store/ui': { useUiStore: ui },
    '@/editor/lib/store/ai-brief': { useAiBriefStore: brief },
    '@/editor/hooks/use-project-images': { getProjectImageThumbUrl: () => 'thumb', getProjectImageSelectUrl: () => 'full' },
  })('src/lib/ai/menu/pipeline.ts')
  const run = (options = {}) => runMenuPipeline({ projectId: 'p', mode: 'menu', prompt: 'Create a menu', language: 'en', idToDoc: new Map(), newPhotoIds: [], ...options })
  return { content, theme, ui, calls, run }
}
function menuResult() {
  const menu = createMenuContent()
  menu.venue.name = 'Cafe'
  menu.categories = [{ id: 'coffee', name: 'Coffee', visible: true }]
  menu.dishes = [{ id: 'latte', categoryId: 'coffee', name: 'Latte', description: '', priceMinor: null, visible: true, recommended: false }]
  menu.pages[0].content.categoryIds = ['coffee']
  const { mascot: _mascot, ...generated } = menu
  return { message: 'Draft created. Add prices.', menu: generated, style: null, photoAssignments: [] }
}

test('menu applies as one validated draft, preserves mascot/media, sends history and supports undo', async () => {
  const h = menuHarness(Promise.resolve(menuResult()))
  const original = h.content.getState()
  const mascot = { ...original.menuContent.mascot }
  const logo = { asset: { src: 'logo', width: 10, height: 10 } }
  h.content.setState({ menuContent: { ...original.menuContent, mascot }, menuImages: { ...original.menuImages, logo } })
  const before = h.content.getState()
  const history = [{ role: 'user', content: 'My cafe is called Cafe' }]
  const result = await h.run({ history })
  assert.equal(result.kind, 'applied')
  assert.equal(h.content.getState().menuContent.mascot.characterId, mascot.characterId)
  assert.equal(h.content.getState().menuImages.logo, logo)
  assert.equal(h.content.getState().menuContent.dishes[0].priceMinor, null)
  assert.deepEqual(h.calls[0][1].history, history)
  assert.equal(result.undo(), true)
  assert.equal(h.content.getState().menuContent, before.menuContent)
})

test('menu questions do not mutate content or theme', async () => {
  const h = menuHarness(Promise.resolve({ message: 'Which dishes?', menu: null, style: null, photoAssignments: [] }))
  const content = h.content.getState(), theme = h.theme.getState()
  assert.equal((await h.run()).kind, 'chat')
  assert.equal(h.content.getState(), content)
  assert.equal(h.theme.getState(), theme)
})

test('menu rejects broken category references before applying anything', async () => {
  const result = menuResult()
  result.menu.dishes[0].categoryId = 'missing'
  const h = menuHarness(Promise.resolve(result)), before = h.content.getState()
  await assert.rejects(h.run(), /categoryId/)
  assert.equal(h.content.getState(), before)
})

test('manual changes and navigation invalidate late menu responses and abort their requests', async () => {
  for (const change of ['edit', 'navigation']) {
    let resolve
    const h = menuHarness(new Promise((done) => { resolve = done }))
    const pending = h.run()
    const rejected = assert.rejects(pending, /AI_PROJECT_CHANGED/)
    await tick()
    if (change === 'edit') h.content.setState({ menuContent: { ...h.content.getState().menuContent, venue: { name: 'Manual', description: '', currency: 'KZT' } } })
    else { h.ui.setState({ projectId: 'other' }); h.ui.setState({ projectId: 'p' }) }
    assert.equal(h.calls[0][2].signal.aborted, true)
    resolve(menuResult())
    await rejected
    assert.equal(h.content.getState().menuContent.dishes.length, 0)
  }
})

test('undo refuses to overwrite later manual edits', async () => {
  const h = menuHarness(Promise.resolve(menuResult()))
  const result = await h.run()
  h.content.setState({ menuContent: { ...h.content.getState().menuContent, venue: { name: 'Manual', description: '', currency: 'KZT' } } })
  assert.equal(result.undo(), false)
  assert.equal(h.content.getState().menuContent.venue.name, 'Manual')
})

const validInput = () => ({ prompt: 'Create a menu', language: 'en', current: createMenuContent(), activePageId: 'home', style: { templateId: 'menu-classic', currentTheme: 'parchment' }, history: [], photos: [] })
const request = (body) => new NextRequest('http://localhost/api/ai', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
function routeHarness({ uid = 'u', project = { ownerId: 'u', mode: 'menu', status: 'active' } } = {}) {
  const calls = [], reservations = []
  const tasks = { generateMenu: async (input) => { calls.push(input); return { message: 'Hello', menu: null, style: null, photoAssignments: [] } } }
  const { POST } = loader({
    '@/lib/api/require-auth': { requireAuth: async () => uid ? { uid } : { error: Response.json({ error: 'UNAUTHENTICATED' }, { status: 401 }) } },
    '@/lib/firebase/admin': { adminDb: { collection: () => ({ doc: () => ({ get: async () => ({ data: () => project }) }) }) } },
    '@/lib/ai/server/tasks': { aiTasks: tasks }, './tasks': { aiTasks: tasks },
    '@/lib/ai/server/openai': { AiServiceError }, './openai': { AiServiceError },
    '@/lib/ai/server/access': { reserveAiRequest: async (id) => reservations.push(id), createPhotoResolver: () => async () => '' },
  })('src/app/api/ai/route.ts')
  return { calls, reservations, post: (body = { projectId: 'p', task: 'generateMenu', input: validInput() }) => POST(request(body)) }
}

test('API rejects missing auth, foreign projects and wrong-mode operations before spending credits', async () => {
  for (const [options, status] of [[{ uid: null }, 401], [{ project: { ownerId: 'other', mode: 'menu' } }, 403], [{ project: { ownerId: 'u', mode: 'portfolio' } }, 400]]) {
    const h = routeHarness(options)
    assert.equal((await h.post()).status, status)
    assert.equal(h.calls.length, 0)
    assert.equal(h.reservations.length, 0)
  }
})

test('API rejects unknown operations, excessive history and oversized requests', async () => {
  const h = routeHarness()
  for (const [body, status] of [
    [{ projectId: 'p', task: 'constructor', input: validInput() }, 400],
    [{ projectId: '../p', task: 'generateMenu', input: validInput() }, 400],
    [{ projectId: 'p', task: 'generateMenu', input: { ...validInput(), history: Array(9).fill({ role: 'user', content: 'x' }) } }, 400],
    [{ projectId: 'p', task: 'generateMenu', input: { ...validInput(), prompt: 'x'.repeat(520000) } }, 413],
  ]) assert.equal((await h.post(body)).status, status)
  assert.equal(h.calls.length, 0)
})

test('missing API key is a configuration error; authenticated menu chat needs no subscription', async (t) => {
  const previousKey = process.env.OPENAI_API_KEY
  t.after(() => { if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey })
  delete process.env.OPENAI_API_KEY
  const h = routeHarness()
  const absent = await h.post()
  assert.equal(absent.status, 503)
  assert.equal((await absent.json()).error, 'AI_NOT_CONFIGURED')
  assert.equal(h.reservations.length, 0)
  process.env.OPENAI_API_KEY = 'test-key'
  const response = await h.post()
  assert.equal(response.status, 200)
  assert.equal((await response.json()).result.message, 'Hello')
  assert.deepEqual(h.reservations, ['u'])
})

test('photo access uses owned project records and rejects foreign or unsafe sources', async () => {
  const photos = {
    good: { ownerId: 'u', projectId: 'p', urls: { thumb: 'https://storage.googleapis.com/thumb', full: 'https://storage.googleapis.com/full' } },
    foreign: { ownerId: 'other', projectId: 'p', urls: { full: 'https://storage.googleapis.com/foreign' } },
    local: { ownerId: 'u', projectId: 'p', urls: { full: 'http://127.0.0.1/secret' } },
  }
  const { createPhotoResolver } = loader({
    './request': { isAiId: (id) => typeof id === 'string' && /^[a-z_-]+$/.test(id) },
    '@/lib/firebase/admin': { adminDb: { collection: () => ({ doc: (id) => ({ get: async () => ({ data: () => photos[id] }) }) }) } },
  })('src/lib/ai/server/access.ts')
  const resolve = createPhotoResolver('u', 'p', true)
  assert.equal(await resolve('good'), 'https://storage.googleapis.com/full')
  await assert.rejects(resolve('foreign'), /AI_PHOTO_UNAVAILABLE/)
  await assert.rejects(resolve('local'), /AI_PHOTO_UNAVAILABLE/)
})

test('shared usage limits reject excess calls and reset on the next UTC day', async () => {
  const day = new Date().toISOString().slice(0, 10)
  const minute = Math.floor(Date.now() / 60_000)
  let record = { day, minute, dayCount: 119, minuteCount: 0 }
  const { reserveAiRequest } = loader({
    './request': { isAiId: () => true },
    '@/lib/firebase/admin': { adminDb: {
      collection: () => ({ doc: () => ({}) }),
      runTransaction: async (action) => action({ get: async () => ({ data: () => record }), set: (_ref, value) => { record = value } }),
    } },
  })('src/lib/ai/server/access.ts')
  await reserveAiRequest('u')
  assert.equal(record.dayCount, 120)
  await assert.rejects(reserveAiRequest('u'), /AI_DAILY_LIMIT/)
  record = { day: '2000-01-01', minute: 0, dayCount: 120, minuteCount: 30 }
  await reserveAiRequest('u')
  assert.equal(record.dayCount, 1)
  record = { day, minute, dayCount: 30, minuteCount: 30 }
  await assert.rejects(reserveAiRequest('u'), /AI_RATE_LIMIT/)
})

test('food enhancement sends each selected style with one source and fixed economical settings', async (t) => {
  const previousKey = process.env.OPENAI_API_KEY
  process.env.OPENAI_API_KEY = 'test-key'
  t.after(() => { if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey })
  const generated = Buffer.from('RIFF0000WEBPtest')
  const calls = []
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options })
    if (url === 'https://storage.googleapis.com/owned-photo') return new Response('original-image', { headers: { 'content-type': 'image/webp' } })
    return Response.json({ data: [{ b64_json: generated.toString('base64') }] })
  })
  const { enhanceFoodPhoto } = load('src/lib/ai/server/enhance-photo.ts')
  const prompts = new Set()
  for (const [style, servingSurface] of [['eveningWood', /matte walnut serving board/], ['daylightCeramic', /matte ivory ceramic plate/], ['darkSlate', /matte charcoal slate serving slab/]]) {
    calls.length = 0
    const result = await enhanceFoodPhoto('https://storage.googleapis.com/owned-photo', style, new AbortController().signal)
    assert.deepEqual(result, generated)
    assert.equal(calls.length, 2)
    assert.equal(calls[0].options.redirect, 'error')
    assert.equal(calls[1].url, 'https://api.openai.com/v1/images/edits')
    const form = calls[1].options.body
    assert.equal(form.get('model'), 'gpt-image-2.5-flare')
    assert.equal(form.get('size'), '1024x1024')
    assert.equal(form.get('quality'), 'medium')
    assert.equal(form.get('n'), '1')
    assert.equal(form.get('output_format'), 'webp')
    assert.equal(await form.get('image').text(), 'original-image')
    assert.match(form.get('prompt'), /Keep the dish recognizably the same/)
    assert.match(form.get('prompt'), servingSurface)
    prompts.add(form.get('prompt'))
  }
  assert.equal(prompts.size, 3)
})

test('photo downloads have a byte limit and unsupported input formats never invoke OpenAI', async (t) => {
  const previousKey = process.env.OPENAI_API_KEY
  process.env.OPENAI_API_KEY = 'test-key'
  t.after(() => { if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey })
  const { readImageBytes, enhanceFoodPhoto } = load('src/lib/ai/server/enhance-photo.ts')
  await assert.rejects(readImageBytes(new Response('too many bytes'), 4), /AI_PHOTO_TOO_LARGE/)
  let calls = 0
  t.mock.method(globalThis, 'fetch', async () => { calls++; return new Response('<svg/>', { headers: { 'content-type': 'image/svg+xml' } }) })
  await assert.rejects(enhanceFoodPhoto('https://storage.googleapis.com/image', 'eveningWood', new AbortController().signal), /AI_PHOTO_FORMAT/)
  assert.equal(calls, 1)
})

test('image provider failure is not automatically retried or exposed as a generated result', async (t) => {
  const previousKey = process.env.OPENAI_API_KEY
  process.env.OPENAI_API_KEY = 'test-key'
  t.after(() => { if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey })
  let calls = 0
  t.mock.method(console, 'warn', () => {})
  t.mock.method(globalThis, 'fetch', async () => ++calls === 1
    ? new Response('original', { headers: { 'content-type': 'image/jpeg' } })
    : Response.json({ error: { message: 'provider internals' } }, { status: 429 }))
  const { enhanceFoodPhoto } = load('src/lib/ai/server/enhance-photo.ts')
  await assert.rejects(enhanceFoodPhoto('https://storage.googleapis.com/image', 'eveningWood', new AbortController().signal), /AI_RATE_LIMIT/)
  assert.equal(calls, 2)
})

function enhancementRouteHarness({ uid = 'u', project = { ownerId: 'u', mode: 'menu', status: 'active' } } = {}) {
  const calls = []
  const { readImageBytes } = load('src/lib/ai/server/enhance-photo.ts')
  const { POST } = loader({
    '@/lib/api/require-auth': { requireAuth: async () => uid ? { uid } : { error: Response.json({}, { status: 401 }) } },
    '@/lib/firebase/admin': { adminDb: { collection: () => ({ doc: () => ({ get: async () => ({ data: () => project }) }) }) } },
    '@/lib/ai/server/request': { isAiId: (value) => typeof value === 'string' && /^[a-z0-9_-]+$/.test(value) },
    '@/lib/ai/server/access': {
      createPhotoResolver: () => async () => 'https://storage.googleapis.com/owned',
      reserveAiRequest: () => { throw new Error('No allowance should be checked') },
    },
    '@/lib/ai/server/openai': { AiServiceError },
    '@/lib/ai/server/enhance-photo': { readImageBytes, enhanceFoodPhoto: async (...args) => { calls.push(args); return Buffer.from('RIFF0000WEBPtest') } },
  })('src/app/api/ai/enhance-photo/route.ts')
  return { calls, post: (body = { projectId: 'p', photoId: 'photo', style: 'eveningWood' }) => POST(request(body)) }
}

test('photo test access works beyond three attempts without a subscription', async () => {
  const h = enhancementRouteHarness()
  for (let index = 0; index < 4; index++) {
    const response = await h.post()
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('content-type'), 'image/webp')
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
  assert.equal(h.calls.length, 4)
  assert.equal(h.calls[0][1], 'eveningWood')
})

test('photo endpoint passes selected styles and rejects missing or unknown styles before generation', async () => {
  const h = enhancementRouteHarness()
  for (const style of ['eveningWood', 'daylightCeramic', 'darkSlate']) {
    assert.equal((await h.post({ projectId: 'p', photoId: 'photo', style })).status, 200)
    assert.equal(h.calls.at(-1)[1], style)
  }
  for (const style of [undefined, null, '', 'unknown', '__proto__', 'constructor', {}, ['eveningWood']]) {
    assert.equal((await h.post({ projectId: 'p', photoId: 'photo', style })).status, 400)
  }
  assert.equal(h.calls.length, 3)
})

test('photo endpoint rejects unauthenticated, foreign and non-menu requests before generation', async () => {
  for (const [options, status] of [[{ uid: null }, 401], [{ project: { ownerId: 'other', mode: 'menu' } }, 403], [{ project: { ownerId: 'u', mode: 'portfolio' } }, 403]]) {
    const h = enhancementRouteHarness(options)
    assert.equal((await h.post()).status, status)
    assert.equal(h.calls.length, 0)
  }
  const h = enhancementRouteHarness()
  assert.equal((await h.post({ projectId: 'p', photoId: '../foreign', style: 'eveningWood' })).status, 400)
  assert.equal((await h.post({ projectId: 'p', photoId: 'photo', style: 'eveningWood', padding: 'x'.repeat(5000) })).status, 400)
  assert.equal(h.calls.length, 0)
})

function uploadedPhotoHarness() {
  const listeners = new Map()
  const uploads = createStore(() => ({ entries: [] }))
  const { waitForProjectImage } = loader({
    '@/lib/firebase': { db: {} },
    '@/editor/lib/store/uploads': { useUploadStore: uploads },
    'firebase/firestore': {
      doc: (_db, ...parts) => parts.join('/'),
      onSnapshot: (ref, next) => { listeners.set(ref, next); return () => listeners.delete(ref) },
    },
  })('src/editor/image/editor/wait-for-image.ts')
  return { listeners, uploads, wait: (signal) => waitForProjectImage('image', 'p', 'u', signal),
    emit: (ref, data) => listeners.get(ref)?.({ exists: () => !!data, data: () => data }) }
}

test('applying an enhanced photo waits for a durable owned media record', async () => {
  const h = uploadedPhotoHarness()
  const pending = h.wait(new AbortController().signal)
  h.emit('projects/p/imageJobs/image', { status: 'processing' })
  h.emit('images/image', { ownerId: 'u', projectId: 'p', urls: { full: 'permanent-url', thumb: 'thumbnail' } })
  const result = await pending
  assert.equal(result.urls.full, 'permanent-url')
  assert.equal(h.listeners.size, 0)
})

test('cancelled or failed image saves clean up listeners without applying partial data', async () => {
  for (const outcome of ['cancel', 'storageLimit', 'foreign']) {
    const h = uploadedPhotoHarness(), controller = new AbortController()
    const pending = h.wait(controller.signal)
    const rejected = assert.rejects(pending)
    if (outcome === 'cancel') controller.abort()
    else if (outcome === 'storageLimit') h.emit('projects/p/imageJobs/image', { status: 'failed', errorCode: 'storageLimit' })
    else h.emit('images/image', { ownerId: 'other', projectId: 'p', urls: { full: 'foreign' } })
    await rejected
    assert.equal(h.listeners.size, 0)
  }
})
