import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { createStore } from 'zustand/vanilla'
import { QueryClient } from '@tanstack/react-query'
import { createSourceLoader as loader } from './support/source-loader.mjs'

const root = path.resolve(import.meta.dirname, '..')
const functionDependency = createRequire(path.join(root, 'functions/package.json'))

function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const tick = () => new Promise((resolve) => setImmediate(resolve))

test('confirmed menu publication moves cached drafts to archive and cancels stale reads', async () => {
  const projectKeys = {
    all: (uid) => ['projects', uid],
    active: (uid) => ['projects', uid, 'active'],
    archived: (uid) => ['projects', uid, 'archived'],
  }
  const { cachePublishedProject } = loader({ '@/hooks/useProjectsQuery': { projectKeys } })('src/lib/projects/published-project-cache.ts')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } })
  const menu = { id: 'menu', mode: 'menu', name: 'Cafe', status: 'active', isPublished: false }
  const other = { id: 'draft', status: 'active' }
  client.setQueryData(projectKeys.active('owner'), [menu, other])
  const stale = deferred()
  const pending = client.fetchQuery({ queryKey: projectKeys.active('owner'), queryFn: () => stale.promise }).catch(() => {})
  // A cancelled read must not put the newly published menu back into drafts.
  const refresh = deferred()
  let reads = 0
  client.setQueryDefaults(projectKeys.archived('owner'), { queryFn: async () => { reads++; return refresh.promise } })
  const publishing = cachePublishedProject(client, 'owner', 'menu', 'cafe')
  await tick()
  assert.deepEqual(client.getQueryData(projectKeys.active('owner')), [other])
  const archived = client.getQueryData(projectKeys.archived('owner'))
  assert.equal(archived[0].status, 'archived')
  assert.equal(archived[0].publishedSlug, 'cafe')
  assert.equal(archived[0].isPublished, true)
  assert.equal(reads, 1)
  // Refetches return current server data; repeat updates must not duplicate cards.
  stale.resolve([other])
  refresh.resolve(archived)
  await Promise.all([pending, publishing])
  await cachePublishedProject(client, 'owner', 'menu', 'cafe')
  assert.equal(client.getQueryData(projectKeys.archived('owner')).length, 1)
  client.clear()
})

function stores() {
  const content = createStore(() => ({ title: 'first' }))
  const theme = createStore(() => ({ currentTheme: 'light', currentTemplateId: 'test', themeCustomizations: {}, customDecorations: [] }))
  const ui = createStore((set) => ({ projectId: 'a', editorMode: 'portfolio', isDirty: true, markClean: () => set({ isDirty: false }) }))
  const mocks = {
    '@/editor/lib/store/content': { useContentStore: content },
    '@/editor/lib/store/theme': { useThemeStore: theme },
    '@/editor/lib/store/ui': { useUiStore: ui },
  }
  return { content, theme, ui, mocks }
}

function saveHarness() {
  const state = stores()
  const commits = []
  const load = loader({ ...state.mocks,
    '../firebase/firebase': { db: {} },
    '@/editor/lib/modes/registry': { MODE_REGISTRY: { portfolio: {
      uiConfig: {}, extractContent: (store) => ({ title: store.title }), extractPreviewMeta: (store) => ({ title: store.title }),
    } } },
    'firebase/firestore': {
      doc: (_db, ...parts) => parts.join('/'), serverTimestamp: () => 'server-time',
      writeBatch: () => {
        const writes = [], result = deferred()
        return { set: (...args) => writes.push(args), update: (...args) => writes.push(args),
          commit: () => { commits.push({ writes, ...result }); return result.promise } }
      },
    },
  })
  return { ...state, commits, ...load('src/lib/projects/save-project.ts') }
}

