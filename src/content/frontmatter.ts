// Minimal hand-rolled parser for the small subset of YAML we use in content
// frontmatter: block mappings, block sequences of mappings, and JSON literals
// for any nested/structured value (choices, pairs). Deliberately not a full
// YAML parser -- see the plan notes for why (avoids Node/Buffer polyfills,
// keeps parsing behavior simple and predictable for hand-edited content).

export interface ParsedMarkdown {
  data: Record<string, unknown>;
  content: string;
}

function indentOf(line: string): number {
  let i = 0;
  while (i < line.length && line[i] === ' ') i++;
  return i;
}

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value.startsWith('[') || value.startsWith('{')) {
    return JSON.parse(value);
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value);
  }
  return value;
}

// Parses a block (mapping or sequence) starting at `start`, all lines with
// indent >= `indent`. Returns the parsed value and the index of the first
// line not consumed.
function parseBlock(lines: string[], start: number, indent: number): { value: unknown; next: number } {
  let i = start;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i >= lines.length || indentOf(lines[i]) < indent) {
    return { value: null, next: i };
  }

  const firstTrimmed = lines[i].trim();
  if (firstTrimmed.startsWith('- ') || firstTrimmed === '-') {
    const seq: unknown[] = [];
    while (i < lines.length) {
      if (lines[i].trim() === '') {
        i++;
        continue;
      }
      const lineIndent = indentOf(lines[i]);
      if (lineIndent < indent) break;
      const trimmed = lines[i].trim();
      if (!trimmed.startsWith('- ') && trimmed !== '-') break;

      const rest = trimmed === '-' ? '' : trimmed.slice(2);
      const itemIndent = lineIndent + 2;
      i++;

      if (rest === '') {
        const { value, next } = parseBlock(lines, i, itemIndent);
        seq.push(value);
        i = next;
        continue;
      }

      const colonIdx = findColon(rest);
      if (colonIdx === -1) {
        seq.push(parseScalar(rest));
        continue;
      }

      const obj: Record<string, unknown> = {};
      const key = rest.slice(0, colonIdx).trim();
      const valuePart = rest.slice(colonIdx + 1).trim();
      if (valuePart === '') {
        const { value, next } = parseBlock(lines, i, itemIndent);
        obj[key] = value;
        i = next;
      } else {
        obj[key] = parseScalar(valuePart);
      }

      while (i < lines.length) {
        if (lines[i].trim() === '') {
          i++;
          continue;
        }
        const nextIndent = indentOf(lines[i]);
        if (nextIndent < itemIndent) break;
        if (nextIndent === lineIndent && lines[i].trim().startsWith('- ')) break;
        const nTrimmed = lines[i].trim();
        const nColon = findColon(nTrimmed);
        if (nColon === -1) break;
        const nKey = nTrimmed.slice(0, nColon).trim();
        const nValuePart = nTrimmed.slice(nColon + 1).trim();
        i++;
        if (nValuePart === '') {
          const { value, next } = parseBlock(lines, i, nextIndent + 2);
          obj[nKey] = value;
          i = next;
        } else {
          obj[nKey] = parseScalar(nValuePart);
        }
      }
      seq.push(obj);
    }
    return { value: seq, next: i };
  }

  const map: Record<string, unknown> = {};
  while (i < lines.length) {
    if (lines[i].trim() === '') {
      i++;
      continue;
    }
    const lineIndent = indentOf(lines[i]);
    if (lineIndent < indent) break;
    if (lineIndent > indent) break;
    const trimmed = lines[i].trim();
    const colonIdx = findColon(trimmed);
    if (colonIdx === -1) break;
    const key = trimmed.slice(0, colonIdx).trim();
    const valuePart = trimmed.slice(colonIdx + 1).trim();
    i++;
    if (valuePart === '') {
      const { value, next } = parseBlock(lines, i, indent + 2);
      map[key] = value;
      i = next;
    } else {
      map[key] = parseScalar(valuePart);
    }
  }
  return { value: map, next: i };
}

// Finds the colon that separates a mapping key from its value, ignoring
// colons inside quoted strings or JSON literals.
function findColon(line: string): number {
  let depth = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && line[i - 1] !== '\\') inQuotes = !inQuotes;
    if (inQuotes) continue;
    if (ch === '[' || ch === '{') depth++;
    if (ch === ']' || ch === '}') depth--;
    if (ch === ':' && depth === 0) return i;
  }
  return -1;
}

export function parseFrontmatter(raw: string): ParsedMarkdown {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { data: {}, content: normalized };
  }
  const end = normalized.indexOf('\n---', 4);
  if (end === -1) {
    return { data: {}, content: normalized };
  }
  const frontmatterBlock = normalized.slice(4, end);
  const afterMarker = normalized.indexOf('\n', end + 1);
  const content = afterMarker === -1 ? '' : normalized.slice(afterMarker + 1).trim();

  const lines = frontmatterBlock.split('\n');
  const { value } = parseBlock(lines, 0, 0);
  return { data: (value as Record<string, unknown>) ?? {}, content };
}
