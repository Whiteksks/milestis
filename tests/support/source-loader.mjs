import { existsSync, readFileSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { compileFunction } from 'node:vm'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '../..')
const dependency = createRequire(import.meta.url)

function resolveSource(file) {
  const resolved = path.resolve(root, file)
  const candidates = path.extname(resolved) ? [resolved] : [
    resolved, resolved + '.ts', resolved + '.tsx',
    path.join(resolved, 'index.ts'), path.join(resolved, 'index.tsx'),
  ]
  const filename = candidates.find(candidate => existsSync(candidate) && statSync(candidate).isFile())
  if (!filename) throw new Error('Cannot resolve test source: ' + file)
  return filename
}

/** Each loader owns its module cache and mocks; globals replace timers or fetch for deterministic tests. */
export function createSourceLoader(mocks = {}, globals = {}) {
  const cache = new Map()
  const globalNames = Object.keys(globals)
  const globalValues = Object.values(globals)

  function load(file) {
    const filename = resolveSource(file)
    if (cache.has(filename)) return cache.get(filename).exports

    const sourceModule = { exports: {} }
    cache.set(filename, sourceModule)
    try {
      const source = readFileSync(filename, 'utf8')
      if (filename.endsWith('.json')) {
        sourceModule.exports = JSON.parse(source)
        return sourceModule.exports
      }
      const { outputText } = ts.transpileModule(source, {
        fileName: filename,
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
        },
      })
      const require = id => {
        if (Object.hasOwn(mocks, id)) return mocks[id]
        if (id.startsWith('@/')) return load(path.join(root, 'src', id.slice(2)))
        if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id))
        return dependency(id)
      }
      const execute = compileFunction(outputText, ['require', 'module', 'exports', ...globalNames], { filename })
      execute(require, sourceModule, sourceModule.exports, ...globalValues)
      return sourceModule.exports
    } catch (error) {
      cache.delete(filename)
      throw error
    }
  }

  return load
}
