import 'server-only'
import { requiredSetting } from '../../functions/src/config/project'

export function getAiConfig() {
  return {
    apiKey: requiredSetting(process.env.OPENAI_API_KEY, 'OPENAI_API_KEY'),
    textModel: requiredSetting(process.env.OPENAI_TEXT_MODEL, 'OPENAI_TEXT_MODEL'),
    imageModel: requiredSetting(process.env.OPENAI_IMAGE_MODEL, 'OPENAI_IMAGE_MODEL'),
  }
}

export function getPolarConfig(): { accessToken: string; server: 'sandbox' | 'production' } {
  const server = requiredSetting(process.env.POLAR_SERVER, 'POLAR_SERVER')
  if (server !== 'sandbox' && server !== 'production') throw new Error('POLAR_SERVER must be sandbox or production')
  return { accessToken: requiredSetting(process.env.POLAR_ACCESS_TOKEN, 'POLAR_ACCESS_TOKEN'), server }
}

export function getBillingProducts() {
  const product = (value: string | undefined, name: string) => {
    const id = requiredSetting(value, name)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new Error(`Invalid Polar product ID: ${name}`)
    return id
  }
  return {
    creator: {
      month: product(process.env.POLAR_PRODUCT_CREATOR_MONTHLY, 'POLAR_PRODUCT_CREATOR_MONTHLY'),
      year: product(process.env.POLAR_PRODUCT_CREATOR_YEARLY, 'POLAR_PRODUCT_CREATOR_YEARLY'),
    },
    archive: {
      month: product(process.env.POLAR_PRODUCT_ARCHIVE_MONTHLY, 'POLAR_PRODUCT_ARCHIVE_MONTHLY'),
      year: product(process.env.POLAR_PRODUCT_ARCHIVE_YEARLY, 'POLAR_PRODUCT_ARCHIVE_YEARLY'),
    },
    credits: product(process.env.POLAR_CREDITS_PRODUCT_ID, 'POLAR_CREDITS_PRODUCT_ID'),
  }
}
