import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'
import { createStore } from 'zustand/vanilla'

// Exercise the actual TS modules without adding a test framework or changing app compilation.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const requireDependency = createRequire(import.meta.url)
const cache = new Map()
function loadSource(file) {
  let filename = path.resolve(root, file)
  if (!path.extname(filename)) filename += existsSync(`${filename}.ts`) ? '.ts' : '.tsx'
  if (cache.has(filename)) return cache.get(filename).exports
  const sourceModule = { exports: {} }
  cache.set(filename, sourceModule)
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText
  const localRequire = (id) => id.startsWith('.') ? loadSource(path.resolve(path.dirname(filename), id))
    : id.startsWith('@/') ? loadSource(path.join(root, 'src', id.slice(2))) : requireDependency(id)
  vm.runInThisContext(`(function(require, module, exports) {${compiled}\n})`, { filename })(localRequire, sourceModule, sourceModule.exports)
  return sourceModule.exports
}

const model = loadSource('src/editor/modes/menu/model.ts')
const { createMenuSlice } = loadSource('src/editor/modes/menu/store-slice.ts')
const { MENU_LIMITS } = loadSource('src/editor/modes/menu/content-types.ts')
const { extractMenuDraft, restoreMenuDraft } = loadSource('src/editor/modes/menu/draft.ts')
const { readMenuContent, publicMenuContent } = loadSource('functions/src/domain/menu/content.ts')
const { findPageByPath, PAGE_LIMITS } = loadSource('functions/src/domain/pages.ts')
const { nextMenuPagePath, suggestMenuPagePath } = loadSource('functions/src/domain/menu/page-commands.ts')
const selection = loadSource('src/editor/modes/menu/guest-selection.ts')
// Some domain tests deliberately start with an incomplete saved draft.
function addDraftDish(store, categoryId) {
  const id = crypto.randomUUID()
  store.setState((state) => ({ menuContent: {
    ...state.menuContent,
    dishes: [...state.menuContent.dishes, { id, categoryId, name: '', description: '', priceMinor: null, visible: true }],
  } }))
  return id
}
function menuWithDish() {
  const store = createStore(createMenuSlice)
  store.getState().addMenuCategory('home')
  const categoryId = store.getState().menuContent.categories[0].id
  store.getState().updateMenuCategory(categoryId, { name: 'Breakfast' })
  addDraftDish(store, categoryId)
  const dishId = store.getState().menuContent.dishes[0].id
  store.getState().updateMenuDish(dishId, { name: 'Toast', priceMinor: 1299 })
  return { store, categoryId, dishId }
}

test('guest selection follows dishes across pages and uses current prices', () => {
  const { store, categoryId, dishId } = menuWithDish()
  const content = store.getState().menuContent
  content.pages.push({ id: 'drinks', name: 'Drinks', path: '/drinks', content: { categoryIds: [categoryId] } })
  let chosen = selection.changeMenuSelection({}, dishId, 1)
  chosen = selection.changeMenuSelection(chosen, dishId, 1)
  assert.equal(selection.resolveMenuSelection(chosen, content).totalPriceMinor, 2598)
  content.dishes[0].priceMinor = 1500
  assert.equal(selection.resolveMenuSelection(chosen, content).totalPriceMinor, 3000)
  content.pages[0].content.categoryIds = []
  assert.equal(selection.resolveMenuSelection(chosen, content).items[0].dish?.id, dishId)
  content.dishes[0].visible = false
  assert.equal(selection.resolveMenuSelection(chosen, content).items[0].dish, null)
  assert.equal(selection.resolveMenuSelection(chosen, content).totalPriceMinor, 0)
  assert.deepEqual(selection.changeMenuSelection(chosen, dishId, -1), { [dishId]: 1 })
})