test('save acknowledgement never clears edits made during the network write', async () => {
  const h = saveHarness()
  const saving = h.saveProject('a')
  await tick()
  h.content.setState({ title: 'edited while saving' })
  h.commits[0].resolve()
  await saving
  assert.equal(h.ui.getState().isDirty, true)
  assert.equal(h.commits[0].writes[0][1].content.title, 'first')
  const latest = h.saveProject('a')
  await tick()
  h.commits[1].resolve()
  await latest
  assert.equal(h.ui.getState().isDirty, false)
  assert.equal(h.commits[1].writes.length, 2, 'content and preview use one atomic batch')
})

test('queued saves retain the original project snapshot after navigation', async () => {
  const h = saveHarness()
  const first = h.saveProject('a')
  h.content.setState({ title: 'second snapshot of a' })
  const second = h.saveProject('a')
  h.ui.setState({ projectId: 'b' })
  h.content.setState({ title: 'private content of b' })
  await tick()
  h.commits[0].resolve()
  await first
  await tick()
  assert.equal(h.commits[1].writes[0][0], 'projects/a/data/content')
  assert.equal(h.commits[1].writes[0][1].content.title, 'second snapshot of a')
  h.commits[1].resolve()
  await second
  assert.equal(h.ui.getState().isDirty, true)
  await assert.rejects(h.saveProject('a'), /Project changed/)
})

test('a failed save leaves the project dirty and does not block the next save', async () => {
  const h = saveHarness()
  const first = h.saveProject('a')
  const rejected = assert.rejects(first, /offline/)
  const second = h.saveProject('a')
  await tick()
  h.commits[0].reject(new Error('offline'))
  await rejected
  assert.equal(h.ui.getState().isDirty, true)
  await tick()
  h.commits[1].resolve()
  await second
  assert.equal(h.ui.getState().isDirty, false)
})

test('AI operation invalidates on manual edits and on switching away then back', async () => {
  for (const change of ['edit', 'navigation']) {
    const h = stores()
    const { createAiOperation } = loader(h.mocks)('src/lib/ai/pipeline/operation.ts')
    const operation = createAiOperation('a')
    operation.apply(() => h.content.setState({ title: 'own write' }))
    assert.equal(operation.isCurrent(), true)
    if (change === 'edit') h.content.setState({ title: 'manual' })
    else { h.ui.setState({ projectId: 'b' }); h.ui.setState({ projectId: 'a' }) }
    await assert.rejects(operation.interrupted, /AI_PROJECT_CHANGED/)
    assert.throws(() => operation.apply(() => h.content.setState({ title: 'late write' })), /AI_PROJECT_CHANGED/)
    operation.dispose()
  }
})

test('AI cancellation and deadline forbid later application', async () => {
  const h = stores()
  const { createAiOperation } = loader(h.mocks)('src/lib/ai/pipeline/operation.ts')
  const controller = new AbortController()
  const cancelled = createAiOperation('a', controller.signal)
  controller.abort()
  await assert.rejects(cancelled.interrupted, /AI_CANCELLED/)
  cancelled.dispose()
  const timed = createAiOperation('a', undefined, 5)
  await assert.rejects(timed.interrupted, /AI_TIMEOUT/)
  assert.throws(() => timed.apply(() => {}), /AI_TIMEOUT/)
  timed.dispose()
})

test('a malformed AI commit rolls back changes already applied in that commit', () => {
  const h = stores()
  const { createAiOperation } = loader(h.mocks)('src/lib/ai/pipeline/operation.ts')
  const operation = createAiOperation('a')
  assert.throws(() => operation.apply(() => {
    h.content.setState({ title: 'half-applied' })
    h.theme.setState({ currentTheme: 'dark' })
    throw new Error('invalid result')
  }), /invalid result/)
  assert.equal(h.content.getState().title, 'first')
  assert.equal(h.theme.getState().currentTheme, 'light')
  operation.dispose()
})

