import type { InvestDisplayEvent } from './investFeed'

const SYNONYMS: Record<string, string[]> = {
  tecnologia: ['tecnologia', 'tech', 'digital', 'inovacao', 'inovação', 'software', 'startup', 'startups', 'hub', 'forum', 'fórum', 'ti', 'computacao', 'computação'],
  eventos: ['eventos', 'evento', 'calendario', 'calendário', 'agenda', 'feira', 'festival', 'mostra'],
  cultura: ['cultura', 'cultural', 'secult', 'edital', 'artistico', 'artístico', 'musica', 'música'],
  turismo: ['turismo', 'turístico', 'litoral', 'delta', 'praia', 'setur', 'visitacao', 'visitação'],
  negocios: ['negocios', 'negócios', 'investe', 'investimento', 'empreendedor', 'rodada', 'comercio', 'comércio'],
  picos: ['picos'],
  teresina: ['teresina', 'capital'],
}

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '')
}

function tokenize(q: string): string[] {
  return stripAccents(q.toLowerCase())
    .split(/[^a-z0-9]+/i)
    .map((w) => w.trim())
    .filter((w) => w.length > 1)
}

function expandTokens(tokens: string[]): Set<string> {
  const out = new Set<string>()
  for (const t of tokens) {
    out.add(t)
    for (const [key, list] of Object.entries(SYNONYMS)) {
      if (t === key || list.includes(t)) {
        out.add(key)
        for (const x of list) out.add(x)
      }
    }
  }
  return out
}

function haystackFor(ev: InvestDisplayEvent): string {
  const parts = [ev.title, ev.summary, ev.location, ev.category, ev.source, ...ev.semanticAliases]
  return stripAccents(parts.join(' ').toLowerCase())
}

/** Pontuação lexical offline (sinônimos + correspondência parcial). */
export function rankInvestEventsOffline(query: string, events: InvestDisplayEvent[]): InvestDisplayEvent[] {
  const q = query.trim()
  if (!q) return events

  const base = tokenize(q)
  if (base.length === 0) return events

  const expanded = expandTokens([...base])
  const needles = [...expanded]

  const scored = events.map((ev) => {
    const hay = haystackFor(ev)
    let score = 0
    for (const n of needles) {
      if (n.length < 2) continue
      if (hay.includes(n)) score += n.length >= 5 ? 4 : 2
    }
    for (const t of base) {
      if (t.length >= 4 && hay.includes(t)) score += 3
    }
    return { ev, score }
  })

  const maxS = Math.max(...scored.map((x) => x.score), 0)
  if (maxS === 0) {
    return events.filter((ev) => haystackFor(ev).includes(stripAccents(q.toLowerCase())))
  }

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.ev.dateIso.localeCompare(b.ev.dateIso))
    .map((x) => x.ev)
}
