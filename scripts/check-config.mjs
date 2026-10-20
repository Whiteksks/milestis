import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { loadProjectEnvironment, validateProjectEnvironment } from './project-environment.mjs'

const env = loadProjectEnvironment()
const { site, functions } = validateProjectEnvironment(env)
const firebase = JSON.parse(readFileSync('.firebaserc', 'utf8'))
if (firebase.projects?.default !== functions.projectId) throw new Error('Firebase project does not match the application. Run npm run configure.')
const functionsEnv = existsSync('functions/.env') ? parseEnv(readFileSync('functions/.env', 'utf8')) : {}
const expected = { NEXT_PUBLIC_APP_URL: site.appUrl, NEXT_PUBLIC_PUBLISHED_SITE_URL: site.publishedSiteUrl, NEXT_PUBLIC_SUPPORT_EMAIL: site.supportEmail, NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION: functions.region }
for (const [key, value] of Object.entries(expected)) {
  if (functionsEnv[key] !== value) throw new Error(`Functions configuration differs for ${key}. Run npm run configure.`)
}
if (process.argv.includes('--integrations')) {
  for (const key of ['OPENAI_API_KEY', 'POLAR_ACCESS_TOKEN']) if (!env[key]?.trim()) throw new Error(`Missing server credential: ${key}`)
}
console.log(`Configuration OK: ${new URL(site.appUrl).host}; Firebase project ${functions.projectId}; region ${functions.region}; Polar ${env.POLAR_SERVER}.`)
