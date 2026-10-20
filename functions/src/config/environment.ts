import { createAllowedOrigins, createSiteConfig, requiredSetting } from './project';

export const siteConfig = createSiteConfig({
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  publishedSiteUrl: process.env.NEXT_PUBLIC_PUBLISHED_SITE_URL,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
});

export const functionsRegion = requiredSetting(process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION, 'NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION');
export const allowedOrigins = createAllowedOrigins(siteConfig, process.env.CORS_EXTRA_ORIGINS);