test('uploads share a three-file queue and distinguish transfer completion from processing', async () => {
  const tasks = []
  const { enqueueImageUpload, useUploadStore } = loader({
    '@/lib/firebase': { auth: { currentUser: { uid: 'u' } }, storage: {} },
    'firebase/storage': { ref: (_storage, path) => path, uploadBytesResumable: () => ({
      on: (_event, progress, fail, complete) => { tasks.push({ progress, fail, complete }) },
    }) },
  })('src/editor/lib/store/uploads.ts')
  for (let index = 0; index < 5; index++) enqueueImageUpload(new File(['photo'], `${index}.jpg`, { type: 'image/jpeg' }), 'u', 'p')
  assert.equal(tasks.length, 3)
  assert.deepEqual(useUploadStore.getState().entries.map((entry) => entry.status), ['uploading', 'uploading', 'uploading', 'queued', 'queued'])
  tasks[0].progress({ bytesTransferred: 5, totalBytes: 5 })
  assert.equal(useUploadStore.getState().entries[0].progress, 99)
  tasks[0].complete()
  await tick()
  assert.equal(useUploadStore.getState().entries[0].status, 'processing')
  assert.equal(tasks.length, 4)
  tasks[1].fail(new Error('network lost'))
  await tick()
  assert.equal(useUploadStore.getState().entries[1].status, 'failed')
  assert.equal(tasks.length, 5)
  for (const task of tasks.slice(2)) task.complete()
  await tick()
})

test('invalid upload files are rejected before any network request', () => {
  const { enqueueImageUpload, useUploadStore } = loader({
    '@/lib/firebase': { auth: { currentUser: { uid: 'u' } }, storage: {} },
    'firebase/storage': { ref: () => { throw new Error('must not upload') } },
  })('src/editor/lib/store/uploads.ts')
  enqueueImageUpload({ type: 'image/jpeg', size: 100 * 1024 * 1024, name: 'too-big.jpg' }, 'u', 'p')
  enqueueImageUpload({ type: 'text/plain', size: 20, name: 'notes.txt' }, 'u', 'p')
  assert.deepEqual(useUploadStore.getState().entries.map((entry) => entry.errorCode), ['fileTooLarge', 'unsupportedFormat'])
})

function pipelineHarness() {
  const state = stores(), header = deferred(), hero = deferred(), applied = []
  state.content.setState({ sectionContent: { header: {}, hero: {} }, portfolioImageContent: {} })
  const load = loader({ ...state.mocks,
    '@/editor/lib/store/ai-brief': { useAiBriefStore: { getState: () => ({ markGenerated: () => {} }) } },
    '@/editor/hooks/use-project-images': { getProjectImageThumbUrl: () => '' },
    '../intent/classify': { classifyIntent: async () => ({ kind: 'edit_section', sections: ['header', 'hero'] }) },
    '../menu/pipeline': {}, '../chat/respond': {}, '../style/photobook': {}, '../style/portfolio': {}, '../content/photobook': {},
    '../content/portfolio': { PORTFOLIO_SECTION_KEYS: ['header', 'hero'], generatePortfolioHeader: () => header.promise, generatePortfolioHero: () => hero.promise },
    '@/editor/modes/photobook/store-slice': {},
    '@/editor/modes/portfolio/store-slice': { defaultPortfolioContent: { header: {}, hero: {} } },
    './placement': { isProjectBlank: () => false, applyDefaultPlacement: () => {}, urlToIdMap: () => new Map() },
    './apply': { applyPortfolioHeader: (data) => applied.push(['header', data]), applyPortfolioHero: (data) => applied.push(['hero', data]) },
  })
  const { runAiPipeline } = load('src/lib/ai/pipeline/orchestrator.ts')
  return { ...state, header, hero, applied, run: () => runAiPipeline({ projectId: 'a', mode: 'portfolio', prompt: 'edit', language: 'en', idToDoc: new Map(), newPhotoIds: [] }) }
}

test('failed AI section prevents successful and late sections from mutating the project', async () => {
  const h = pipelineHarness()
  const result = h.run()
  const rejected = assert.rejects(result, /provider failure/)
  h.header.reject(new Error('provider failure'))
  await rejected
  h.hero.resolve({ title: 'late hero' })
  await tick()
  assert.deepEqual(h.applied, [])
})

