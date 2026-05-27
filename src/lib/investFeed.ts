import type { TFunction } from 'i18next'
import {
  INVEST_CULTURE_EVENTS,
  INVEST_THERMOMETER,
  type InvestCategory,
  type InvestCityTag,
  type InvestCultureEvent,
  type InvestSource,
} from '../data/investCulture'
import { PIAUI_CULTURE_CALENDAR } from '../data/piauiCultureEvents'

export type InvestFeedLocale = 'pt' | 'en'

export type LocalizedString = { pt: string; en: string }

export type InvestFeedEventJson = {
  id: string
  title: LocalizedString
  summary: LocalizedString
  dateIso: string
  dateDisplay: LocalizedString
  location: LocalizedString
  category: InvestCategory
  source: InvestSource
  cityTags: InvestCityTag[]
  valueBrl?: number | null
  transparencyUrl: string
  sourceUrl?: string
  semanticAliases?: string[]
}

export type InvestFeedMonthlyNumber = {
  id: string
  label: LocalizedString
  value: string
  valueHint?: LocalizedString
}

export type InvestFeedYearPoint = {
  month: number
  valueBrl: number
}

export type InvestFeedPayload = {
  version: 1
  updatedAt: string
  monthlyNumbers: InvestFeedMonthlyNumber[]
  yearlyCultureInvestmentsBrl: InvestFeedYearPoint[]
  events: InvestFeedEventJson[]
}

export type InvestDisplayEvent = {
  id: string
  title: string
  summary: string
  dateIso: string
  dateDisplay: string
  location: string
  category: InvestCategory
  source: InvestSource
  cityTags: InvestCityTag[]
  valueBrl: number | null
  transparencyUrl: string
  sourceUrl?: string
  semanticAliases: string[]
}

const DEFAULT_YEAR: InvestFeedYearPoint[] = [
  { month: 1, valueBrl: 900000 },
  { month: 2, valueBrl: 920000 },
  { month: 3, valueBrl: 950000 },
  { month: 4, valueBrl: 1000000 },
  { month: 5, valueBrl: 1100000 },
  { month: 6, valueBrl: 1200000 },
  { month: 7, valueBrl: 1400000 },
  { month: 8, valueBrl: 1300000 },
  { month: 9, valueBrl: 1150000 },
  { month: 10, valueBrl: 1050000 },
  { month: 11, valueBrl: 980000 },
  { month: 12, valueBrl: 1020000 },
]

