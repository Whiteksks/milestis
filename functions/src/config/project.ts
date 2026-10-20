export function requiredSetting(value: string | undefined, name: string): string {
  if (!value?.trim()) throw new Error(`Missing configuration: ${name}`);
  return value.trim();
}

export function parseOrigin(value: string | undefined, name: string): string {
  const raw = requiredSetting(value, name);
  let url: URL;
  try { url = new URL(raw); }
  catch { throw new Error(`Invalid configuration: ${name} must be an absolute HTTP(S) origin`); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`Invalid configuration: ${name} must be an HTTP(S) origin without a path or credentials`);
  }
  return url.origin;
}

export function createSiteConfig(input: {
  appUrl?: string;
  publishedSiteUrl?: string;
  supportEmail?: string;
  socialProfiles?: string;
}) {
  const appUrl = parseOrigin(input.appUrl, 'NEXT_PUBLIC_APP_URL');
  const publishedSiteUrl = parseOrigin(input.publishedSiteUrl, 'NEXT_PUBLIC_PUBLISHED_SITE_URL');
  const supportEmail = requiredSetting(input.supportEmail, 'NEXT_PUBLIC_SUPPORT_EMAIL');
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(supportEmail)) {
    throw new Error('Invalid configuration: NEXT_PUBLIC_SUPPORT_EMAIL must be an email address');
  }
  if (new URL(appUrl).hostname === new URL(publishedSiteUrl).hostname) {
    throw new Error('The application and published projects must use different hostnames');
  }
  const publishedSuffix = `.${new URL(publishedSiteUrl).hostname}`;
  if (new URL(appUrl).hostname.endsWith(publishedSuffix)) {
    throw new Error('The application hostname must be outside the published project subdomain namespace');
  }
  const socialProfiles = (input.socialProfiles ?? '').split(',').map(value => value.trim()).filter(Boolean).map(value => {
    let url: URL;
    try { url = new URL(value); }
    catch { throw new Error('Invalid configuration: NEXT_PUBLIC_SOCIAL_PROFILES must contain absolute HTTPS URLs'); }
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid social profile URL');
    return url.toString();
  });
  return { appUrl, publishedSiteUrl, publishedSiteHost: new URL(publishedSiteUrl).host, supportEmail, socialProfiles };
}

export function buildPublishedUrl(siteUrl: string, slug: string, subdomain: boolean): string {
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) throw new Error('Invalid published project slug');
  const url = new URL(siteUrl);
  if (subdomain) url.hostname = `${slug}.${url.hostname}`;
  else url.pathname = `/${slug}`;
  return url.toString().replace(/\/$/, '');
}

export function createFunctionsConfig(projectId?: string, region?: string, origin?: string) {
  const project = requiredSetting(projectId, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  const location = requiredSetting(region, 'NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION');
  if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(project)) throw new Error('Invalid Firebase project ID');
  if (!/^[a-z]+-[a-z]+\d+$/.test(location)) throw new Error('Invalid Firebase Functions region');
  const emulatorOrigin = origin ? parseOrigin(origin, 'NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN') : undefined;
  if (emulatorOrigin && new URL(emulatorOrigin).protocol !== 'http:') {
    throw new Error('NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN must use HTTP, matching the Firebase Functions emulator SDK');
  }
  return {
    projectId: project,
    region: location,
    baseUrl: emulatorOrigin ? emulatorOrigin + `/${project}/${location}` : `https://${location}-${project}.cloudfunctions.net`,
  };
}

export function createAllowedOrigins(site: ReturnType<typeof createSiteConfig>, extraOrigins = ''): RegExp[] {
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const published = new URL(site.publishedSiteUrl);
  return [
    new RegExp(`^${escape(site.appUrl)}$`),
    new RegExp(`^${escape(published.protocol)}//(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)?${escape(published.host)}$`),
    ...extraOrigins.split(',').map(value => value.trim()).filter(Boolean).map(value => new RegExp(`^${escape(parseOrigin(value, 'CORS_EXTRA_ORIGINS'))}$`)),
  ];
}
