import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const templatesRoot = path.join(projectRoot, 'src', 'editor', 'components', 'templates')
const writeMode = process.argv.includes('--write')

const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx'])

const cp1251ExtraBytes = new Map([
  ['Ђ', 0x80], ['Ѓ', 0x81], ['‚', 0x82], ['ѓ', 0x83], ['„', 0x84], ['…', 0x85], ['†', 0x86], ['‡', 0x87],
  ['€', 0x88], ['‰', 0x89], ['Љ', 0x8A], ['‹', 0x8B], ['Њ', 0x8C], ['Ќ', 0x8D], ['Ћ', 0x8E], ['Џ', 0x8F],
  ['ђ', 0x90], ['‘', 0x91], ['’', 0x92], ['“', 0x93], ['”', 0x94], ['•', 0x95], ['–', 0x96], ['—', 0x97],
  ['™', 0x99], ['љ', 0x9A], ['›', 0x9B], ['њ', 0x9C], ['ќ', 0x9D], ['ћ', 0x9E], ['џ', 0x9F], [' ', 0xA0],
  ['Ў', 0xA1], ['ў', 0xA2], ['Ј', 0xA3], ['¤', 0xA4], ['Ґ', 0xA5], ['¦', 0xA6], ['§', 0xA7], ['Ё', 0xA8],
  ['©', 0xA9], ['Є', 0xAA], ['«', 0xAB], ['¬', 0xAC], ['­', 0xAD], ['®', 0xAE], ['Ї', 0xAF], ['°', 0xB0],
  ['±', 0xB1], ['І', 0xB2], ['і', 0xB3], ['ґ', 0xB4], ['µ', 0xB5], ['¶', 0xB6], ['·', 0xB7], ['ё', 0xB8],
  ['№', 0xB9], ['є', 0xBA], ['»', 0xBB], ['ј', 0xBC], ['Ѕ', 0xBD], ['ѕ', 0xBE], ['ї', 0xBF],
])

const singlePassReplacements = [
  ['РІР‚Сћ', '•'],
  ['вЂў', '•'],
  ['РІР‚в„ў', '’'],
  ['вЂ™', '’'],
  ['вЂ', '‘'],
  ['вЂњ', '“'],
  ['вЂќ', '”'],
  ['вЂ“', '–'],
  ['вЂ”', '—'],
  ['в€¦', '…'],
  ['в„–', '№'],
  ['в‚¬', '€'],
  ['в†’', '→'],
  ['в†ђ', '←'],
  ['в†‘', '↑'],
  ['в†“', '↓'],
  ['в†—', '↗'],
  ['в†–', '↖'],
  ['в†', '←'],
  ['в†’', '→'],
  ['в†’', '→'],
]

const suspiciousPattern = /(Р[А-Яа-яA-Za-z]|С[А-Яа-яA-Za-z]|РІ|вЂ|в†|в„|В[«»°-ї]|Ѓ|™|љ|њ|ќ|ћ|џ)/
const likelyCodePattern = /^(import|export|return|const|let|var|type|interface|function)\b/