test('AI waits for all sections before applying successful results', async () => {
  const h = pipelineHarness()
  const result = h.run()
  h.header.resolve({ title: 'header' })
  await tick()
  assert.deepEqual(h.applied, [])
  h.hero.resolve({ title: 'hero' })
  assert.equal((await result).kind, 'applied')
  assert.deepEqual(h.applied.map(([name]) => name), ['header', 'hero'])
})

function imageHarness(limit = 100) {
  const data = new Map([['users/u', { stats: { storageUsedBytes: 0 } }], ['projects/p', { ownerId: 'u', mode: 'portfolio' }]])
  const deleted = []
  const ref = (id) => ({ id, get: async () => snapshot(id) })
  const snapshot = (id) => ({ exists: data.has(id), data: () => data.get(id) })
  const db = {
    doc: ref, collection: (name) => ({ doc: (id) => ref(`${name}/${id}`) }),
    runTransaction: async (action) => {
      const writes = []
      const result = await action({ get: async (doc) => snapshot(doc.id),
        set: (doc, value, options) => writes.push(() => data.set(doc.id, options?.merge ? { ...data.get(doc.id), ...value } : value)),
        update: (doc, value) => writes.push(() => {
          const previous = data.get(doc.id)
          data.set(doc.id, { ...previous, stats: { storageUsedBytes: previous.stats.storageUsedBytes + value['stats.storageUsedBytes'].increment } })
        }),
      })
      writes.forEach((write) => write())
      return result
    },
  }
  const config = loader({
    'firebase-admin/firestore': { FieldValue: { serverTimestamp: () => 1, increment: (amount) => ({ increment: amount }) }, Timestamp: { now: () => ({ toMillis: () => Date.now() }) } },
    'firebase-admin/auth': { getAuth: () => ({}) },
    'firebase-admin/storage': { getStorage: () => ({ bucket: () => ({ file: (name) => ({ delete: async () => { deleted.push(name) } }) }) }) },
    'firebase-functions/v2': { logger: { warn() {}, error() {} } },
    '../lib/firebaseAdmin': { db }, '../users/subscriptionFeatures': { getEffectiveSubscriptionFeatures: () => ({ maxStorageBytes: limit }) },
    './resizeImage': { makeResizeFunction: (config) => config },
  })('functions/src/storage/index.ts').resizeProjectImage
  const event = { data: { name: 'users/u/projects/p/images/i/original.jpg', bucket: 'test', metadata: { originalName: 'photo.jpg' } } }
  return { config, event, data, deleted }
}

test('image jobs reject concurrent delivery and account a completed image only once', async () => {
  const h = imageHarness()
  assert.equal(await h.config.onStart(h.event), true)
  assert.equal(await h.config.onStart(h.event), false)
  await h.config.onComplete(h.event, { full: 'full-url' }, { generatedSizeBytes: 60 })
  await h.config.onComplete(h.event, { full: 'full-url' }, { generatedSizeBytes: 60 })
  assert.equal(h.data.get('users/u').stats.storageUsedBytes, 60)
  assert.equal(h.data.get('projects/p/imageJobs/i').status, 'ready')
  assert.equal(await h.config.onStart(h.event), false)
  await h.config.onError(h.event, new Error('late duplicate failure'))
  assert.deepEqual(h.deleted, [], 'never delete successfully committed image variants')
})

test('quota rejection reports failure and cleans real variant filenames without charging storage', async () => {
  const h = imageHarness(50)
  await h.config.onStart(h.event)
  await assert.rejects(h.config.onComplete(h.event, { full: 'url' }, { generatedSizeBytes: 60 }), /STORAGE_LIMIT/)
  assert.equal(h.data.has('images/i'), false)
  assert.equal(h.data.get('users/u').stats.storageUsedBytes, 0)
  await h.config.onError(h.event, new Error('STORAGE_LIMIT'))
  assert.equal(h.data.get('projects/p/imageJobs/i').errorCode, 'storageLimit')
  assert.deepEqual(h.deleted.map((file) => file.split('/').pop()).sort(), ['full.webp', 'middle.webp', 'original.jpg', 'print.jpg', 'thumb.webp'])
})