test('stored guest selection accepts only bounded IDs and quantities', () => {
  const parsed = selection.readMenuSelection({ dish: 2, broken: -1, decimal: 1.5, huge: 100, '': 1 })
  assert.deepEqual(parsed, { dish: 2 })
  assert.deepEqual(selection.changeMenuSelection(parsed, 'dish', -1), { dish: 1 })
  assert.deepEqual(selection.changeMenuSelection({ dish: 1 }, 'dish', -1), {})
  assert.deepEqual(selection.readMenuSelection([]), {})
})

test('prices retain exact minor units and reject malformed, negative and over-limit values', () => {
  for (const [input, expected] of [['0', 0], ['0,01', 1], ['12.99', 1299], ['1.1', 110], ['9999999.99', 999999999]]) {
    assert.equal(model.parseMenuPrice(input), expected)
    assert.equal(model.parseMenuPrice(model.menuPriceInput(expected)), expected)
  }
  for (const input of ['', '-1', '1.001', '1e3', 'Infinity', 'abc', '10000000', '12.', '1,2.3']) assert.equal(model.parseMenuPrice(input), null)
})

test('category rename preserves dishes; nonempty categories cannot be deleted', () => {
  const { store, categoryId, dishId } = menuWithDish()
  store.getState().updateMenuCategory(categoryId, { name: 'Brunch' })
  store.getState().removeMenuCategory(categoryId)
  assert.equal(store.getState().menuContent.categories[0].name, 'Brunch')
  assert.equal(store.getState().menuContent.dishes[0].categoryId, categoryId)
  store.getState().removeMenuDish(dishId)
  store.getState().removeMenuCategory(categoryId)
  assert.equal(store.getState().menuContent.categories.length, 0)
})

test('visibility affects guests without deleting owner data; incomplete dishes stay out of the public menu', () => {
  const { store, categoryId, dishId } = menuWithDish()
  assert.equal(model.visibleMenuCategories(store.getState().menuContent).length, 1)
  store.getState().updateMenuDish(dishId, { visible: false })
  assert.equal(model.visibleMenuCategories(store.getState().menuContent).length, 0)
  assert.equal(store.getState().menuContent.dishes.length, 1)
  store.getState().updateMenuDish(dishId, { visible: true, priceMinor: null })
  assert.equal(model.visibleMenuCategories(store.getState().menuContent).length, 0)
  store.getState().updateMenuDish(dishId, { priceMinor: 0 })
  assert.equal(model.visibleMenuCategories(store.getState().menuContent)[0].dishes[0].priceMinor, 0)
  store.getState().updateMenuCategory(categoryId, { visible: false })
  assert.equal(model.visibleMenuCategories(store.getState().menuContent).length, 0)
})

test('moving dishes preserves image ownership; deleting a dish clears only its image reference', () => {
  const { store, categoryId, dishId } = menuWithDish()
  const image = { asset: { src: 'https://example.com/dish.webp', width: 100, height: 100 } }
  store.getState().setMenuImage(dishId, image)
  store.getState().setMenuImage(null, image)
  addDraftDish(store, categoryId)
  const second = store.getState().menuContent.dishes[1].id
  store.getState().moveMenuDish(second, -1)
  assert.equal(store.getState().menuContent.dishes[0].id, second)
  assert.deepEqual(store.getState().menuImages.dishes[dishId], image)
  store.getState().updateMenuDish(dishId, { categoryId: 'missing' })
  assert.equal(store.getState().menuContent.dishes.find((d) => d.id === dishId).categoryId, categoryId)
  store.getState().removeMenuDish(dishId)
  assert.equal(store.getState().menuImages.dishes[dishId], undefined)
  assert.deepEqual(store.getState().menuImages.logo, image)
})

test('saved content round-trips with order and prices, and new projects have independent defaults', () => {
  const { store } = menuWithDish()
  const saved = JSON.parse(JSON.stringify(store.getState().menuContent))
  assert.deepEqual(readMenuContent(saved), saved)
  assert.deepEqual(createStore(createMenuSlice).getState().menuContent, model.createMenuContent())
  assert.throws(() => readMenuContent({ ...saved, dishes: [...saved.dishes, { ...saved.dishes[0], id: 'orphan', categoryId: 'missing' }] }), /categoryId/)
})