function walkFiles(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath))
      continue
    }

    if (allowedExtensions.has(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

function cp1251ByteForChar(character) {
  const codePoint = character.codePointAt(0)
  if (codePoint === undefined) {
    return undefined
  }

  if (codePoint <= 0x7F) {
    return codePoint
  }

  if (codePoint >= 0x0410 && codePoint <= 0x044F) {
    return codePoint - 0x350
  }

  if (codePoint === 0x0401) {
    return 0xA8
  }

  if (codePoint === 0x0451) {
    return 0xB8
  }

  return cp1251ExtraBytes.get(character)
}

function decodeCp1251AsUtf8(value) {
  const bytes = []

  for (const character of value) {
    const byte = cp1251ByteForChar(character)
    if (byte === undefined) {
      return null
    }

    bytes.push(byte)
  }

  try {
    const decoded = Buffer.from(bytes).toString('utf8')
    if (decoded.includes('\uFFFD')) {
      return null
    }

    return decoded
  } catch {
    return null
  }
}

function countSuspiciousMatches(value) {
  return (value.match(/Р[А-Яа-яA-Za-z]|С[А-Яа-яA-Za-z]|РІ|вЂ|в†|в„|В[«»°-ї]|Ѓ|™|љ|њ|ќ|ћ|џ/g) ?? []).length
}

function countReadableSignals(value) {
  return (value.match(/[А-Яа-яЁё]/g) ?? []).length + (value.match(/[—–→←↑↓↗↖•‘’“”…№]/g) ?? []).length
}

function candidateQuality(value) {
  return countReadableSignals(value) * 4 - countSuspiciousMatches(value) * 5
}

function isBetterCandidate(original, candidate) {
  if (!candidate || candidate === original) {
    return false
  }

  return candidateQuality(candidate) > candidateQuality(original)
}

function applyCommonReplacements(value) {
  let result = value

  for (let pass = 0; pass < 3; pass += 1) {
    let next = result
    for (const [searchValue, replaceValue] of singlePassReplacements) {
      next = next.split(searchValue).join(replaceValue)
    }

    if (next === result) {
      break
    }

    result = next
  }

  return result
}

function stripStandaloneArtifactSuffix(value) {
  const suffixMatch = value.match(/^(.*\S)\s+(\S+)$/)
  if (!suffixMatch) {
    return value
  }

  const [, prefix, token] = suffixMatch
  if (/(?:РІвЂ|РІР‚|вЂ|в†|в„|Р[A-Za-zА-Яа-я]|С[A-Za-zА-Яа-я])/u.test(token)) {
    return prefix
  }

  if (countReadableSignals(token) > 1) {
    return value
  }

  if (/[A-Za-zА-Яа-яЁё0-9]/.test(token) && !suspiciousPattern.test(token)) {
    return value
  }

  const compactToken = token.replace(/\s+/g, '')
  if (/^[—–→←↑↓↗↖•'’"“”`-]+$/.test(compactToken) || suspiciousPattern.test(token)) {
    return prefix
  }

  return value
}

function normalizeCandidate(value) {
  let result = value

  for (let pass = 0; pass < 3; pass += 1) {
    const candidates = [
      applyCommonReplacements(result),
    ]

    const decoded = decodeCp1251AsUtf8(result)
    if (decoded) {
      candidates.push(decoded)
      candidates.push(applyCommonReplacements(decoded))
    }

    let next = result
    for (const candidate of candidates) {
      if (isBetterCandidate(next, candidate)) {
        next = candidate
      }
    }

    if (next === result) {
      break
    }

    result = next
  }

  return stripStandaloneArtifactSuffix(result)
}

function replaceLineContent(line, transformer) {
  let nextLine = line

  if (line.includes('//')) {
    const commentIndex = line.indexOf('//')
    const comment = line.slice(commentIndex)
    nextLine = line.slice(0, commentIndex) + transformer(comment)
  }

  nextLine = nextLine.replace(/\/\*.*?\*\//g, (match) => transformer(match))
  nextLine = nextLine.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, (match) => transformer(match))

  if (nextLine === line) {
    const trimmed = line.trim()
    const looksLikeJsxText = trimmed.length > 0
      && !trimmed.startsWith('{')
      && !trimmed.startsWith('<')
      && !trimmed.endsWith('>')
      && !likelyCodePattern.test(trimmed)

    if (looksLikeJsxText) {
      nextLine = transformer(line)
    }
  }

  return nextLine
}

function transformLine(line) {
  if (!suspiciousPattern.test(line)) {
    return line
  }

  return replaceLineContent(line, (segment) => {
    if (!suspiciousPattern.test(segment)) {
      return segment
    }

    const candidate = normalizeCandidate(segment)
    return isBetterCandidate(segment, candidate) ? candidate : segment
  })
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  const lines = original.split(/\r?\n/)
  const updatedLines = []
  const changes = []

  for (let index = 0; index < lines.length; index += 1) {
    const originalLine = lines[index]
    const updatedLine = transformLine(originalLine)
    updatedLines.push(updatedLine)

    if (updatedLine !== originalLine) {
      changes.push({
        lineNumber: index + 1,
        originalLine: originalLine.trim(),
        updatedLine: updatedLine.trim(),
      })
    }
  }

  if (changes.length === 0) {
    return null
  }

  const updated = updatedLines.join('\n')
  if (writeMode) {
    fs.writeFileSync(filePath, updated, 'utf8')
  }

  return changes
}

if (!fs.existsSync(templatesRoot)) {
  console.error(`Templates directory not found: ${templatesRoot}`)
  process.exit(1)
}

const templateFiles = walkFiles(templatesRoot)
const findings = []

for (const filePath of templateFiles) {
  const changes = processFile(filePath)
  if (!changes) {
    continue
  }

  findings.push({ filePath, changes })
}

if (findings.length === 0) {
  console.log(`No mojibake candidates found in ${path.relative(projectRoot, templatesRoot)}`)
  process.exit(0)
}

for (const finding of findings) {
  console.log(`\n${path.relative(projectRoot, finding.filePath)}`)
  for (const change of finding.changes.slice(0, 8)) {
    console.log(`  L${change.lineNumber}`)
    console.log(`    - ${change.originalLine}`)
    console.log(`    + ${change.updatedLine}`)
  }

  if (finding.changes.length > 8) {
    console.log(`    ... ${finding.changes.length - 8} more change(s)`)
  }
}

const totalChanges = findings.reduce((sum, finding) => sum + finding.changes.length, 0)
console.log(`\n${writeMode ? 'Updated' : 'Found'} ${totalChanges} candidate line(s) across ${findings.length} file(s).`)

if (!writeMode) {
  console.log('Run npm run fix:template-mojibake to apply the suggested changes.')
}