test('real Sharp processing bounds tall images and deletes the original only after committing', async () => {
  const h = imageHarness()
  const sharp = functionDependency('sharp')
  const input = await sharp({ create: { width: 100, height: 4000, channels: 3, background: 'red' } }).jpeg().toBuffer()
  const uploaded = new Map(), order = []
  const { makeResizeFunction } = loader({
    sharp,
    'firebase-functions/v2/storage': { onObjectFinalized: (_options, handler) => handler },
    'firebase-functions/v2': { logger: { info() {}, error() {}, warn() {} } },
    'firebase-admin/storage': { getStorage: () => ({ bucket: () => ({
      file: () => ({ download: async ({ destination }) => writeFileSync(destination, input), delete: async () => { order.push('delete') } }),
      upload: async (file, { destination }) => { uploaded.set(destination.split('/').pop(), readFileSync(file)) },
    }) }) },
  })('functions/src/storage/resizeImage.ts')
  const handler = makeResizeFunction({ bucketPrefix: 'users/', keepOriginal: false, outputs: await h.config.outputs(h.event), onComplete: async () => { order.push('commit') } })
  await handler({ ...h.event, data: { ...h.event.data, contentType: 'image/jpeg' } })
  for (const [name, limit] of [['thumb.webp', 512], ['middle.webp', 1280], ['full.webp', 2560]]) {
    const meta = await sharp(uploaded.get(name)).metadata()
    assert.ok(meta.width <= limit && meta.height <= limit, name)
  }
  assert.deepEqual(order, ['commit', 'delete'])
})

test('project API calls preserve request contracts and operation-specific error classes', async t => {
  const auth = { currentUser: null }
  const calls = []
  let response = { ok: true, data: { ok: true, projectId: 'p1', publishedSlug: 'cafe' } }
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, ...options, body: JSON.parse(options.body) })
    return { ok: response.ok, json: async () => response.data }
  })
  const load = loader({
    '@/config/firebase': { functionUrl: name => `https://functions.example.test/${name}` },
    '../firebase/firebase': { auth, db: {} },
  })
  const scenarios = [
    ['create-project-api', 'createProject', ['Project', 'portfolio'], { name: 'Project', mode: 'portfolio' }, 'CreateProjectError', 'Failed to create project'],
    ['force-delete-project-api', 'forceDeleteProject', ['p1'], { projectId: 'p1' }, 'DeleteProjectError', 'Failed to delete project'],
    ['unpublish-project-api', 'unpublishProject', ['p1'], { projectId: 'p1' }, 'UnpublishProjectError', 'Failed to unpublish project'],
    ['publish-project-api', 'publishProject', ['p1', 'cafe', 'quote', 'share'], { projectId: 'p1', slug: 'cafe', quoteId: 'quote', accessToken: 'share' }, 'PublishProjectError', 'Failed to publish project'],
    ['republish-project-api', 'republishProject', ['p1', 'quote'], { projectId: 'p1', quoteId: 'quote' }, 'RepublishProjectError', 'Failed to republish project'],
    ['analyze-project-api', 'analyzeProject', ['p1', 'cafe'], { projectId: 'p1', slug: 'cafe' }, 'AnalyzeProjectError', 'Failed to analyze project'],
    ['analyze-republish-api', 'analyzeRepublish', ['p1'], { projectId: 'p1' }, 'AnalyzeRepublishError', 'Failed to analyze project for republish'],
    ['publish-menu-api', 'publishMenu', ['p1', 'cafe', 'ru', 'quote'], { projectId: 'p1', slug: 'cafe', locale: 'ru', quoteId: 'quote' }, 'PublishProjectError', 'Menu publication failed'],
    ['menu-billing-api', 'reviewMenuPayment', ['p1', 'menu-50'], { action: 'review', projectId: 'p1', planId: 'menu-50' }, 'PublishProjectError', 'Menu billing failed'],
  ]
  for (const [file, name, args, body, errorName, fallback] of scenarios) {
    const api = load(`src/lib/projects/${file}.ts`)
    const ErrorClass = api[errorName] ?? load('src/lib/projects/publish-project-api.ts').PublishProjectError
    auth.currentUser = null
    const previousCalls = calls.length
    await assert.rejects(api[name](...args), error => error instanceof ErrorClass && error.code === 'UNAUTHORIZED')
    assert.equal(calls.length, previousCalls)
    auth.currentUser = { getIdToken: async () => 'id-token' }
    response = { ok: true, data: { ok: true, projectId: 'p1', publishedSlug: 'cafe' } }
    const result = await api[name](...args)
    const endpoint = file === 'menu-billing-api' ? 'menuBilling' : name
    assert.deepEqual(calls.at(-1), { url: `https://functions.example.test/${endpoint}`, method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer id-token' }, body })
    if (name === 'createProject') assert.deepEqual(result, { projectId: 'p1', shareCode: undefined })
    else if (name === 'forceDeleteProject' || name === 'unpublishProject') assert.equal(result, undefined)
    else assert.deepEqual(result, response.data)
    response = { ok: false, data: { error: 'CONFLICT', message: 'Server message' } }
    const message = file === 'menu-billing-api' || name === 'publishMenu' ? fallback : 'Server message'
    await assert.rejects(api[name](...args), error => error instanceof ErrorClass && error.code === 'CONFLICT' && error.message === message)
    response = { ok: false, data: {} }
    await assert.rejects(api[name](...args), error => error instanceof ErrorClass && error.code === 'UNKNOWN' && error.message === fallback)
  }
})