test('the editor persistence contract restores images and section visibility without carrying data into a new project', () => {
  const { store, dishId } = menuWithDish()
  store.getState().setMenuImage(dishId, { asset: { src: 'https://example.com/photo.webp', width: 80, height: 80 }, presentation: { ratio: 'square' } })
  store.getState().toggleMenuSection('showVenue')
  const snapshot = JSON.parse(JSON.stringify(extractMenuDraft(store.getState())))
  const reopened = createStore(createMenuSlice)
  reopened.setState(restoreMenuDraft(snapshot))
  assert.deepEqual(JSON.parse(JSON.stringify(extractMenuDraft(reopened.getState()))), snapshot)
  reopened.setState(restoreMenuDraft(null))
  assert.deepEqual(reopened.getState().menuContent, model.createMenuContent())
  assert.deepEqual(reopened.getState().menuImages.dishes, {})
  assert.equal(reopened.getState().menuImages.logo, undefined)
  assert.equal(reopened.getState().menuVisibility.showVenue, true)
})

test('limits apply to actions and validation, and reordering stays within category boundaries', () => {
  const { store, categoryId } = menuWithDish()
  for (let i = 0; i < MENU_LIMITS.categories + 1; i++) store.getState().addMenuCategory('home')
  for (let i = 0; i < MENU_LIMITS.dishes + 1; i++) store.getState().addMenuDish('home', categoryId, { name: 'Dish', description: '', priceMinor: 0, visible: true })
  assert.equal(store.getState().menuContent.categories.length, MENU_LIMITS.categories)
  assert.equal(store.getState().menuContent.dishes.length, MENU_LIMITS.dishes)
  const saved = store.getState().menuContent
  assert.throws(() => readMenuContent({ ...saved, dishes: [...saved.dishes, { ...saved.dishes[0], id: 'overflow' }] }), /dishes/)
  const entries = [{ id: 'a', categoryId: 'one' }, { id: 'b', categoryId: 'two' }, { id: 'c', categoryId: 'one' }]
  assert.deepEqual(model.moveMenuDish(entries, 'c', -1).map((d) => d.id), ['c', 'b', 'a'])
  assert.deepEqual(model.moveMenuEntry(entries, 'a', -1), entries)
})

test('page composition preserves catalog identity, independent order and shared dish edits', () => {
  const { store, categoryId, dishId } = menuWithDish()
  store.getState().addMenuCategory('home')
  const second = store.getState().menuContent.categories[1].id
  store.getState().updateMenuCategory(second, { name: 'Drinks' })
  addDraftDish(store, second)
  const drinkId = store.getState().menuContent.dishes[1].id
  store.getState().updateMenuDish(drinkId, { name: 'Coffee', priceMinor: 300 })
  const content = structuredClone(store.getState().menuContent)
  content.pages.push({ id: 'drinks', name: 'Drinks', path: '/drinks', content: { categoryIds: [second, categoryId] } })
  store.setState({ menuContent: readMenuContent(content) })
  store.getState().moveMenuCategory('home', second, -1)
  assert.deepEqual(model.menuPageCategories(store.getState().menuContent).map((c) => c.id), [second, categoryId])
  assert.deepEqual(store.getState().menuContent.categories.map((c) => c.id), [categoryId, second])
  store.getState().moveMenuCategory('home', categoryId, -1)
  assert.deepEqual(model.menuPageCategories(store.getState().menuContent, 'drinks').map((c) => c.id), [second, categoryId])
  store.getState().updateMenuDish(dishId, { priceMinor: 777 })
  for (const pageId of ['home', 'drinks']) {
    assert.equal(model.visibleMenuCategories(store.getState().menuContent, pageId).find((c) => c.id === categoryId).dishes[0].priceMinor, 777)
  }
  const reopened = restoreMenuDraft(JSON.parse(JSON.stringify(extractMenuDraft(store.getState()))))
  assert.deepEqual(reopened.menuContent, store.getState().menuContent)
  assert.equal(findPageByPath(reopened.menuContent, '/drinks').id, 'drinks')
  assert.equal(findPageByPath(reopened.menuContent, '/missing'), undefined)
  assert.deepEqual(model.menuPageCategories(reopened.menuContent, 'missing'), [])
})

