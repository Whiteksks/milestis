import nextEnv from '@next/env'
import { createFunctionsConfig, createSiteConfig, requiredSetting } from '../functions/src/config/project.ts'

function productionMode() {
  return process.argv.includes('--production') || process.env.NODE_ENV === 'production'
}

export function loadProjectEnvironment({ production = productionMode() } = {}) {
  return nextEnv.loadEnvConfig(process.cwd(), !production).combinedEnv
}

export function validateProjectEnvironment(env, { production = productionMode() } = {}) {
  if (production && env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN) throw new Error('NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN is for development only; clear it for a production build')
  const site = createSiteConfig({ appUrl: env.NEXT_PUBLIC_APP_URL, publishedSiteUrl: env.NEXT_PUBLIC_PUBLISHED_SITE_URL, supportEmail: env.NEXT_PUBLIC_SUPPORT_EMAIL, socialProfiles: env.NEXT_PUBLIC_SOCIAL_PROFILES })
  const functions = createFunctionsConfig(env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION, env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN)
  const publicNames = [
    'NEXT_PUBLIC_APP_URL', 'NEXT_PUBLIC_PUBLISHED_SITE_URL', 'NEXT_PUBLIC_SUPPORT_EMAIL',
    'NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION',
  ]
  for (const name of publicNames) requiredSetting(env[name], name)
  if (env.POLAR_SERVER !== 'sandbox' && env.POLAR_SERVER !== 'production') throw new Error('POLAR_SERVER must explicitly be sandbox or production')
  for (const name of ['OPENAI_TEXT_MODEL', 'OPENAI_IMAGE_MODEL', 'FIRESTORE_LOCATION']) requiredSetting(env[name], name)
  for (const name of ['POLAR_CREDITS_PRODUCT_ID', 'POLAR_PRODUCT_CREATOR_MONTHLY', 'POLAR_PRODUCT_CREATOR_YEARLY', 'POLAR_PRODUCT_ARCHIVE_MONTHLY', 'POLAR_PRODUCT_ARCHIVE_YEARLY']) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(env[name] ?? '')) throw new Error(`Missing or invalid Polar product ID: ${name}`)
  }
  if (new URL(site.appUrl).protocol === 'https:' && !env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) throw new Error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is required for an HTTPS deployment')
  return { site, functions, publicNames }
}

export function integrationSettings(env) {
  return {
    POLAR_SERVER: env.POLAR_SERVER,
    POLAR_CREDITS_PRODUCT_ID: env.POLAR_CREDITS_PRODUCT_ID,
    POLAR_PRODUCT_CREATOR_MONTHLY: env.POLAR_PRODUCT_CREATOR_MONTHLY,
    POLAR_PRODUCT_CREATOR_YEARLY: env.POLAR_PRODUCT_CREATOR_YEARLY,
    POLAR_PRODUCT_ARCHIVE_MONTHLY: env.POLAR_PRODUCT_ARCHIVE_MONTHLY,
    POLAR_PRODUCT_ARCHIVE_YEARLY: env.POLAR_PRODUCT_ARCHIVE_YEARLY,
    OPENAI_TEXT_MODEL: env.OPENAI_TEXT_MODEL,
    OPENAI_IMAGE_MODEL: env.OPENAI_IMAGE_MODEL,
  }
}
