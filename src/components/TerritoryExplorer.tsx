import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CITY_SECTIONS, FEATURED_CITIES } from '../data/cities'
import type { CityHighlight } from '../data/cities'
import { REGIONS } from '../data/regions'
import type { Spot, Territory } from '../data/regions'
import RegionCard from './RegionCard'
import piauiWorldLogo from '../../assets/img-fundo branco.png'
import '../styles/TerritoryExplorer.css'

type TerritoryExplorerProps = {
  selectedCityId?: string | null
  onCitySelect?: (cityId: string) => void
  onNavigate?: (page: 'home' | 'map' | 'creative' | 'itinerary' | 'lab' | 'invest') => void
}

/** Quatro pontos turísticos fixos no hero e na faixa de destaques. */
const featuredSpotIds = ['deltaDoParnaiba', 'portoLuisCorreia', 'serraDaCapivara', 'canyonRioPoti'] as const

type Lang = 'pt' | 'en'

type HighlightSpot = Spot & {
  regionColor: string
  regionId: string
}

type Biome = {
  id: string
  title: string
  description: string
  image: string
  cities: string[]
}

const cityCopy: Record<string, Record<Lang, Partial<CityHighlight>>> = {
  oeiras: {
    pt: {
      name: 'Oeiras',
      nickname: 'Onde o tempo parou na primeira capital',
      region: 'Território Vale do Canindé',
      details:
        'Caminhe pelas ruas calçadas de pedra de Oeiras e sinta a atmosfera colonial que deu origem ao estado. Entre igrejas centenárias e tradições religiosas que emocionam, a cidade é um convite vivo para quem busca conexão com a história profunda e a espiritualidade brasileira.',
      tags: ['História Viva', 'Fé', 'Patrimônio'],
    },
    en: {
      name: 'Oeiras',
      nickname: 'Where time stands still in the first capital',
      region: 'Vale do Canindé Territory',
      details:
        'Walk through the cobblestone streets of Oeiras and feel the colonial atmosphere that gave birth to the state. With its centuries-old churches and moving religious traditions, the city is a living invitation for those seeking a deep connection with history and Brazilian spirituality.',
      tags: ['Living History', 'Faith', 'Heritage'],
    },
  },
  picos: {
    pt: {
      name: 'Picos',
      nickname: 'O coração pulsante do sertão',
      region: 'Centro-sul do Piauí',
      details:
        'Picos é mais que um entroncamento; é o encontro vibrante entre a cultura sertaneja e o vigor do comércio local. Famosa pela produção de um mel de qualidade singular, a cidade oferece um mergulho autêntico na resiliência e no calor humano do povo piauiense.',
      tags: ['Cultura Sertaneja', 'Mel', 'Experiência Local'],
    },
    en: {
      name: 'Picos',
      nickname: 'The beating heart of the hinterland',
      region: 'South-central Piauí',
      details:
        'Picos is more than just a crossroads; it is the vibrant encounter between the sertanejo culture and the vigor of local trade. Famous for producing unique, high-quality honey, the city offers an authentic dive into the resilience and warmth of the Piauí people.',
      tags: ['Sertanejo Culture', 'Honey', 'Local Experience'],
    },
  },
  teresina: {
    pt: {
      name: 'Teresina',
      nickname: 'A Cidade Verde que abraça os rios',
      region: 'Entre os rios Poti e Parnaíba',
      details:
        'Capital do sol e do encontro, Teresina surpreende com seus parques urbanos vibrantes e o espetáculo do pôr do sol nas margens dos rios Poti e Parnaíba. Um destino que une o dinamismo de uma capital à doçura da hospitalidade local.',
      tags: ['Cidade Verde', 'Gastronomia', 'Cultura'],
    },
    en: {
      name: 'Teresina',
      nickname: 'The Green City that embraces the rivers',
      region: 'Between the Poti and Parnaíba rivers',
      details:
        'The capital of the sun and of encounters, Teresina surprises visitors with its vibrant urban parks and the spectacle of the sunset along the banks of the Poti and Parnaíba rivers. A destination that perfectly balances capital dynamism with the sweetness of local hospitality.',
      tags: ['Green City', 'Gastronomy', 'Culture'],
    },
  },
  parnaiba: {
    pt: {
      name: 'Parnaíba',
      nickname: 'A porta de entrada do paraíso',
      region: 'Litoral piauiense',
      details:
        'Parnaíba é o cenário dos sonhos: o majestoso Delta, dunas imensas e o encontro das águas criam uma paisagem surreal. É o destino obrigatório para o viajante que busca aventura, contato direto com a natureza selvagem e uma atmosfera costeira inesquecível.',
      tags: ['Delta do Parnaíba', 'Aventura', 'Paraíso Natural'],
    },
    en: {
      name: 'Parnaíba',
      nickname: 'The gateway to paradise',
      region: 'Piauí coast',
      details:
        'Parnaíba is the stuff of dreams: the majestic Delta, massive dunes, and the meeting of the waters create a surreal landscape. It is a mandatory destination for travelers seeking adventure, direct contact with wild nature, and an unforgettable coastal atmosphere.',
      tags: ['Parnaíba Delta', 'Adventure', 'Natural Paradise'],
    },
  },
  saoRaimundoNonato: {
    pt: {
      name: 'São Raimundo Nonato',
      nickname: 'O berço da humanidade americana',
      region: 'Sudeste piauiense',
      details:
        'Prepare-se para uma viagem no tempo. Base para o espetacular Parque Nacional da Serra da Capivara, a cidade é o ponto de partida para ver de perto os registros mais antigos da ocupação humana nas Américas. Cultura, ciência e mistério em um só lugar.',
      tags: ['Arqueologia', 'História Universal', 'Natureza'],
    },
    en: {
      name: 'São Raimundo Nonato',
      nickname: 'The cradle of American humanity',
      region: 'Southeastern Piauí',
      details:
        'Prepare yourself for a journey back in time. As the gateway to the spectacular Serra da Capivara National Park, the city is the starting point to see up close the oldest records of human occupation in the Americas. Culture, science, and mystery in one place.',
      tags: ['Archaeology', 'Universal History', 'Nature'],
    },
  },
  pedroII: {
    pt: {
      name: 'Pedro II',
      nickname: 'Charme suíço em pleno sertão',
      region: 'Serra dos Matões',
      details:
        'Com clima ameno e arquitetura charmosa, Pedro II é um refúgio cultural. Famosa mundialmente pelas suas opalas raras, a cidade encanta com seus festivais de música, o artesanato de tear e a beleza cênica das serras e cachoeiras.',
      tags: ['Opalas', 'Clima de Serra', 'Cultura e Arte'],
    },
    en: {
      name: 'Pedro II',
      nickname: 'Swiss charm in the heart of the hinterland',
      region: 'Serra dos Matões',
      details:
        'With a mild climate and charming architecture, Pedro II is a cultural refuge. World-famous for its rare opals, the city enchants visitors with its music festivals, traditional loom weaving, and the scenic beauty of its mountains and waterfalls.',
      tags: ['Opals', 'Mountain Climate', 'Culture and Art'],
    },
  },
  piripiri: {
    pt: {
      name: 'Piripiri',
      nickname: 'O refúgio das águas',
      region: 'Norte do Piauí',
      details:
        'Piripiri é um oásis de lazer. Rodeada por trilhas que levam a cachoeiras revigorantes, a cidade oferece a dose perfeita de aventura e descanso. O lugar ideal para quem deseja se desconectar da rotina e recarregar energias na natureza.',
      tags: ['Cachoeiras', 'Ecoturismo', 'Bem-estar'],
    },
    en: {
      name: 'Piripiri',
      nickname: 'The refuge of waters',
      region: 'Northern Piauí',
      details:
        'Piripiri is a leisure oasis. Surrounded by trails leading to refreshing waterfalls, the city offers the perfect dose of adventure and rest. The ideal spot for those wishing to disconnect from the routine and recharge energy in nature.',
      tags: ['Waterfalls', 'Ecotourism', 'Well-being'],
    },
  },
  floriano: {
    pt: {
      name: 'Floriano',
      nickname: 'A Princesa do Rio Parnaíba',
      region: 'Sul do Piauí',
      details:
        'Às margens do imponente Rio Parnaíba, Floriano preserva uma elegância histórica e cultural única. Uma cidade que respira arte, gastronomia ribeirinha e uma tradição de hospitalidade que torna qualquer visita uma experiência memorável.',
      tags: ['História Ribeirinha', 'Gastronomia', 'Cultura'],
    },
    en: {
      name: 'Floriano',
      nickname: 'The Princess of the Parnaíba River',
      region: 'Southern Piauí',
      details:
        'On the banks of the imposing Parnaíba River, Floriano preserves a unique historical and cultural elegance. A city that breathes art, riverside gastronomy, and a tradition of hospitality that makes every visit a memorable experience.',
      tags: ['Riverside History', 'Gastronomy', 'Culture'],
    },
  },
}