test('deleting an empty category removes references from every page without deleting pages', () => {
  const { store, categoryId, dishId } = menuWithDish()
  const content = structuredClone(store.getState().menuContent)
  content.pages.push({ id: 'other', name: 'Other', path: '/other', content: { categoryIds: [categoryId] } })
  store.setState({ menuContent: readMenuContent(content) })
  store.getState().removeMenuCategory(categoryId)
  assert.equal(store.getState().menuContent.categories.length, 1)
  store.getState().removeMenuDish(dishId)
  store.getState().removeMenuCategory(categoryId)
  assert.equal(store.getState().menuContent.pages.length, 2)
  assert.ok(store.getState().menuContent.pages.every((page) => page.content.categoryIds.length === 0))
  assert.deepEqual(readMenuContent(store.getState().menuContent), store.getState().menuContent)
})

test('page validation rejects ambiguous routes, broken references and missing home pages', () => {
  const { store, categoryId } = menuWithDish()
  const base = store.getState().menuContent
  for (const path of ['/Drinks', '/drinks/', '/drinks/tea', '/drinks?x=1', '/drinks#tea', '/%64rinks', '//drinks', '/api', '/_next', '/sites', '/opengraph-image', '/a'.repeat(40)]) {
    assert.throws(() => readMenuContent({ ...base, pages: [...base.pages, { id: 'other', name: '', path, content: { categoryIds: [] } }] }), /path/)
  }
  for (const change of [
    { homePageId: 'missing' },
    { pages: [] },
    { pages: [...base.pages, { ...base.pages[0], path: '/other' }] },
    { pages: [...base.pages, { ...base.pages[0], id: 'other' }] },
    { pages: [{ ...base.pages[0], path: '/home' }] },
    { pages: [{ ...base.pages[0], content: { categoryIds: ['missing'] } }] },
    { pages: [{ ...base.pages[0], content: { categoryIds: [categoryId, categoryId] } }] },
  ]) assert.throws(() => readMenuContent({ ...base, ...change }), /Invalid content/)
  const pages = Array.from({ length: PAGE_LIMITS.pages }, (_, i) => ({ id: `p${i}`, name: '', path: `/p${i}`, content: { categoryIds: [] } }))
  assert.throws(() => readMenuContent({ ...base, pages: [...base.pages, ...pages] }), /pages/)
})

test('unsupported saved structure fails explicitly instead of silently losing content', () => {
  const { store } = menuWithDish()
  const snapshot = JSON.parse(JSON.stringify(extractMenuDraft(store.getState())))
  delete snapshot.sectionContent.pages
  assert.throws(() => restoreMenuDraft(snapshot), /pages/)
  assert.throws(() => readMenuContent(null), /menu/)
  const first = model.createMenuContent()
  const second = model.createMenuContent()
  first.pages[0].content.categoryIds.push('test')
  assert.deepEqual(second.pages[0].content.categoryIds, [])
})

