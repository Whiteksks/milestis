import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { getRequestConfig } from 'next-intl/server';

async function loadSplitMessages(locale: string) {
  const localeDir = path.join(process.cwd(), 'messages', locale);
  const fileNames = (await readdir(localeDir)).filter((fileName) => fileName.endsWith('.json')).sort();

  const messages = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(localeDir, fileName);
      const contents = await readFile(filePath, 'utf8');
      return JSON.parse(contents) as Record<string, unknown>;
    })
  );

  return Object.assign({}, ...messages);
}

async function loadMessages(locale: string) {
  try {
    return await loadSplitMessages(locale);
  } catch {
    return (await import(`../../messages/${locale}.json`)).default;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'en';

  return {
    locale,
    messages: await loadMessages(locale)
  };
});