const citySectionCopy: Record<string, Record<Lang, { title: string; description: string }>> = {
  faith: {
    pt: {
      title: 'Fé, história e memória',
      description: 'Cidades que guardam a formação cultural, religiosa e política do Piauí.',
    },
    en: {
      title: 'Faith, history and memory',
      description: 'Cities that preserve the cultural, religious and political formation of Piauí.',
    },
  },
  routes: {
    pt: {
      title: 'Rotas, comércio e produção',
      description: 'Centros urbanos que movimentam estradas, feiras, serviços e economia criativa.',
    },
    en: {
      title: 'Routes, trade and production',
      description: 'Urban centers that move roads, markets, services and the creative economy.',
    },
  },
  nature: {
    pt: {
      title: 'Natureza e patrimônio vivo',
      description: 'Portas de entrada para parques, cachoeiras, litoral, opalas e paisagens únicas.',
    },
    en: {
      title: 'Nature and living heritage',
      description: 'Gateways to parks, waterfalls, the coast, opals and unique landscapes.',
    },
  },
}

const DEFAULT_BIOME_ID = 'caatinga'

const BIOME_IDS = ['caatinga', 'cerrado', 'mataDosCocais', 'mataAtlantica'] as const
type BiomeId = (typeof BIOME_IDS)[number]