test('public projection includes only referenced complete dishes and preserves page composition', () => {
  const { store, categoryId } = menuWithDish()
  store.getState().addMenuCategory('home')
  const unassignedId = store.getState().menuContent.categories[1].id
  store.getState().updateMenuCategory(unassignedId, { name: 'Private draft' })
  addDraftDish(store, unassignedId)
  const unassignedDish = store.getState().menuContent.dishes[1].id
  store.getState().updateMenuDish(unassignedDish, { name: 'Secret', priceMinor: 100 })
  const draft = structuredClone(store.getState().menuContent)
  draft.pages[0].content.categoryIds = []
  draft.pages.push({ id: 'breakfast', name: 'Breakfast', path: '/breakfast', content: { categoryIds: [categoryId] } })
  const before = structuredClone(draft)
  const published = publicMenuContent(readMenuContent(draft))
  assert.deepEqual(published.pages, draft.pages)
  assert.equal(published.categories.length, 1)
  assert.equal(published.dishes.length, 1)
  assert.deepEqual(readMenuContent(published), published)
  assert.deepEqual(draft, before)
})

test('menu publishing has no active price; existing publication prices remain unchanged', () => {
  const { calculateCreditCost } = loadSource('functions/src/projects/publish/config.ts')
  assert.throws(() => calculateCreditCost('menu', 0), /not enabled/)
  assert.equal(calculateCreditCost('portfolio', 0), 20)
  assert.equal(calculateCreditCost('event', 0), 150)
  assert.equal(calculateCreditCost('photobook', 20), 20)
})

test('page commands preserve identity, reject conflicting edits and swap home paths atomically', () => {
  const { store, categoryId } = menuWithDish()
  const drinksId = store.getState().addMenuPage('Drinks', '/drinks')
  store.getState().setMenuPageCategory(drinksId, categoryId, true)
  const before = store.getState().menuContent
  for (const path of ['/drinks', '/api', '/', '/UPPER']) {
    assert.throws(() => store.getState().addMenuPage('Duplicate', path))
    assert.equal(store.getState().menuContent, before)
  }
  store.getState().updateMenuPage(drinksId, { name: 'Beverages', path: '/drinks' })
  assert.equal(store.getState().menuContent.pages[1].id, drinksId)
  assert.equal(store.getState().menuContent.pages[1].path, '/drinks')
  let writes = 0
  const unsubscribe = store.subscribe(() => { writes++; readMenuContent(store.getState().menuContent) })
  store.getState().updateMenuPage(drinksId, { name: 'Beverages', path: '/drinks', makeHome: true })
  unsubscribe()
  assert.equal(writes, 1)
  assert.equal(store.getState().menuContent.homePageId, drinksId)
  assert.equal(findPageByPath(store.getState().menuContent, '/').id, drinksId)
  assert.equal(findPageByPath(store.getState().menuContent, '/drinks').id, 'home')
  assert.deepEqual(store.getState().menuContent.pages[1].content.categoryIds, [categoryId])
  assert.throws(() => store.getState().removeMenuPage(drinksId), (error) => error.code === 'HOME_REQUIRED')
})

test('category creation, ordering and detachment affect only the selected page composition', () => {
  const { store, categoryId, dishId } = menuWithDish()
  const pageId = store.getState().addMenuPage('Drinks', '/drinks')
  store.getState().addMenuCategory(pageId)
  const drinkCategoryId = store.getState().menuContent.categories[1].id
  store.getState().setMenuPageCategory(pageId, categoryId, true)
  store.getState().setMenuPageCategory(pageId, categoryId, true)
  store.getState().moveMenuCategory(pageId, categoryId, -1)
  assert.deepEqual(model.menuPageCategories(store.getState().menuContent, pageId).map((c) => c.id), [categoryId, drinkCategoryId])
  assert.deepEqual(model.menuPageCategories(store.getState().menuContent, 'home').map((c) => c.id), [categoryId])
  store.getState().setMenuPageCategory(pageId, categoryId, false)
  assert.equal(store.getState().menuContent.dishes[0].id, dishId)
  assert.equal(model.menuPageCategories(store.getState().menuContent, 'home').length, 1)
  assert.deepEqual(model.menuPageCategories(store.getState().menuContent, pageId).map((c) => c.id), [drinkCategoryId])
  const before = store.getState().menuContent
  store.getState().addMenuCategory('missing')
  assert.equal(store.getState().menuContent, before)
})

