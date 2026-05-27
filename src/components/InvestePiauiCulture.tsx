import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InvestYearChart from './InvestYearChart'
import {
  INVEST_MAP_HIGHLIGHTS,
  type InvestCategory,
  type InvestCityTag,
  type InvestSource,
} from '../data/investCulture'
import {
  buildDisplayEvents,
  buildMonthlyNumbers,
  buildYearlySeries,
  fetchInvestFeed,
  formatBrlCompact,
  type InvestFeedPayload,
} from '../lib/investFeed'
import { rankInvestEventsWithGemini } from '../lib/investGeminiSearch'
import { rankInvestEventsOffline } from '../lib/investSemanticRank'
import '../styles/InvestePiauiCulture.css'

type CityFilter = 'all' | InvestCityTag

const categoryClass: Record<InvestCategory, string> = {
  cultura: 'invest-tag invest-tag-cultura',
  turismo: 'invest-tag invest-tag-turismo',
  negocios: 'invest-tag invest-tag-negocios',
}

type Props = {
  onOpenMap: () => void
}

export default function InvestePiauiCulture({ onOpenMap }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'pt'
  const locale = i18n.language

  const [feed, setFeed] = useState<InvestFeedPayload | null>(null)
  const [feedLoading, setFeedLoading] = useState(true)
  const [cityFilter, setCityFilter] = useState<CityFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [geminiOrder, setGeminiOrder] = useState<string[] | null>(null)
  const [geminiLoading, setGeminiLoading] = useState(false)

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim()

  useEffect(() => {
    const ac = new AbortController()
    setFeedLoading(true)
    void fetchInvestFeed(ac.signal).then((f) => {
      setFeed(f)
      setFeedLoading(false)
    })
    return () => ac.abort()
  }, [])

  useEffect(() => {
    setGeminiOrder(null)
  }, [searchQuery, cityFilter])

  const displayEvents = useMemo(
    () => buildDisplayEvents(feedLoading ? null : feed, lang, t),
    [feed, feedLoading, lang, t],
  )

  const monthly = useMemo(
    () => buildMonthlyNumbers(feedLoading ? null : feed, lang, t),
    [feed, feedLoading, lang, t],
  )

  const yearly = useMemo(() => buildYearlySeries(feedLoading ? null : feed), [feed, feedLoading])

  const cityFiltered = useMemo(() => {
    if (cityFilter === 'all') return displayEvents
    return displayEvents.filter((ev) => ev.cityTags.includes(cityFilter))
  }, [displayEvents, cityFilter])

  const visibleEvents = useMemo(() => {
    const q = searchQuery.trim()
    if (!q) return cityFiltered

    if (geminiOrder && geminiOrder.length > 0) {
      const map = new Map(cityFiltered.map((e) => [e.id, e]))
      const ordered: typeof cityFiltered = []
      for (const id of geminiOrder) {
        const ev = map.get(id)
        if (ev) ordered.push(ev)
      }
      for (const ev of cityFiltered) {
        if (!ordered.includes(ev)) ordered.push(ev)
      }
      return ordered
    }

    const ranked = rankInvestEventsOffline(q, cityFiltered)
    return ranked.length > 0 ? ranked : cityFiltered
  }, [cityFiltered, searchQuery, geminiOrder])

  const sourceLabel = (source: InvestSource) => {
    if (source === 'investe') return t('invest.source.investe')
    if (source === 'secult') return t('invest.source.secult')
    return t('invest.source.estado')
  }

  const categoryLabel = (cat: InvestCategory) => t(`invest.category.${cat}`)

  const runGeminiSearch = async () => {
    const q = searchQuery.trim()
    if (!apiKey || !q) return
    setGeminiLoading(true)
    try {
      const ranked = await rankInvestEventsWithGemini(apiKey, q, cityFiltered)
      if (ranked) setGeminiOrder(ranked.map((e) => e.id))
    } catch {
      /* silencioso: busca local continua */
    } finally {
      setGeminiLoading(false)
    }
  }

  return (
    <div className="invest-culture">
      <header className="invest-culture-header">
        <h1>{t('invest.title')}</h1>
        <p>{t('invest.subtitle')}</p>
      </header>

      <section className="invest-section invest-month-block" aria-labelledby="invest-month-heading">
        <h2 id="invest-month-heading" className="invest-section-title">
          {t('invest.monthNumbers.title')}
        </h2>
        <div className="invest-metrics-grid">
          {monthly.map((m) => (
            <div key={m.id} className="invest-metric-card">
              <p className="invest-metric-value">{m.value}</p>
              <p className="invest-metric-label">{m.label}</p>
              {m.hint && <p className="invest-metric-hint">{m.hint}</p>}
            </div>
          ))}
        </div>

        <InvestYearChart
          points={yearly}
          locale={locale}
          title={t('invest.chart.title')}
          subtitle={t('invest.chart.sub')}
          valueLabel={t('invest.chart.valueAxis')}
        />
      </section>

      <section className="invest-section" aria-labelledby="invest-events-heading">
        <h2 id="invest-events-heading" className="invest-section-title">
          {t('invest.block.events.title')}
        </h2>
        <p className="invest-section-sub">{t('invest.block.events.sub')}</p>

        <div className="invest-search-row">
          <label className="invest-search-label" htmlFor="invest-search-input">
            {t('invest.search.label')}
          </label>
          <div className="invest-search-controls">
            <input
              id="invest-search-input"
              type="search"
              className="invest-search-input"
              placeholder={t('invest.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {apiKey && (
              <button
                type="button"
                className="invest-btn invest-btn-ghost"
                onClick={() => void runGeminiSearch()}
                disabled={geminiLoading || !searchQuery.trim()}
              >
                {geminiLoading ? t('msg.loading') : t('invest.search.gemini')}
              </button>
            )}
          </div>
        </div>

        <div className="invest-filters" role="group" aria-label={t('invest.filter.groupLabel')}>
          <button
            type="button"
            className={`invest-filter-btn ${cityFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCityFilter('all')}
          >
            {t('invest.filter.all')}
          </button>
          <button
            type="button"
            className={`invest-filter-btn ${cityFilter === 'teresina' ? 'active' : ''}`}
            onClick={() => setCityFilter('teresina')}
          >
            {t('invest.filter.teresina')}
          </button>
          <button
            type="button"
            className={`invest-filter-btn ${cityFilter === 'picos' ? 'active' : ''}`}
            onClick={() => setCityFilter('picos')}
          >
            {t('invest.filter.picos')}
          </button>
        </div>

        {visibleEvents.length === 0 ? (
          <p className="invest-section-sub">{t('invest.filter.empty')}</p>
        ) : (
          <div className="invest-events-grid">
            {visibleEvents.map((ev) => (
              <article key={ev.id} className="invest-event-card">
                <div className="invest-event-top">
                  <span className={categoryClass[ev.category]}>{categoryLabel(ev.category)}</span>
                  <span className="invest-source-pill">{sourceLabel(ev.source)}</span>
                  {ev.valueBrl != null && (
                    <span className="invest-value-pill">{formatBrlCompact(ev.valueBrl, locale)}</span>
                  )}
                </div>
                <div className="invest-event-body">
                  <h2>{ev.title}</h2>
                  <p className="invest-event-meta">
                    {ev.dateDisplay} · {ev.location}
                  </p>
                  <p className="invest-event-summary">{ev.summary}</p>
                  <div className="invest-event-actions">
                    <a
                      className="invest-btn invest-btn-primary"
                      href={ev.transparencyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('invest.btn.transparency')}
                    </a>
                    {ev.sourceUrl && (
                      <a
                        className="invest-btn invest-btn-ghost"
                        href={ev.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('invest.btn.source')}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="invest-section" aria-labelledby="invest-map-heading">
        <h2 id="invest-map-heading" className="invest-section-title">
          {t('invest.block.map.title')}
        </h2>
        <p className="invest-section-sub">{t('invest.block.map.sub')}</p>
        <div className="invest-map-grid">
          {INVEST_MAP_HIGHLIGHTS.map((h) => (
            <article key={h.id} className="invest-map-card">
              <img src={h.image} alt="" loading="lazy" />
              <div className="invest-map-card-body">
                <h3>{t(h.titleKey)}</h3>
                <p>{t(h.summaryKey)}</p>
                <button type="button" className="invest-btn invest-btn-primary" onClick={onOpenMap}>
                  {t('invest.btn.openMap')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