function pickLocale(s: LocalizedString, lang: InvestFeedLocale): string {
  return lang === 'en' && s.en ? s.en : s.pt
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isLocalizedString(v: unknown): v is LocalizedString {
  if (!isRecord(v)) return false
  return typeof v.pt === 'string' && typeof v.en === 'string'
}

function isCategory(v: unknown): v is InvestCategory {
  return v === 'cultura' || v === 'turismo' || v === 'negocios'
}

function isSource(v: unknown): v is InvestSource {
  return v === 'investe' || v === 'secult' || v === 'estado'
}

function isCityTags(v: unknown): v is InvestCityTag[] {
  if (!Array.isArray(v)) return false
  return v.every((x) => x === 'teresina' || x === 'picos')
}

export function isInvestFeedPayload(raw: unknown): raw is InvestFeedPayload {
  if (!isRecord(raw)) return false
  if (raw.version !== 1) return false
  if (typeof raw.updatedAt !== 'string') return false
  if (!Array.isArray(raw.monthlyNumbers) || !Array.isArray(raw.yearlyCultureInvestmentsBrl) || !Array.isArray(raw.events)) {
    return false
  }
  for (const m of raw.monthlyNumbers) {
    if (!isRecord(m) || typeof m.id !== 'string' || typeof m.value !== 'string' || !isLocalizedString(m.label)) return false
  }
  for (const y of raw.yearlyCultureInvestmentsBrl) {
    if (!isRecord(y) || typeof y.month !== 'number' || typeof y.valueBrl !== 'number') return false
  }
  for (const e of raw.events) {
    if (!isRecord(e)) return false
    if (typeof e.id !== 'string' || typeof e.dateIso !== 'string') return false
    if (!isLocalizedString(e.title) || !isLocalizedString(e.summary)) return false
    if (!isLocalizedString(e.dateDisplay) || !isLocalizedString(e.location)) return false
    if (!isCategory(e.category) || !isSource(e.source)) return false
    if (!isCityTags(e.cityTags)) return false
    if (typeof e.transparencyUrl !== 'string') return false
  }
  return true
}

export async function fetchInvestFeed(signal?: AbortSignal): Promise<InvestFeedPayload | null> {
  try {
    const res = await fetch(`/invest-feed.json`, { signal, cache: 'no-store' })
    if (!res.ok) return null
    const data: unknown = await res.json()
    return isInvestFeedPayload(data) ? data : null
  } catch {
    return null
  }
}

function staticEventToDisplay(ev: InvestCultureEvent, _lang: InvestFeedLocale, t: TFunction): InvestDisplayEvent {
  return {
    id: ev.id,
    title: t(ev.titleKey),
    summary: t(ev.summaryKey),
    dateIso: ev.dateIso,
    dateDisplay: t(ev.dateDisplayKey),
    location: t(ev.locationLabelKey),
    category: ev.category,
    source: ev.source,
    cityTags: ev.cityTags,
    valueBrl: null,
    transparencyUrl: ev.transparencyUrl,
    sourceUrl: ev.sourceUrl,
    semanticAliases: [],
  }
}

function mergeCultureIntoFeed(events: InvestFeedEventJson[]): InvestFeedEventJson[] {
  const ids = new Set(events.map((e) => e.id))
  const extra = PIAUI_CULTURE_CALENDAR.filter((e) => !ids.has(e.id))
  return [...events, ...extra]
}

function feedEventToDisplay(ev: InvestFeedEventJson, lang: InvestFeedLocale): InvestDisplayEvent {
  const lc: InvestFeedLocale = lang === 'en' ? 'en' : 'pt'
  return {
    id: ev.id,
    title: pickLocale(ev.title, lc),
    summary: pickLocale(ev.summary, lc),
    dateIso: ev.dateIso,
    dateDisplay: pickLocale(ev.dateDisplay, lc),
    location: pickLocale(ev.location, lc),
    category: ev.category,
    source: ev.source,
    cityTags: ev.cityTags,
    valueBrl: ev.valueBrl ?? null,
    transparencyUrl: ev.transparencyUrl,
    sourceUrl: ev.sourceUrl,
    semanticAliases: ev.semanticAliases ?? [],
  }
}

export function buildDisplayEvents(
  feed: InvestFeedPayload | null,
  lang: InvestFeedLocale,
  t: TFunction,
): InvestDisplayEvent[] {
  if (feed && feed.events.length > 0) {
    const merged = mergeCultureIntoFeed(feed.events)
    return merged.map((e) => feedEventToDisplay(e, lang)).sort((a, b) => a.dateIso.localeCompare(b.dateIso))
  }
  const staticList = [...INVEST_CULTURE_EVENTS]
    .sort((a, b) => a.dateIso.localeCompare(b.dateIso))
    .map((e) => staticEventToDisplay(e, lang, t))
  const calendar = PIAUI_CULTURE_CALENDAR.map((e) => feedEventToDisplay(e, lang))
  return [...staticList, ...calendar].sort((a, b) => a.dateIso.localeCompare(b.dateIso))
}

export type MonthlyDisplayMetric = {
  id: string
  label: string
  value: string
  hint?: string
}

export function buildMonthlyNumbers(
  feed: InvestFeedPayload | null,
  lang: InvestFeedLocale,
  t: TFunction,
): MonthlyDisplayMetric[] {
  const lc: InvestFeedLocale = lang === 'en' ? 'en' : 'pt'
  if (feed && feed.monthlyNumbers.length > 0) {
    return feed.monthlyNumbers.map((m) => ({
      id: m.id,
      label: pickLocale(m.label, lc),
      value: m.value,
      hint: m.valueHint ? pickLocale(m.valueHint, lc) : undefined,
    }))
  }
  return INVEST_THERMOMETER.map((m) => ({
    id: m.id,
    label: t(m.labelKey),
    value: t(m.valueKey),
  }))
}

export function buildYearlySeries(feed: InvestFeedPayload | null): InvestFeedYearPoint[] {
  const ys = feed?.yearlyCultureInvestmentsBrl
  if (ys && ys.length > 0) {
    const sorted = [...ys].sort((a, b) => a.month - b.month)
    if (sorted.length === 12 && sorted.every((p) => p.month >= 1 && p.month <= 12)) return sorted
  }
  return DEFAULT_YEAR
}

export function formatFeedUpdatedAt(iso: string | undefined, locale: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(d)
  } catch {
    return iso
  }
}

export function formatBrlCompact(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  } catch {
    return `R$ ${value}`
  }
}