test('deleting a page preserves its catalog and images for reassignment and persistence', () => {
  const { store } = menuWithDish()
  const pageId = store.getState().addMenuPage('Drinks', '/drinks')
  store.getState().addMenuCategory(pageId)
  const categoryId = store.getState().menuContent.categories[1].id
  addDraftDish(store, categoryId)
  const dishId = store.getState().menuContent.dishes[1].id
  const image = { asset: { src: 'https://example.com/drink.webp', width: 50, height: 50 } }
  const background = { asset: { src: 'https://example.com/drinks-background.webp', width: 1200, height: 800 } }
  store.getState().setMenuImage(dishId, image)
  store.getState().updateMenuPage(pageId, { name: 'Drinks', path: '/drinks' }, background)
  assert.deepEqual(restoreMenuDraft(extractMenuDraft(store.getState())).menuImages.pageBackgrounds[pageId], background)
  store.getState().removeMenuPage(pageId)
  assert.equal(store.getState().menuContent.categories.length, 2)
  assert.equal(store.getState().menuContent.dishes.length, 2)
  assert.deepEqual(store.getState().menuImages.dishes[dishId], image)
  assert.equal(store.getState().menuImages.pageBackgrounds[pageId], undefined)
  store.getState().setMenuPageCategory('home', categoryId, true)
  assert.deepEqual(restoreMenuDraft(extractMenuDraft(store.getState())).menuContent, store.getState().menuContent)
  assert.throws(() => store.getState().removeMenuPage('home'), (error) => error.code === 'HOME_REQUIRED')
})

test('page photo is saved with page settings and follows the page ID when its address changes', () => {
  const store = createStore(createMenuSlice)
  const photo = { asset: { src: 'https://example.com/restaurant.webp', width: 1200, height: 800 } }
  const pageId = store.getState().addMenuPage('Restaurant', '/restaurant', photo)
  assert.deepEqual(store.getState().menuImages.pageBackgrounds[pageId], photo)
  let writes = 0
  const unsubscribe = store.subscribe(() => { writes++ })
  store.getState().updateMenuPage(pageId, { name: 'Dinner', path: '/dinner' }, photo)
  unsubscribe()
  assert.equal(writes, 1)
  assert.deepEqual(restoreMenuDraft(extractMenuDraft(store.getState())).menuImages.pageBackgrounds[pageId], photo)
  store.getState().updateMenuPage(pageId, { name: 'Dinner', path: '/dinner' }, null)
  assert.equal(store.getState().menuImages.pageBackgrounds[pageId], undefined)
})

test('page limits and suggested paths are consistent and failed commands leave content intact', () => {
  const store = createStore(createMenuSlice)
  for (let i = 1; i < PAGE_LIMITS.pages; i++) store.getState().addMenuPage(`Page ${i}`, nextMenuPagePath(store.getState().menuContent))
  const before = store.getState().menuContent
  assert.equal(new Set(before.pages.map((page) => page.path)).size, PAGE_LIMITS.pages)
  assert.throws(() => store.getState().addMenuPage('Overflow', '/overflow'), (error) => error.code === 'PAGE_LIMIT')
  assert.equal(store.getState().menuContent, before)
  assert.throws(() => store.getState().updateMenuPage('home', { name: '  ', path: '/' }), (error) => error.code === 'INVALID_NAME')
  assert.throws(() => store.getState().updateMenuPage('missing', { name: 'Missing', path: '/missing' }), (error) => error.code === 'PAGE_NOT_FOUND')
  assert.equal(store.getState().menuContent, before)
})

