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
function menuWithDish() {
  const store = createStore(createMenuSlice)
  store.getState().addMenuCategory()
  const categoryId = store.getState().menuContent.categories[0].id
  store.getState().updateMenuCategory(categoryId, { name: 'Breakfast' })
  store.getState().addMenuDish(categoryId)
  const dishId = store.getState().menuContent.dishes[0].id
  store.getState().updateMenuDish(dishId, { name: 'Toast', priceMinor: 1299 })
  return { store, categoryId, dishId }
}

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
  store.getState().addMenuDish(categoryId)
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
  assert.deepEqual(model.normalizeMenuContent(saved), saved)
  assert.deepEqual(createStore(createMenuSlice).getState().menuContent, model.createMenuContent())
  assert.deepEqual(model.normalizeMenuContent(null), model.createMenuContent())
  assert.equal(model.normalizeMenuContent({ ...saved, dishes: [...saved.dishes, { ...saved.dishes[0], id: 'orphan', categoryId: 'missing' }] }).dishes.length, 1)
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

test('limits apply to actions and hydration, and reordering stays within category boundaries', () => {
  const { store, categoryId } = menuWithDish()
  for (let i = 0; i < MENU_LIMITS.categories + 1; i++) store.getState().addMenuCategory()
  for (let i = 0; i < MENU_LIMITS.dishes + 1; i++) store.getState().addMenuDish(categoryId)
  assert.equal(store.getState().menuContent.categories.length, MENU_LIMITS.categories)
  assert.equal(store.getState().menuContent.dishes.length, MENU_LIMITS.dishes)
  const entries = [{ id: 'a', categoryId: 'one' }, { id: 'b', categoryId: 'two' }, { id: 'c', categoryId: 'one' }]
  assert.deepEqual(model.moveMenuDish(entries, 'c', -1).map((d) => d.id), ['c', 'b', 'a'])
  assert.deepEqual(model.moveMenuEntry(entries, 'a', -1), entries)
})

test('menu publishing has no active price; existing publication prices remain unchanged', () => {
  const { calculateCreditCost } = loadSource('functions/src/projects/publish/config.ts')
  assert.throws(() => calculateCreditCost('menu', 0), /not enabled/)
  assert.equal(calculateCreditCost('portfolio', 0), 20)
  assert.equal(calculateCreditCost('event', 0), 150)
  assert.equal(calculateCreditCost('photobook', 20), 20)
})

test('the template renders escaped venue text, exact prices and only visible dishes in all supported locales', () => {
  const { createElement } = requireDependency('react')
  const { renderToStaticMarkup } = requireDependency('react-dom/server')
  const { NextIntlClientProvider } = requireDependency('next-intl')
  const { MenuClassic } = loadSource('src/editor/modes/menu/templates/menu-classic.tsx')
  const { getTheme } = loadSource('src/editor/lib/config/themes.ts')
  const { store, categoryId, dishId } = menuWithDish()
  store.getState().updateMenuVenue({ name: '<script>unsafe</script>', currency: 'USD' })
  store.getState().addMenuDish(categoryId)
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
