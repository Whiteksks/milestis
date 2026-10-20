import { buildPublishedUrl, createSiteConfig } from '../../functions/src/config/project'

export const siteConfig = createSiteConfig({
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  publishedSiteUrl: process.env.NEXT_PUBLIC_PUBLISHED_SITE_URL,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  socialProfiles: process.env.NEXT_PUBLIC_SOCIAL_PROFILES,
})

export function publishedProjectUrl(slug: string, subdomain: boolean): string {
  return buildPublishedUrl(siteConfig.publishedSiteUrl, slug, subdomain)
}