test('page names suggest readable free addresses in supported alphabets', () => {
  const content = model.createMenuContent()
  assert.equal(suggestMenuPagePath(content, 'Напитки'), '/napitki')
  assert.equal(suggestMenuPagePath(content, 'Сусындар'), '/susyndar')
  assert.equal(suggestMenuPagePath(content, 'Әлем & кофе'), '/alem-kofe')
  assert.equal(suggestMenuPagePath(content, ''), '/page-2')
  assert.equal(suggestMenuPagePath(content, 'API'), '/api-2')
  content.pages.push({ id: 'drinks', name: 'Drinks', path: '/drinks', content: { categoryIds: [] } })
  assert.equal(suggestMenuPagePath(content, 'Drinks'), '/drinks-2')
})

test('selecting a page changes only UI state and project navigation clears the selection', () => {
  const { useUiStore } = loadSource('src/editor/lib/store/ui.ts')
  const { store } = menuWithDish()
  let contentWrites = 0
  const unsubscribe = store.subscribe(() => contentWrites++)
  const before = extractMenuDraft(store.getState())
  useUiStore.getState().setProjectId('menu-one')
  useUiStore.getState().markClean()
  useUiStore.getState().setActiveMenuPageId('drinks')
  assert.equal(useUiStore.getState().isDirty, false)
  assert.equal(contentWrites, 0)
  assert.deepEqual(extractMenuDraft(store.getState()), before)
  useUiStore.getState().setProjectId('menu-two')
  assert.equal(useUiStore.getState().activeMenuPageId, null)
  unsubscribe()
  useUiStore.getState().setProjectId(null)
})

test('category selection stays in UI state and resets when the page or project changes', () => {
  const { useUiStore } = loadSource('src/editor/lib/store/ui.ts')
  const { store, categoryId } = menuWithDish()
  let writes = 0
  const unsubscribe = store.subscribe(() => writes++)
  useUiStore.getState().setProjectId('menu-one')
  useUiStore.getState().setActiveMenuPageId('home')
  useUiStore.getState().markClean()
  useUiStore.getState().setActiveMenuCategoryId(categoryId)
  assert.equal(useUiStore.getState().activeMenuCategoryId, categoryId)
  assert.equal(useUiStore.getState().isDirty, false)
  assert.equal(writes, 0)
  useUiStore.getState().setActiveMenuPageId('drinks')
  assert.equal(useUiStore.getState().activeMenuCategoryId, null)
  useUiStore.getState().setActiveMenuCategoryId(categoryId)
  useUiStore.getState().setProjectId('menu-two')
  assert.equal(useUiStore.getState().activeMenuCategoryId, null)
  unsubscribe()
  useUiStore.getState().setProjectId(null)
})

test('complete dish creation and editing commit content and image together', () => {
  const { store, categoryId } = menuWithDish()
  const image = { asset: { src: 'https://example.com/tea.webp', width: 100, height: 100 } }
  const input = { name: 'Tea', description: '', priceMinor: 500, visible: true }
  const before = store.getState()
  assert.equal(before.addMenuDish('missing', categoryId, input, image), null)
  assert.equal(before.addMenuDish('home', categoryId, { ...input, name: '' }, image), null)
  assert.equal(before.addMenuDish('home', categoryId, { ...input, priceMinor: null }, image), null)
  assert.equal(store.getState(), before, 'invalid submissions do not create draft entries')
  const events = []
  const unsubscribe = store.subscribe((state) => events.push(state))
  const id = store.getState().addMenuDish('home', categoryId, input, image)
  assert.equal(events.length, 1)
  assert.equal(events[0].menuContent.dishes.find((dish) => dish.id === id).name, 'Tea')
  assert.deepEqual(events[0].menuImages.dishes[id], image)
  assert.equal(store.getState().saveMenuDish(id, { categoryId, ...input, name: '' }, undefined), false)
  assert.equal(events.length, 1)
  assert.equal(store.getState().saveMenuDish(id, { categoryId, ...input, name: 'Black tea', priceMinor: 0 }, undefined), true)
  assert.equal(events.length, 2)
  assert.equal(events[1].menuContent.dishes.find((dish) => dish.id === id).priceMinor, 0)
  assert.equal(events[1].menuImages.dishes[id], undefined)
  unsubscribe()
})

