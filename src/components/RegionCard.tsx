import type { Territory } from '../data/regions'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/RegionCard.css'

interface RegionCardProps {
  region: Territory
  isSelected: boolean
  onSelect: () => void
}

const regionMeta: Record<
  string,
  {
    pt: { label: string; summary: string; countLabel: string }
    en: { label: string; summary: string; countLabel: string }
    icon: string
    accent: string
  }
> = {
  costaDoDelta: {
    pt: {
      label: 'Costa do Delta',
      summary: 'Belezas naturais do litoral piauiense, praias, dunas e mangues vivos.',
      countLabel: '8 municípios',
    },
    en: {
      label: 'Delta Coast',
      summary: 'Natural beauty along the coast of Piauí, with beaches, dunes and living mangroves.',
      countLabel: '8 municipalities',
    },
    icon: 'water',
    accent: '#cbf7e6',
  },
  poloDasOrigens: {
    pt: {
      label: 'Serra da Capivara',
      summary: 'Pré-história, caatinga, sítios arqueológicos e parques naturais preservados.',
      countLabel: '10 municípios',
    },
    en: {
      label: 'Serra da Capivara',
      summary: 'Prehistory, caatinga, archaeological sites and protected natural parks.',
      countLabel: '10 municipalities',
    },
    icon: 'mountain',
    accent: '#fff5b8',
  },
  teresina: {
    pt: {
      label: 'Cocais',
      summary: 'Florestas de babaçu, carnaúba e a cultura das quebradeiras de coco.',
      countLabel: '22 municípios',
    },
    en: {
      label: 'Cocais',
      summary: 'Babassu and carnauba forests, shaped by traditional coconut gatherers.',
      countLabel: '22 municipalities',
    },
    icon: 'tree',
    accent: '#e2ffd2',
  },
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

export default function RegionCard({ region, isSelected, onSelect }: RegionCardProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const meta = regionMeta[region.id]
  const lang = locale === 'en' ? 'en' : 'pt'
  const label = meta?.[lang].label ?? cleanText(t(region.nameKey)).replace('Polo ', '')
  const summary = meta?.[lang].summary ?? cleanText(t(region.summaryKey))
  const countLabel = meta?.[lang].countLabel ?? `${region.spots.length} ${lang === 'en' ? 'spots' : 'municipios'}`
  const icon = meta?.icon ?? 'leaf'
  const accent = meta?.accent ?? '#e2ffd2'

  return (
    <button
      className={`region-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ '--region-color': region.color, '--region-accent': accent } as CSSProperties}
    >
      <span className={`region-icon region-icon-${icon}`} aria-hidden="true" />
      <span className="region-copy">
        <strong>{label}</strong>
        <span>{summary}</span>
        <small>{countLabel}</small>
      </span>
      <span className="region-arrow" aria-hidden="true" />
    </button>
  )
}
