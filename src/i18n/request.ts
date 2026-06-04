import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { getRequestConfig } from 'next-intl/server';

type MessageRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is MessageRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMergeMessages(target: MessageRecord, source: MessageRecord): MessageRecord {
  const merged: MessageRecord = { ...target };

  for (const [key, value] of Object.entries(source)) {
    const currentValue = merged[key];

    if (isPlainObject(currentValue) && isPlainObject(value)) {
      merged[key] = deepMergeMessages(currentValue, value);
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

async function loadSplitMessages(locale: string) {
  const localeDir = path.join(process.cwd(), 'messages', locale);
  const fileNames = (await readdir(localeDir)).filter((fileName) => fileName.endsWith('.json')).sort();

  const messages = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(localeDir, fileName);
      const contents = await readFile(filePath, 'utf8');
      return JSON.parse(contents) as MessageRecord;
    })
  );

  return messages.reduce<MessageRecord>((merged, message) => deepMergeMessages(merged, message), {});
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