test('the template renders escaped venue text, exact prices and only visible dishes in all supported locales', () => {
  const { createElement } = requireDependency('react')
  const { renderToStaticMarkup } = requireDependency('react-dom/server')
  const { NextIntlClientProvider } = requireDependency('next-intl')
  const { MenuClassic } = loadSource('src/editor/modes/menu/templates/menu-classic.tsx')
  const { getTheme } = loadSource('src/editor/lib/config/themes.ts')
  const { store, categoryId, dishId } = menuWithDish()
  store.getState().updateMenuVenue({ name: '<script>unsafe</script>', currency: 'USD' })
  addDraftDish(store, categoryId)
  const hidden = store.getState().menuContent.dishes[1].id
  store.getState().updateMenuDish(hidden, { name: 'Hidden dish', priceMinor: 500, visible: false })
  for (const locale of ['en', 'ru', 'kz']) {
    const messages = JSON.parse(readFileSync(path.join(root, `messages/${locale}/editor/editor-menu.json`), 'utf8'))
    const html = renderToStaticMarkup(createElement(NextIntlClientProvider, { locale, messages, timeZone: 'UTC' },
      createElement(MenuClassic, { theme: getTheme('parchment'), content: store.getState().menuContent, images: { dishes: {} }, visibility: store.getState().menuVisibility })))
    assert.match(html, /Toast/)
    assert.match(html, /12[.,]99/)
    assert.match(html, /&lt;script&gt;unsafe&lt;\/script&gt;/)
    assert.doesNotMatch(html, /Hidden dish|<script>/)
  }
  store.getState().updateMenuDish(dishId, { priceMinor: null })
  const messages = JSON.parse(readFileSync(path.join(root, 'messages/en/editor/editor-menu.json'), 'utf8'))
  const html = renderToStaticMarkup(createElement(NextIntlClientProvider, { locale: 'en', messages, timeZone: 'UTC' },
    createElement(MenuClassic, { theme: getTheme('parchment'), content: store.getState().menuContent, images: { dishes: {} }, visibility: store.getState().menuVisibility })))
  assert.match(html, /The menu is coming soon/)
  assert.doesNotMatch(html, /Toast/)
})

test('page navigation renders public paths and uses buttons inside the editor preview', () => {
  const { createElement } = requireDependency('react')
  const { renderToStaticMarkup } = requireDependency('react-dom/server')
  const { NextIntlClientProvider } = requireDependency('next-intl')
  const { MenuClassic } = loadSource('src/editor/modes/menu/templates/menu-classic.tsx')
  const { getTheme } = loadSource('src/editor/lib/config/themes.ts')
  const { store } = menuWithDish()
  const pageId = store.getState().addMenuPage('Drinks', '/drinks')
  const messages = JSON.parse(readFileSync(path.join(root, 'messages/en/editor/editor-menu.json'), 'utf8'))
  const props = { pageId, theme: getTheme('parchment'), content: store.getState().menuContent, images: { dishes: {} }, visibility: store.getState().menuVisibility }
  const render = (extra = {}) => renderToStaticMarkup(createElement(NextIntlClientProvider, { locale: 'en', messages, timeZone: 'UTC' }, createElement(MenuClassic, { ...props, ...extra })))
  const html = render()
  assert.match(html, /href="\/"/)
  assert.match(html, /href="\/drinks" aria-current="page"/)
  assert.match(html, /The menu is coming soon/)
  assert.doesNotMatch(html, /Toast/)
  const preview = render({ onPageChange: () => {} })
  assert.match(preview, /<button type="button" aria-current="page"/)
  assert.doesNotMatch(preview, /href="\/drinks"/)
})
