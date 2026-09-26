/** The subset of JSON Schema used by editor operations. */
export interface AiSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean'
  description?: string
  enum?: string[]
  nullable?: boolean
  properties?: Record<string, AiSchema>
  required?: string[]
  items?: AiSchema
  minItems?: number
  maxItems?: number
  maxLength?: number
  minimum?: number
  maximum?: number
}

/** OpenAI strict schemas require every key; optional values are represented by null. */
export function strictSchema(schema: AiSchema): Record<string, unknown> {
  const { nullable, properties, items, required, ...base } = schema
  const result: Record<string, unknown> = { ...base }
  if (properties) {
    result.properties = Object.fromEntries(Object.entries(properties).map(([key, child]) => [key,
      strictSchema({ ...child, nullable: child.nullable || !required?.includes(key) }),
    ]))
    result.required = Object.keys(properties)
    result.additionalProperties = false
  }
  if (items) result.items = strictSchema(items)
  return nullable ? { anyOf: [result, { type: 'null' }] } : result
}

/** Validate at the boundary and remove nulls that stand for omitted optional fields. */
export function readAiResult(schema: AiSchema, value: unknown): unknown {
  const invalid = () => { throw new Error('AI_INVALID_RESPONSE') }
  if (value === null) return schema.nullable ? null : invalid()
  if (schema.enum && !schema.enum.includes(value as string)) invalid()
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid()
    const raw = value as Record<string, unknown>
    const result: Record<string, unknown> = {}
    if (Object.keys(raw).some((key) => !Object.hasOwn(schema.properties ?? {}, key))) invalid()
    for (const [key, child] of Object.entries(schema.properties ?? {})) {
      if ((raw[key] === null || raw[key] === undefined) && !schema.required?.includes(key)) continue
      result[key] = readAiResult(child, raw[key])
    }
    return result
  }
  if (schema.type === 'array') {
    if (!Array.isArray(value) || !schema.items || value.length < (schema.minItems ?? 0) || value.length > (schema.maxItems ?? 500)) return invalid()
    return value.map((entry) => readAiResult(schema.items!, entry))
  }
  if (schema.type === 'integer' || schema.type === 'number') {
    if (typeof value !== 'number' || !Number.isFinite(value) ||
      (schema.type === 'integer' && !Number.isSafeInteger(value)) ||
      value < (schema.minimum ?? -Infinity) || value > (schema.maximum ?? Infinity)) invalid()
  } else if (typeof value !== schema.type) invalid()
  if (typeof value === 'string' && value.length > (schema.maxLength ?? 30000)) invalid()
  return value
}

export type AiPart = { text: string } | { imageUrl: string }
export interface AiContent { role: 'user' | 'assistant'; parts: AiPart[] }
