import type { InvestDisplayEvent } from './investFeed'

const MODEL = 'gemini-2.0-flash'

export async function rankInvestEventsWithGemini(
  apiKey: string,
  query: string,
  events: InvestDisplayEvent[],
): Promise<InvestDisplayEvent[] | null> {
  const q = query.trim()
  if (!q || events.length === 0) return events

  const compact = events.map((e) => ({
    id: e.id,
    title: e.title,
    summary: e.summary,
    location: e.location,
    category: e.category,
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`

  const prompt = [
    'You match user queries to cultural investment / tourism events in Piauí, Brazil.',
    'Return ONLY a JSON array of strings: event ids ordered from best semantic match to weakest.',
    'Include ids even for partial matches. Use only ids from the input list. No markdown, no explanation.',
    '',
    `User query: ${JSON.stringify(q)}`,
    '',
    `Events: ${JSON.stringify(compact)}`,
  ].join('\n')

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
    }),
  })

  if (!res.ok) return null

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!text) return null

  let ids: string[]
  try {
    const parsed: unknown = JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, ''))
    ids = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return null
  }

  if (ids.length === 0) return null

  const byId = new Map(events.map((e) => [e.id, e]))
  const ordered: InvestDisplayEvent[] = []
  const seen = new Set<string>()
  for (const id of ids) {
    const ev = byId.get(id)
    if (ev && !seen.has(id)) {
      ordered.push(ev)
      seen.add(id)
    }
  }
  for (const ev of events) {
    if (!seen.has(ev.id)) ordered.push(ev)
  }
  return ordered
}
