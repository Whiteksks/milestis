import test from 'node:test'
import assert from 'node:assert/strict'
import { createSourceLoader } from './support/source-loader.mjs'

function harness(initial = 'cafe') {
  const states = [], effects = [], timers = new Map(), requests = []
  let stateIndex = 0, effectIndex = 0, timerId = 0, dirty = true, output
  const react = {
    useState: (initialValue) => {
      const index = stateIndex++
      if (!(index in states)) states[index] = typeof initialValue === 'function' ? initialValue() : initialValue
      return [states[index], (value) => {
        const next = typeof value === 'function' ? value(states[index]) : value
        if (!Object.is(states[index], next)) { states[index] = next; dirty = true }
      }]
    },
    useEffect: (callback, dependencies) => {
      const index = effectIndex++
      const previous = effects[index]
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous.dependencies[i]))) {
        effects[index] = { dependencies, callback, cleanup: previous?.cleanup, pending: true }
      }
    },
  }
  const mocks = { react }
  const load = createSourceLoader(mocks, {
    setTimeout: callback => { timers.set(++timerId, callback); return timerId },
    clearTimeout: id => timers.delete(id),
    fetch: (url, options) => new Promise((resolve, reject) => requests.push({ url, options, resolve, reject })),
  })
  mocks['@/lib/slug'] = { ...load('src/lib/slug/validation.ts'), setStoredPublishSlug: () => {} }
  const { usePublishSlug: renderPublishSlug } = load('src/hooks/usePublishSlug.ts')
  function flush() {
    let count = 0
    while (dirty) {
      assert.ok(++count < 20, 'No render loop')
      dirty = false; stateIndex = 0; effectIndex = 0
      output = renderPublishSlug('project', 'menu', initial)
      for (const effect of effects) if (effect.pending) {
        effect.pending = false; effect.cleanup?.(); effect.cleanup = effect.callback()
      }
    }
    return output
  }
  function fire() { for (const [id, callback] of [...timers]) { timers.delete(id); void callback() } }
  async function answer(index, body, ok = true) {
    requests[index].resolve({ ok, json: async () => body })
    await new Promise((resolve) => setImmediate(resolve))
    return flush()
  }
  flush()
  return { flush, fire, answer, requests, current: () => output }
}

test('normalizing CAFE to cafe preserves the completed availability check', async () => {
  const h = harness()
  h.fire()
  await h.answer(0, { available: true })
  h.current().handleSlugChange('CAFE')
  assert.equal(h.flush().slugStatus, 'available')
  h.fire()
  assert.equal(h.requests.length, 1)
})

test('retry checks the same address again after a network failure', async () => {
  const h = harness()
  h.fire()
  assert.equal((await h.answer(0, {}, false)).slugStatus, 'error')
  h.current().retryAvailability()
  assert.equal(h.flush().slugStatus, 'checking')
  h.fire()
  assert.equal(h.requests.length, 2)
  assert.equal((await h.answer(1, { available: true })).slugStatus, 'available')
})

test('a stale response cannot overwrite a newer address even if fetch ignores abort', async () => {
  const h = harness()
  h.fire()
  h.current().handleSlugChange('other-cafe'); h.flush(); h.fire()
  assert.equal(h.requests[0].options.signal.aborted, true)
  await h.answer(1, { available: false })
  assert.equal((await h.answer(0, { available: true })).slugStatus, 'taken')
  assert.equal(h.current().slug, 'other-cafe')
})

test('resetting to the same address rechecks it rather than remaining in checking state', async () => {
  const h = harness()
  h.fire(); await h.answer(0, { available: true })
  h.current().resetSlug(); h.flush(); h.fire()
  assert.equal(h.requests.length, 2)
  assert.equal((await h.answer(1, { available: false })).slugStatus, 'taken')
})

test('malformed server responses are errors, not claimed occupied addresses', async () => {
  const h = harness()
  h.fire()
  assert.equal((await h.answer(0, { error: 'SERVER_ERROR' })).slugStatus, 'error')
})

test('typing a space or hyphen keeps the address valid and does not trigger a new check', async () => {
  const h = harness('')
  h.current().handleSlugChange('my cafe')
  h.flush(); h.fire()
  assert.equal(h.current().input, 'my-cafe')
  await h.answer(0, { available: true })
  h.current().handleSlugChange('my-cafe ')
  const next = h.flush()
  assert.equal(next.input, 'my-cafe-')
  assert.equal(next.slug, 'my-cafe')
  assert.equal(next.slugStatus, 'available')
  h.fire()
  assert.equal(h.requests.length, 1)
  h.current().handleSlugChange('my-cafe-2')
  assert.equal(h.flush().slugStatus, 'checking')
})
