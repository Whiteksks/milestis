import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '../..')
const dependency = createRequire(import.meta.url)
export const field = {
  serverTimestamp: () => ({ operation: 'timestamp' }),
  increment: (amount) => ({ operation: 'increment', amount }),
  delete: () => ({ operation: 'delete' }),
}
export function load(file, mocks) {
  const cache = new Map()
  function visit(file) {
  let filename = path.resolve(root, file)
  if (!path.extname(filename)) filename = existsSync(`${filename}.ts`) ? `${filename}.ts` : path.join(filename, 'index.ts')
  if (cache.has(filename)) return cache.get(filename).exports
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  const sourceModule = { exports: {} }
  cache.set(filename, sourceModule)
  const require = (id) => Object.hasOwn(mocks, id) ? mocks[id] : id.startsWith('.') ? visit(path.resolve(path.dirname(filename), id)) : dependency(id)
  vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`, { filename })(require, sourceModule, sourceModule.exports)
  return sourceModule.exports
  }
  return visit(file)
}

// Snapshot isolation, atomic commits, conflict retries and Firestore's read-before-write rule.
// No network or credentials. Every test executes the real transaction engine.
export function database() {
  let nextId = 0
  let revision = 0
  const records = new Map()
  const versions = new Map()
  const controls = { failQuery: false, failCommit: false, queryReads: 0, retries: 0, beforeCommit: null }
  const getField = (data, name) => name.split('.').reduce((value, part) => value?.[part], data)
  const ref = (key) => ({ path: key, id: key.split('/').at(-1), collection: (name) => query(`${key}/${name}`), get: async () => snapshot(key, records) })
  const snapshot = (key, state, versionMap = versions) => {
    const value = structuredClone(state.get(key))
    const version = versionMap.get(key)
    return { ref: ref(key), id: key.split('/').at(-1), exists: state.has(key), data: () => structuredClone(value),
      updateTime: version ? { value: version, isEqual: (other) => other?.value === version } : undefined }
  }
  function query(key, filters = [], orders = [], count = Infinity, cursor, group = false) {
    const compare = (a, b) => {
      for (const [field, direction] of orders) {
        const av = getField(a.data(), field), bv = getField(b.data(), field)
        if (av !== bv) return (av < bv ? -1 : 1) * (direction === 'desc' ? -1 : 1)
      }
      return a.ref.path.localeCompare(b.ref.path)
    }
    const read = (state) => {
      controls.queryReads++
      if (controls.failQuery) throw new Error('Missing Firestore index')
      const docs = [...state.keys()].filter((entry) => group
        ? entry.split('/').at(-2) === key : entry.startsWith(`${key}/`) && entry.split('/').length === key.split('/').length + 1)
        .map((entry) => snapshot(entry, state))
        .filter((doc) => filters.every(([name, op, value]) => {
          const actual = getField(doc.data(), name)
          return op === '>' ? actual > value : op === '<=' ? actual <= value : actual === value
        })).sort(compare).filter((doc) => !cursor || compare(doc, cursor) > 0).slice(0, count)
      return { docs, size: docs.length, empty: docs.length === 0 }
    }
    return {
      read,
      doc: (id = `auto-${++nextId}`) => ref(`${key}/${id}`),
      where: (...filter) => query(key, [...filters, filter], orders, count, cursor, group),
      orderBy: (...order) => query(key, filters, [...orders, order], count, cursor, group),
      limit: (limit) => query(key, filters, orders, limit, cursor, group),
      startAfter: (after) => query(key, filters, orders, count, after, group),
      get: async () => read(records),
    }
  }
  const db = {
    collection: (name) => query(name),
    collectionGroup: (name) => query(name, [], [], Infinity, undefined, true),
    runTransaction: async (callback) => {
      for (let attempt = 0; attempt < 10; attempt++) {
        const started = revision
        const state = structuredClone(records)
        const versionMap = new Map(versions)
        const writes = []
        const result = await callback({
          get: async (target) => {
            assert.equal(writes.length, 0, 'Firestore does not allow reads after writes')
            return target.read ? target.read(state) : snapshot(target.path, state, versionMap)
          },
          getAll: async (...targets) => {
            assert.equal(writes.length, 0, 'Firestore does not allow reads after writes')
            return targets.map((target) => snapshot(target.path, state, versionMap))
          },
          set: (target, data) => writes.push(['set', target.path, structuredClone(data)]),
          update: (target, data) => writes.push(['update', target.path, structuredClone(data)]),
        })
        if (controls.beforeCommit) {
          const beforeCommit = controls.beforeCommit
          controls.beforeCommit = null
          await beforeCommit()
        }
        if (started !== revision) { controls.retries++; continue }
        if (controls.failCommit) throw new Error('Commit unavailable')
        for (const [kind, key, value] of writes) {
          if (kind === 'update') assert.ok(state.has(key), `Missing document: ${key}`)
          const next = kind === 'set' ? {} : state.get(key)
          for (const [field, item] of Object.entries(value)) {
            const segments = field.split('.')
            let parent = next
            for (const segment of segments.slice(0, -1)) parent = parent[segment] ??= {}
            const name = segments.at(-1)
            if (item?.operation === 'delete') { delete parent[name]; continue }
            parent[name] = item?.operation === 'increment' ? (parent[name] ?? 0) + item.amount
              : item?.operation === 'timestamp' ? 'server-time' : item
          }
          state.set(key, next)
        }
        if (writes.length) {
          records.clear()
          for (const [key, value] of state) records.set(key, value)
          revision++
          for (const [, key] of writes) versions.set(key, revision)
        }
        return result
      }
      throw new Error('Too many transaction retries')
    },
  }
  const put = (key, value) => { records.set(key, structuredClone(value)); versions.set(key, ++revision) }
  return { db, records, controls, put }
}