/** Fotos alinhadas ao território piauiense de cada bioma (Commons / referência regional). */
const BIOME_IMAGES: Record<BiomeId, string> = {
  caatinga: 'https://www.pi.gov.br/wp-content/uploads/2026/04/IMG_5653.jpg',
  cerrado: 'https://portalopiaui.com/hf-conteudo/uploads/posts/2023/06/12872_cerrado-veado1-jpg.jpg',
  mataDosCocais: 'https://s5.static.brasilescola.uol.com.br/be/2022/02/palmeiras-carnauba-piaui.jpg',
  mataAtlantica: 'https://static.poder360.com.br/2022/12/mata-atlantica-848x477.jpeg',
}

const BIOME_CITIES: Record<BiomeId, string[]> = {
  caatinga: ['São Raimundo Nonato', 'Coronel José Dias', 'Caracol', 'São Gonçalo'],
  cerrado: ['Teresina', 'Picos', 'Oeiras', 'Floriano'],
  mataDosCocais: ['Piripiri', 'Esperantina', 'Barras', 'Batalha'],
  mataAtlantica: ['Parnaíba', 'Luís Correia', 'Cajueiro da Praia', 'Ilha Grande'],
}

type InterestId = 'adventure' | 'culture' | 'gastronomy'

const INTEREST_OPTIONS: { id: InterestId; key: string }[] = [
  { id: 'adventure', key: 'territoryExplorer.interestAdventureNature' },
  { id: 'culture', key: 'territoryExplorer.interestCultureHistory' },
  { id: 'gastronomy', key: 'territoryExplorer.interestGastronomyRoutes' },
]

const WHY_PIAUI_CARDS = [
  {
    id: 'culture',
    titleKey: 'territoryExplorer.whyPiauiCard1Title',
    descriptionKey: 'territoryExplorer.whyPiauiCard1Description',
  },
  {
    id: 'adventure',
    titleKey: 'territoryExplorer.whyPiauiCard2Title',
    descriptionKey: 'territoryExplorer.whyPiauiCard2Description',
  },
  {
    id: 'gastronomy',
    titleKey: 'territoryExplorer.whyPiauiCard3Title',
    descriptionKey: 'territoryExplorer.whyPiauiCard3Description',
  },
]

