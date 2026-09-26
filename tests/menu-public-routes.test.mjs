import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const dependency = createRequire(import.meta.url)
let headerMode = 'portfolio'
let project
let lookups = 0
const MenuPageView = () => null
const PublishedView = () => null
const cache = new Map()
function load(file) {
  let filename = path.resolve(root, file)
  if (!path.extname(filename)) filename += existsSync(`${filename}.ts`) ? '.ts' : '.tsx'
  if (filename.endsWith('.json')) return JSON.parse(readFileSync(filename, 'utf8'))
  if (cache.has(filename)) return cache.get(filename).exports
  const sourceModule = { exports: {} }
  cache.set(filename, sourceModule)
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
  const require = (id) => {
    if (id === 'react') return { ...dependency('react'), cache: (fn) => fn }
    if (id === 'next/headers') return { headers: async () => new Headers(headerMode ? { 'x-milestis-mode': headerMode } : {}) }
    if (id === 'next/navigation') return { notFound: () => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404') } }
    if (id.endsWith('/published-project')) return { getPublishedProjectBySlugGlobal: async () => { lookups++; return project } }
    if (id.endsWith('/menu-page-view')) return { MenuPageView }
    if (id === '@/lib/firebase/admin') return { adminDb: {} }
    if (id === '@/editor/lib/modes/registry') return { MODE_REGISTRY: {} }
    if (id.endsWith('/published-view')) return { PublishedView }
    if (id === '@/lib/slug') return { ...load('src/lib/slug/policy.ts'), ...load('src/lib/slug/constants.ts') }
    if (id.startsWith('@/')) return load(`src/${id.slice(2)}`)
    if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id))
    return dependency(id)
  }
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename })(require, sourceModule, sourceModule.exports)
  return sourceModule.exports
}

const rootRoute = load('src/app/sites/[slug]/page.tsx')
const pageRoute = load('src/app/sites/[slug]/[pagePath]/page.tsx')
const props = (pagePath) => ({ params: Promise.resolve({ slug: 'my-cafe', pagePath }), searchParams: Promise.resolve({}) })
function reset() {
  headerMode = 'portfolio'
  lookups = 0
  project = { mode: 'menu', slug: 'my-cafe', name: 'Cafe', content: { sectionContent: {
    venue: { name: 'Cafe', description: '', currency: 'KZT' }, categories: [], dishes: [], homePageId: 'home',
    pages: [{ id: 'home', name: 'Food', path: '/', content: { categoryIds: [] } }, { id: 'drinks', name: 'Drinks', path: '/drinks', content: { categoryIds: [] } }],
  } } }
}

test('root and nested Next routes pass the resolved published page to the shared renderer', async () => {
  reset()
  const home = await rootRoute.default(props())
  const drinks = await pageRoute.default(props('drinks'))
  assert.equal(home.type, MenuPageView)
  assert.equal(home.props.resolved.page.id, 'home')
  assert.equal(drinks.type, MenuPageView)
  assert.equal(drinks.props.resolved.page.id, 'drinks')
  assert.equal((await rootRoute.generateMetadata(props())).alternates.canonical, 'https://my-cafe.milestis.site')
  assert.equal((await pageRoute.generateMetadata(props('drinks'))).alternates.canonical, 'https://my-cafe.milestis.site/drinks')
})

test('public menu view forwards the saved template on home and nested pages', () => {
  reset()
  const { MenuPageView: ActualMenuPageView } = load('src/app/sites/[slug]/menu-page-view.tsx')
  for (const templateId of ['menu-classic', 'menu-bistro', 'menu-picnic', 'menu-gallery', 'menu-pulse']) {
    project.theme = { currentTemplateId: templateId }
    project.locale = 'ru'
    const menu = project.content.sectionContent
    for (const page of menu.pages) {
      const view = ActualMenuPageView({ resolved: { project, menu, page } }).props.children
      assert.equal(view.type, PublishedView)
      assert.equal(view.props.templateId, templateId)
      assert.equal(view.props.pageId, page.id)
    }
  }
})

test('nested Next routes return notFound for unknown paths, other modes and unavailable projects', async () => {
  reset()
  for (const pagePath of ['missing', 'Drinks', 'api', 'drinks/tea']) {
    await assert.rejects(pageRoute.default(props(pagePath)), /;404/)
    await assert.rejects(pageRoute.generateMetadata(props(pagePath)), /;404/)
  }
  for (const mode of ['portfolio', 'photobook', 'event']) {
    project.mode = mode
    await assert.rejects(pageRoute.default(props('drinks')), /;404/)
  }
  project = null
  await assert.rejects(pageRoute.default(props('drinks')), /;404/)
  await assert.rejects(rootRoute.default(props()), /;404/)
})

test('nested routes require the global namespace header before reading any project', async () => {
  reset()
  for (const mode of [null, 'event', 'photobook', 'invalid']) {
    headerMode = mode
    await assert.rejects(pageRoute.default(props('drinks')), /;404/)
  }
  assert.equal(lookups, 0)
})
