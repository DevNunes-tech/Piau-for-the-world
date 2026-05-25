import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outPath = path.join(root, 'public', 'invest-feed.json')

function readSeed() {
  if (!fs.existsSync(outPath)) {
    console.error('Arquivo base ausente:', outPath)
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(outPath, 'utf8'))
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 56)
}

async function fetchText(url) {
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), 18_000)
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'PiauíVivaInvestFeed/1.0' },
      signal: ac.signal,
    })
    if (!r.ok) return null
    return await r.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function extractMoneySnippets(text, max = 8) {
  const t = text.replace(/\s+/g, ' ')
  const out = []
  const re = /R\$\s*[\d]{1,3}(?:\.[\d]{3})*(?:,\d{2})?/gi
  let m
  while ((m = re.exec(t)) !== null && out.length < max) {
    const start = Math.max(0, m.index - 100)
    const end = Math.min(t.length, m.index + m[0].length + 120)
    const chunk = t.slice(start, end).trim()
    if (chunk.length > 28) out.push(chunk)
  }
  return out
}

function guessSource(url) {
  const u = url.toLowerCase()
  if (/secult|cultur/.test(u)) return 'secult'
  if (/setur|turismo/.test(u)) return 'estado'
  if (/investe/.test(u)) return 'investe'
  return 'estado'
}

function mergeScraped(seedData, snippets, source) {
  const events = Array.isArray(seedData.events) ? [...seedData.events] : []
  const seen = new Set(events.map((e) => slug(`${e.title?.pt || ''}-${e.dateIso || ''}`)))
  let n = 0
  const todayIso = new Date().toISOString().slice(0, 10)
  const dPt = new Date().toLocaleDateString('pt-BR')
  const dEn = new Date().toLocaleDateString('en-US')

  for (const sn of snippets) {
    const title = sn.slice(0, 110).trim()
    const key = slug(title)
    if (!key || seen.has(key) || title.length < 16) continue
    seen.add(key)
    n += 1
    events.push({
      id: `scraped-${Date.now()}-${n}`,
      title: { pt: title, en: title },
      summary: { pt: sn.slice(0, 280), en: sn.slice(0, 280) },
      dateIso: todayIso,
      dateDisplay: { pt: dPt, en: dEn },
      location: { pt: 'Piauí (extraído automaticamente)', en: 'Piauí (auto-extracted)' },
      category: 'cultura',
      source,
      cityTags: [],
      valueBrl: null,
      transparencyUrl: 'https://transparencia.pi.gov.br/',
      semanticAliases: ['extraido', 'comunicado', 'doe', 'sala de imprensa'],
    })
  }
  return { ...seedData, events }
}

async function main() {
  let data = readSeed()

  const urls = (process.env.INVEST_FEED_SCRAPE_URLS || '')
    .split(',')
    .map((s) => s.trim())
    .filter((u) => /^https?:\/\//i.test(u))

  for (const url of urls) {
    const html = await fetchText(url)
    if (!html) {
      console.warn('Skip (fetch failed):', url)
      continue
    }
    const plain = stripHtml(html)
    const snippets = extractMoneySnippets(plain, 10)
    if (snippets.length === 0) {
      console.warn('No R$ snippets from:', url)
      continue
    }
    const src = guessSource(url)
    data = mergeScraped(data, snippets, src)
    console.log('Merged', snippets.length, 'snippets from', url, '→', data.events.length, 'events')
  }

  data.updatedAt = new Date().toISOString()
  data.version = 1
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8')
  console.log('OK →', outPath, '| events:', data.events.length)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
