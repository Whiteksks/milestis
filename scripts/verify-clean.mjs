import { cpSync, existsSync, mkdirSync, mkdtempSync, openSync, closeSync, readFileSync, writeFileSync } from 'node:fs'
import { spawn, spawnSync } from 'node:child_process'
import { createServer } from 'node:net'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { integrationSettings, loadProjectEnvironment, validateProjectEnvironment } from './project-environment.mjs'

const root = process.cwd()
const sourceEnv = loadProjectEnvironment({ production: true })
const { publicNames } = validateProjectEnvironment(sourceEnv, { production: true })
const npmCli = process.env.npm_execpath
if (!npmCli || !existsSync(npmCli)) throw new Error('Run this check with npm run verify:clean')
const base = path.join(root, '.verification')
mkdirSync(base, { recursive: true })
const work = mkdtempSync(path.join(tmpdir(), 'milestis-verify-'))
const listing = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' })
if (listing.status !== 0) throw new Error('Cannot enumerate project source files')
for (const file of new Set(listing.stdout.split('\0').filter(Boolean))) {
  if (!existsSync(path.join(root, file)) || /(^|\/)(?:node_modules|\.git|\.next|\.verification)(\/|$)/.test(file) || /^functions\/lib\//.test(file) || /\.tsbuildinfo$/.test(file) || /(^|\/)\.env(?!\.example$)/.test(file)) continue
  const destination = path.join(work, file)
  mkdirSync(path.dirname(destination), { recursive: true })
  cpSync(path.join(root, file), destination)
}
const cleanSettings = {
  ...Object.fromEntries([...publicNames, 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY', 'NEXT_PUBLIC_SOCIAL_PROFILES', 'FIRESTORE_LOCATION', 'CORS_EXTRA_ORIGINS'].filter(key => sourceEnv[key]).map(key => [key, sourceEnv[key]])),
  ...integrationSettings(sourceEnv),
}
writeFileSync(path.join(work, '.env.local'), Object.entries(cleanSettings).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join('\n') + '\n')
// Carry OS/runtime settings only. No developer cloud credentials or provider tokens.
const osNames = new Set(['path', 'systemroot', 'windir', 'comspec', 'pathext', 'temp', 'tmp', 'appdata', 'localappdata', 'userprofile', 'homedrive', 'homepath', 'programfiles', 'programfiles(x86)', 'programdata', 'os', 'processor_architecture', 'number_of_processors', 'lang', 'lc_all', 'home'])
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => osNames.has(key.toLowerCase())))
Object.assign(env, { NEXT_TELEMETRY_DISABLED: '1', NPM_CONFIG_CACHE: path.join(base, 'npm-cache'), NPM_CONFIG_UPDATE_NOTIFIER: 'false', XDG_CONFIG_HOME: path.join(work, '.config') })
function npm(args, cwd = work) {
  console.log(`\nChecking ${path.relative(work, cwd) || 'application'}: npm ${args.join(' ')}`)
  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd, env, stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`Clean verification failed: npm ${args.join(' ')}. Inspection directory: ${work}`)
}
console.log(`Clean verification directory: ${work}`)
npm(['ci', '--no-audit', '--no-fund'])
npm(['ci', '--no-audit', '--no-fund'], path.join(work, 'functions'))
npm(['exec', '--no', '--', 'firebase', '--version'])
npm(['run', 'configure', '--', '--production'])
npm(['run', 'check'])
const manifest = JSON.parse(readFileSync(path.join(work, '.next', 'prerender-manifest.json'), 'utf8'))
if (!manifest.routes || !Object.keys(manifest.routes).length) throw new Error('Build produced no prerendered pages')
const reservation = createServer()
await new Promise((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve) })
const port = reservation.address().port
await new Promise((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()))
const serverLog = openSync(path.join(work, 'production-server.log'), 'w')
const server = spawn(process.execPath, [path.join(work, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: work, env, stdio: ['ignore', serverLog, serverLog], windowsHide: true })
try {
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(`Production server stopped. See ${path.join(work, 'production-server.log')}`)
    try { ready = (await fetch(`http://127.0.0.1:${port}/llms.txt`, { signal: AbortSignal.timeout(1000) })).ok }
    catch { /* The server is still starting. */ }
    if (ready) break
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  if (!ready) throw new Error('Production server did not become ready')
  for (const [route, status] of [['/en', 200], ['/llms.txt', 200], ['/en/dashboard/analytics', 404], ['/api/internal/debug', 404]]) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`, { signal: AbortSignal.timeout(10000) })
    if (response.status !== status) throw new Error(`${route}: expected ${status}, received ${response.status}`)
    await response.arrayBuffer()
  }
  console.log('\nClean installation, configuration, lint, tests, builds and production HTTP smoke checks: OK.')
} finally {
  server.kill()
  closeSync(serverLog)
}
