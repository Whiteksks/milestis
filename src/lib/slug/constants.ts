import { siteConfig } from '../../config/site'

export const PUBLISHED_PROJECT_SLUGS_COLLECTION = "published_project_slugs"

export const PUBLIC_SITE_DOMAIN = siteConfig.publishedSiteHost
export const SLUG_MIN_LENGTH = 3
export const SLUG_MAX_LENGTH = 24
export const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

/** Slugs that are reserved for system use or brand protection. */
export const SLUG_BLOCKLIST = new Set([
  // Brand
  "milestis",
  // Infrastructure / DNS
  "www", "mail", "smtp", "ftp", "cdn", "api", "app", "static",
  "assets", "media", "files", "images", "public", "internal",
  // Environments
  "dev", "staging", "prod", "test", "demo", "localhost",
  // Auth & user
  "admin", "dashboard", "login", "logout", "auth", "signup",
  "register", "account", "settings", "profile", "me", "user", "users",
  // Content pages
  "home", "index", "root", "about", "pricing", "blog", "help",
  "support", "careers", "jobs", "status", "legal", "terms",
  "privacy", "policies", "billing", "store", "shop", "docs",
  "documentation", "releases", "features", "story",
  // Misc reserved
  "null", "undefined", "system",
])
