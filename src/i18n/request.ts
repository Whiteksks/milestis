import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

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

async function collectJsonFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });

  const nestedFiles = await Promise.all(
    entries
      .sort((left, right) => left.name.localeCompare(right.name))
      .map(async (entry) => {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return collectJsonFiles(entryPath);
        }

        if (entry.isFile() && entry.name.endsWith('.json')) {
          return [entryPath];
        }

        return [];
      })
  );

  return nestedFiles.flat();
}

async function loadSplitMessages(locale: string) {
  const localeDir = path.join(process.cwd(), 'messages', locale);
  const filePaths = await collectJsonFiles(localeDir);

  const messages = await Promise.all(
    filePaths.map(async (filePath) => {
      const contents = await readFile(filePath, 'utf8');
      return JSON.parse(contents) as MessageRecord;
    })
  );

  return messages.reduce<MessageRecord>((merged, message) => deepMergeMessages(merged, message), {});
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadSplitMessages(locale)
  };
});