function isHighlightSpot(spot: HighlightSpot | undefined): spot is HighlightSpot {
  return Boolean(spot)
}

function cleanText(text: string) {
  if (!/[ÃÂ]|â[€™“”-]/.test(text)) return text

  try {
    const bytes = Uint8Array.from(text, (char) => char.charCodeAt(0))
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    return text
  }
}


function scrollToElement(id: string) {
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 50)
}

function translateCategory(category: string, translateFn: (key: string) => string) {
  const base = cleanText(category)
  const key = `category.${base}`
  const translated = translateFn(key)
  return translated === key ? base : translated
}

export default function TerritoryExplorer({ selectedCityId, onCitySelect, onNavigate }: TerritoryExplorerProps) {
  const { t, i18n } = useTranslation()
  const lang: Lang = i18n.language === 'en' ? 'en' : 'pt'

  const copy = useMemo(() => {
    const statsRaw = t('territoryExplorer.stats', { returnObjects: true })
    const ambientRaw = t('territoryExplorer.ambientRegion', { returnObjects: true })
    const ambientRegion = ambientRaw as {
      label: string
      summary: string
      count: string
      details: string
    }
    const stats = (Array.isArray(statsRaw) ? statsRaw : []) as [string, string][]

    return {
      heroKicker: t('territoryExplorer.heroKicker'),
      heroTitle: t('territoryExplorer.heroTitle'),
      heroEmphasis: t('territoryExplorer.heroEmphasis'),
      heroDescription: t('territoryExplorer.heroDescription'),
      heroInterestHeading: t('territoryExplorer.heroInterestHeading'),
      whyPiauiTitle: t('territoryExplorer.whyPiauiTitle'),
      whyPiauiSubtitle: t('territoryExplorer.whyPiauiSubtitle'),
      searchPlaceholder: t('territoryExplorer.searchPlaceholder'),
      explore: t('territoryExplorer.explore'),
      stats,
      statsLabel: t('territoryExplorer.statsLabel'),
      naturalHeritage: t('territoryExplorer.naturalHeritage'),
      highlights: t('territoryExplorer.highlights'),
      viewAll: t('territoryExplorer.viewAll'),
      sustainableRoutes: t('territoryExplorer.sustainableRoutes'),
      territories: t('territoryExplorer.territories'),
      cultureEnvironment: t('territoryExplorer.cultureEnvironment'),
      cities: t('territoryExplorer.cities'),
      chooseCity: t('territoryExplorer.chooseCity'),
      source: t('territoryExplorer.source'),
      biomeTitle: t('territoryExplorer.biomeTitle'),
      biomeText: t('territoryExplorer.biomeText'),
      biomeButton: t('territoryExplorer.biomeButton'),
      biomeSectionTitle: t('territoryExplorer.biomeSectionTitle'),
      biomeSectionSubtitle: t('territoryExplorer.biomeSectionSubtitle'),
      biomeCitiesTitle: t('territoryExplorer.biomeCitiesTitle'),
      selectedHighlight: t('territoryExplorer.selectedHighlight'),
      selectedRegion: t('territoryExplorer.selectedRegion'),
      routeTip: t('territoryExplorer.routeTip'),
      noSearchResult: t('territoryExplorer.noSearchResult'),
      ambientRegion,
    }
  }, [t])

  const biomes = useMemo<Biome[]>(
    () =>
      BIOME_IDS.map((id) => ({
        id,
        title: t(`biome.${id}.title`),
        description: t(`biome.${id}.description`),
        image: BIOME_IMAGES[id],
        cities: BIOME_CITIES[id],
      })),
    [t],
  )

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<HighlightSpot | null>(null)
  const [selectedCity, setSelectedCity] = useState<CityHighlight>(FEATURED_CITIES[0])
  const [selectedBiomeId, setSelectedBiomeId] = useState(DEFAULT_BIOME_ID)
  const [selectedInterest, setSelectedInterest] = useState<InterestId | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMessage, setSearchMessage] = useState('')

  useEffect(() => {
    if (!selectedCityId) return
    scrollToElement('cidades')
  }, [selectedCityId])

  const activeCity = selectedCityId
    ? FEATURED_CITIES.find((item) => item.id === selectedCityId) ?? selectedCity
    : selectedCity

  const highlights = useMemo(() => {
    const spots = REGIONS.flatMap((region) =>
      region.spots.map((spot) => ({
        ...spot,
        regionColor: region.color,
        regionId: region.id,
      })),
    )

    return featuredSpotIds
      .map((id) => spots.find((spot) => spot.id === id))
      .filter(isHighlightSpot)
  }, [])

  const selectedRegionData = REGIONS.find((region) => region.id === selectedRegion)
  const selectedBiome = biomes.find((biome) => biome.id === selectedBiomeId) ?? biomes[0]
  const selectedCityCopy = { ...activeCity, ...cityCopy[activeCity.id]?.[lang] }

  const selectCity = (cityId: string) => {
    const city = FEATURED_CITIES.find((item) => item.id === cityId)
    if (city) {
      setSelectedCity(city)
      if (onCitySelect) onCitySelect(cityId)
      scrollToElement('cidades')
    }
  }

  const selectSpot = (spot: HighlightSpot) => {
    setSelectedSpot(spot)
    setSelectedRegion(spot.regionId)
    setSearchMessage('')
    scrollToElement('highlight-detail')
  }

  const selectBiome = (biomeId: string) => {
    setSelectedBiomeId(biomeId)
    scrollToElement('biomes')
  }

  const handleInterestSelect = (interestId: InterestId) => {
    setSelectedInterest(interestId)

    if (interestId === 'adventure') {
      scrollToElement('biomes')
      return
    }

    if (interestId === 'culture') {
      const city = FEATURED_CITIES.find((city) => city.id === 'saoRaimundoNonato')
      if (city) {
        setSelectedCity(city)
        onCitySelect?.(city.id)
      }
      scrollToElement('cidades')
      return
    }

    if (interestId === 'gastronomy') {
      if (onNavigate) {
        onNavigate('creative')
      } else {
        scrollToElement('cidades')
      }
    }
  }

  const selectRegion = (region: Territory) => {
    setSelectedRegion(region.id)
    setSearchMessage('')
    scrollToElement('region-detail')
  }

  const selectAmbientRegion = () => {
    setSelectedRegion('valeDoSambito')
    setSearchMessage('')
    scrollToElement('region-detail')
  }

  const handleExplore = () => {
    const query = searchQuery.trim().toLowerCase()
    setSearchMessage('')

    if (!query) {
      scrollToElement('territorios')
      return
    }

    const spotMatch = highlights.find((spot) => {
      const title = cleanText(t(spot.titleKey)).toLowerCase()
      return title.includes(query) || spot.municipality.toLowerCase().includes(query) || spot.category.toLowerCase().includes(query)
    })

    if (spotMatch) {
      selectSpot(spotMatch)
      return
    }

    const regionMatch = REGIONS.find((region) => {
      const name = cleanText(t(region.nameKey)).toLowerCase()
      const summary = cleanText(t(region.summaryKey)).toLowerCase()
      return name.includes(query) || summary.includes(query)
    })

    if (regionMatch) {
      selectRegion(regionMatch)
      return
    }

    const cityMatch = FEATURED_CITIES.find((city) => {
      const translated = { ...city, ...cityCopy[city.id]?.[lang] }
      return (
        translated.name.toLowerCase().includes(query) ||
        translated.nickname.toLowerCase().includes(query) ||
        translated.region.toLowerCase().includes(query)
      )
    })

    if (cityMatch) {
      setSelectedCity(cityMatch)
      scrollToElement('cidades')
      return
    }

    setSearchMessage(copy.noSearchResult)
    scrollToElement('territorios')
  }

  return (
    <div className="territory-explorer">
      <section className="explorer-hero">
        <div className="hero-copy">
          <span className="hero-kicker">{copy.heroKicker}</span>
          <h1>
            {copy.heroTitle} <em>{copy.heroEmphasis}</em>
          </h1>
          <p>{copy.heroDescription}</p>

          <form
            className="search-bar"
            onSubmit={(event) => {
              event.preventDefault()
              handleExplore()
            }}
          >
            <span aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
            />
            <button type="submit">{copy.explore}</button>
          </form>
          {searchMessage && <p className="search-message">{searchMessage}</p>}

          <div className="interest-filter">
            <strong>{copy.heroInterestHeading}</strong>
            <div className="interest-buttons">
              {INTEREST_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`interest-button ${selectedInterest === option.id ? 'active' : ''}`}
                  onClick={() => handleInterestSelect(option.id)}
                >
                  {t(option.key)}
                </button>
              ))}
            </div>
          </div>

          <dl className="hero-stats" aria-label={copy.statsLabel}>
            {copy.stats.map(([value, label]: [string, string]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="hero-logo-panel" aria-label="Piauí para o Mundo">
          <img src={piauiWorldLogo} alt="Piauí para o Mundo" />
        </aside>
      </section>

      <section className="why-piaui-section">
        <div className="section-header">
          <div>
            <span>{copy.heroKicker}</span>
            <h2>{copy.whyPiauiTitle}</h2>
          </div>
        </div>
        <p className="why-piaui-subtitle">{copy.whyPiauiSubtitle}</p>

        <div className="why-piaui-grid">
          {WHY_PIAUI_CARDS.map((card) => (
            <article key={card.id} className={`why-piaui-card ${selectedInterest === card.id ? 'active' : ''}`}>
              <h3>{t(card.titleKey)}</h3>
              <p>{t(card.descriptionKey)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="highlights-section">
        <div className="section-header">
          <div>
            <span>{copy.naturalHeritage}</span>
            <h2>{copy.highlights}</h2>
          </div>
          <a href="#territorios" className="view-all">{copy.viewAll}</a>
        </div>
        <div className="highlights-row">
          {highlights.map((spot) => (
            <button key={spot.id} className="highlight-card" type="button" onClick={() => selectSpot(spot)}>
              {spot.image && (
                <img src={spot.image} alt={cleanText(t(spot.titleKey))} className="highlight-image" />
              )}
              <span className={`highlight-badge highlight-badge-${spot.category.toLowerCase()}`} aria-hidden="true" />
              <div className="highlight-content">
                <h3>{cleanText(t(spot.titleKey))}</h3>
                <p>
                  <span aria-hidden="true" />
                  {spot.municipality}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedSpot && (
        <section className="highlight-detail-panel" id="highlight-detail">
          <img src={selectedSpot.image} alt={cleanText(t(selectedSpot.titleKey))} />
          <div>
            <span>{copy.selectedHighlight}</span>
            <h2>{cleanText(t(selectedSpot.titleKey))}</h2>
            <p>{cleanText(t(selectedSpot.summaryKey))}</p>
            <small>{selectedSpot.municipality} · {translateCategory(selectedSpot.category, t)}</small>
          </div>
        </section>
      )}

      <section className="territories-section" id="territorios">
        <div className="section-header">
          <div>
            <span>{copy.sustainableRoutes}</span>
            <h2>{copy.territories}</h2>
          </div>
        </div>
        <div className="regions-list">
          {REGIONS.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              isSelected={selectedRegion === region.id}
              onSelect={() => selectRegion(region)}
            />
          ))}
          <button className={`region-card ambient-region-card ${selectedRegion === 'valeDoSambito' ? 'selected' : ''}`} type="button" onClick={selectAmbientRegion}>
            <span className="region-icon region-icon-leaf" aria-hidden="true" />
            <span className="region-copy">
              <strong>{copy.ambientRegion.label}</strong>
              <span>{copy.ambientRegion.summary}</span>
              <small>{copy.ambientRegion.count}</small>
            </span>
            <span className="region-arrow" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="biome-section" id="biomes">
        <div className="section-header">
          <div>
            <span>{copy.biomeTitle}</span>
            <h2>{copy.biomeSectionTitle}</h2>
          </div>
        </div>
        <p className="biome-subtitle">{copy.biomeSectionSubtitle}</p>

        <div className="biome-tab-row" role="tablist" aria-label={copy.biomeSectionTitle}>
          {biomes.map((biome) => (
            <button
              key={biome.id}
              type="button"
              className={`biome-tab-btn ${selectedBiome.id === biome.id ? 'active' : ''}`}
              onClick={() => selectBiome(biome.id)}
            >
              {biome.title}
            </button>
          ))}
        </div>

        <div className="biome-grid">
          <article className="biome-card">
            <img
              src={selectedBiome.image}
              alt={selectedBiome.title}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget
                if (el.dataset.fallback === '1') return
                el.dataset.fallback = '1'
                el.src =
                  'https://commons.wikimedia.org/wiki/Special:FilePath/Serra_da_Capivara.jpg?width=720'
              }}
            />
            <div className="biome-card-content">
              <h3>{selectedBiome.title}</h3>
              <p>{selectedBiome.description}</p>
              <div className="biome-city-list">
                <strong>{copy.biomeCitiesTitle}</strong>
                <div>
                  {selectedBiome.cities.map((city: string) => (
                    <span key={city}>{city}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="cities-section" id="cidades">
        <div className="section-header">
          <div>
            <span>{copy.cultureEnvironment}</span>
            <h2>{copy.cities}</h2>
          </div>
        </div>
        <div className="city-name-row" aria-label={copy.chooseCity}>
          {FEATURED_CITIES.map((city) => {
            const translatedCity = { ...city, ...cityCopy[city.id]?.[lang] }

            return (
              <button
                key={city.id}
                className={`city-name-btn ${activeCity.id === city.id ? 'active' : ''}`}
                onClick={() => selectCity(city.id)}
              >
                {translatedCity.name}
              </button>
            )
          })}
        </div>

        <article className="city-detail-card">
          <img src={activeCity.image} alt={selectedCityCopy.name} className="city-detail-image" />
          <div className="city-detail-content">
            <span className="city-region">{selectedCityCopy.region}</span>
            <h2>{selectedCityCopy.name}</h2>
            <strong>{selectedCityCopy.nickname}</strong>
            <p>{selectedCityCopy.details}</p>
            <div className="city-tags">
              {selectedCityCopy.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a href={activeCity.sourceUrl} target="_blank" rel="noreferrer" className="city-source">
              {copy.source}: {cleanText(activeCity.sourceLabel)}
            </a>
          </div>
        </article>

        <div className="city-sections-grid">
          {CITY_SECTIONS.map((section) => {
            const cities = FEATURED_CITIES.filter((city) => city.section === section.id)
            const translatedSection = citySectionCopy[section.id]?.[lang] ?? section

            return (
              <article key={section.id} className="city-section-card">
                <h3>{translatedSection.title}</h3>
                <p>{translatedSection.description}</p>
                <div>
                  {cities.map((city) => (
                    <button key={city.id} onClick={() => selectCity(city.id)}>
                      {(cityCopy[city.id]?.[lang]?.name as string | undefined) ?? city.name}
                    </button>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {selectedRegion && (
        <section className="region-details" id="region-detail">
          {selectedRegionData ? (
            <div className="details-content">
              <span>{copy.selectedRegion}</span>
              <h2>{cleanText(t(selectedRegionData.nameKey))}</h2>
              <p>{cleanText(t(selectedRegionData.summaryKey))}</p>
              <small>{copy.routeTip}</small>
              <div className="spots-grid">
                {selectedRegionData.spots.map((spot) => (
                  <button
                    key={spot.id}
                    className="spot-card"
                    type="button"
                    onClick={() => selectSpot({ ...spot, regionColor: selectedRegionData.color, regionId: selectedRegionData.id })}
                  >
                    {spot.image && (
                      <img src={spot.image} alt={cleanText(t(spot.titleKey))} className="spot-image" />
                    )}
                    <div className="spot-details">
                      <strong>{cleanText(t(spot.titleKey))}</strong>
                      <span>{spot.municipality}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="details-content">
              <span>{copy.selectedRegion}</span>
              <h2>{copy.ambientRegion.label}</h2>
              <p>{copy.ambientRegion.details}</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
