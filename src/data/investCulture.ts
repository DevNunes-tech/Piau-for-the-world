export type InvestSource = 'investe' | 'secult' | 'estado'

export type InvestCategory = 'cultura' | 'turismo' | 'negocios'

export type InvestCityTag = 'teresina' | 'picos'

export type InvestCultureEvent = {
  id: string
  titleKey: string
  summaryKey: string
  dateIso: string
  dateDisplayKey: string
  locationLabelKey: string
  category: InvestCategory
  source: InvestSource
  cityTags: InvestCityTag[]
  transparencyUrl: string
  sourceUrl?: string
}

export type InvestThermometerMetric = {
  id: string
  labelKey: string
  valueKey: string
}

export type InvestMapHighlight = {
  id: string
  titleKey: string
  summaryKey: string
  image: string
}

export const INVEST_CULTURE_EVENTS: InvestCultureEvent[] = [
  {
    id: 'hubInvesteTeresina',
    titleKey: 'invest.event.hubTeresina.title',
    summaryKey: 'invest.event.hubTeresina.summary',
    dateIso: '2026-06-05',
    dateDisplayKey: 'invest.event.hubTeresina.date',
    locationLabelKey: 'invest.event.hubTeresina.location',
    category: 'negocios',
    source: 'investe',
    cityTags: ['teresina'],
    transparencyUrl: 'https://transparencia.pi.gov.br/',
    sourceUrl: 'https://investepiaui.com/',
  },
  {
    id: 'festivalInvernoInvest',
    titleKey: 'invest.event.festivalInverno.title',
    summaryKey: 'invest.event.festivalInverno.summary',
    dateIso: '2026-07-18',
    dateDisplayKey: 'invest.event.festivalInverno.date',
    locationLabelKey: 'invest.event.festivalInverno.location',
    category: 'cultura',
    source: 'secult',
    cityTags: [],
    transparencyUrl: 'https://transparencia.pi.gov.br/',
    sourceUrl: 'https://www.pi.gov.br/secultur/',
  },
  {
    id: 'editalPicos',
    titleKey: 'invest.event.editalPicos.title',
    summaryKey: 'invest.event.editalPicos.summary',
    dateIso: '2026-05-20',
    dateDisplayKey: 'invest.event.editalPicos.date',
    locationLabelKey: 'invest.event.editalPicos.location',
    category: 'cultura',
    source: 'secult',
    cityTags: ['picos'],
    transparencyUrl: 'https://transparencia.pi.gov.br/',
    sourceUrl: 'https://www.pi.gov.br/secultur/',
  },
  {
    id: 'rotaNegociosLitoral',
    titleKey: 'invest.event.rotaLitoral.title',
    summaryKey: 'invest.event.rotaLitoral.summary',
    dateIso: '2026-08-12',
    dateDisplayKey: 'invest.event.rotaLitoral.date',
    locationLabelKey: 'invest.event.rotaLitoral.location',
    category: 'turismo',
    source: 'investe',
    cityTags: [],
    transparencyUrl: 'https://transparencia.pi.gov.br/',
    sourceUrl: 'https://investepiaui.com/',
  },
  {
    id: 'feiraInovacaoTeresina',
    titleKey: 'invest.event.feiraInovacao.title',
    summaryKey: 'invest.event.feiraInovacao.summary',
    dateIso: '2026-09-02',
    dateDisplayKey: 'invest.event.feiraInovacao.date',
    locationLabelKey: 'invest.event.feiraInovacao.location',
    category: 'negocios',
    source: 'investe',
    cityTags: ['teresina'],
    transparencyUrl: 'https://transparencia.pi.gov.br/',
    sourceUrl: 'https://investepiaui.com/',
  },
]

export const INVEST_THERMOMETER: InvestThermometerMetric[] = [
  {
    id: 'monthCommitment',
    labelKey: 'invest.metric.monthCommitment.label',
    valueKey: 'invest.metric.monthCommitment.value',
  },
  {
    id: 'openCalls',
    labelKey: 'invest.metric.openCalls.label',
    valueKey: 'invest.metric.openCalls.value',
  },
  {
    id: 'municipalities',
    labelKey: 'invest.metric.municipalities.label',
    valueKey: 'invest.metric.municipalities.value',
  },
]

export const INVEST_MAP_HIGHLIGHTS: InvestMapHighlight[] = [
  {
    id: 'deltaMelhorias',
    titleKey: 'invest.map.delta.title',
    summaryKey: 'invest.map.delta.summary',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&h=400&fit=crop',
  },
  {
    id: 'picosEntroncamento',
    titleKey: 'invest.map.picos.title',
    summaryKey: 'invest.map.picos.summary',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=640&h=400&fit=crop',
  },
]
