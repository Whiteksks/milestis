/** Runtime-independent validation shared by the editor and publication service. */
export class ContentValidationError extends Error {
  constructor(public readonly path: string) {
    super(`Invalid content at ${path}`);
  }
}

export function readRecord(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ContentValidationError(path);
  return value as Record<string, unknown>;
}

export function readText(value: unknown, path: string, max: number): string {
  if (typeof value !== "string" || value.length > max) throw new ContentValidationError(path);
  return value;
}

export function readId(value: unknown, path: string): string {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(value)) throw new ContentValidationError(path);
  return value;
}

export function readBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") throw new ContentValidationError(path);
  return value;
}

export function readList(value: unknown, path: string, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) throw new ContentValidationError(path);
  return value;
}