test('shared login form preserves pending email, password errors, Google success and reset behavior', async () => {
  const states = []
  let index = 0, googleSuccesses = 0
  const magicLink = deferred()
  let googleResult = { success: false, error: 'authErrors.popupClosed' }
  const { useLoginForm: renderLoginForm } = loader({
    react: { useState: initial => {
      const position = index++
      if (!(position in states)) states[position] = initial
      return [states[position], value => { states[position] = value }]
    } },
    '@/lib/auth': {
      sendSignInLinkToEmail: email => { assert.equal(email, 'owner@example.test'); return magicLink.promise },
      signInWithPassword: async (email, password) => {
        assert.equal(email, 'owner@example.test')
        assert.equal(password, 'wrong-password')
        return { success: false, error: 'authErrors.invalidCredentials' }
      },
      signInWithGoogle: async () => googleResult,
    },
  })('src/hooks/use-login-form.ts')
  const render = () => { index = 0; return renderLoginForm(() => { googleSuccesses++ }) }
  let form = render()
  form.setEmail('owner@example.test')
  form = render()
  const sending = form.handleSendMagicLink()
  assert.equal(render().loading, true)
  magicLink.resolve({ success: true, error: null })
  await sending
  form = render()
  assert.equal(form.sent, true)
  assert.equal(form.loading, false)
  form.handleChangeEmail()
  form.setPassword('wrong-password')
  form = render()
  await form.handleSignInWithPassword()
  form = render()
  assert.equal(form.error, 'authErrors.invalidCredentials')
  assert.equal(form.loading, false)
  await form.handleGoogleSignIn()
  form = render()
  assert.equal(form.error, 'authErrors.popupClosed')
  assert.equal(googleSuccesses, 0)
  googleResult = { success: true, error: null }
  await form.handleGoogleSignIn()
  form = render()
  assert.equal(googleSuccesses, 1)
  assert.equal(form.error, null)
  assert.equal(form.googleLoading, false)
  form.setShowEmailFlow(true)
  form.setShowPasswordLogin(true)
  render().reset()
  form = render()
  assert.deepEqual([form.email, form.password, form.sent, form.error, form.loading, form.showEmailFlow, form.showPasswordLogin], ['', '', false, null, false, false, false])
})
