import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { REGIONS } from '../data/regions'
import type { CreativeItem, Territory } from '../data/regions'
import CreativeCard from './CreativeCard'
import '../styles/CreativeEconomy.css'

type SelectedCreative = {
  item: CreativeItem
  region: Territory
}

const typeLabels: Record<NonNullable<CreativeItem['type']>, { pt: string; en: string }> = {
  artesanato: { pt: 'Artesanato', en: 'Craft' },
  gastronomia: { pt: 'Gastronomia', en: 'Gastronomy' },
  evento: { pt: 'Evento cultural', en: 'Cultural event' },
}

export default function CreativeEconomy() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const [selectedCreative, setSelectedCreative] = useState<SelectedCreative | null>(null)

  return (
    <div className="creative-economy">
      <div className="creative-header">
        <div className="creative-header-text">
          <h1>{t('nav.creative')}</h1>
          <p>{t('creative.subtitle')}</p>
        </div>
      </div>

      <div className="regions-showcase">
        {REGIONS.map((region) => (
          <section key={region.id} className="region-showcase">
            <h2 style={{ color: region.color }}>{t(region.nameKey)}</h2>
            <div className="creative-grid">
              {region.creative.map((item) => (
                <CreativeCard
                  key={item.id}
                  item={item}
                  regionColor={region.color}
                  onViewMore={() => setSelectedCreative({ item, region })}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {selectedCreative && (
        <div className="creative-modal-backdrop" role="presentation" onClick={() => setSelectedCreative(null)}>
          <article
            className="creative-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="creative-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="creative-modal-close" onClick={() => setSelectedCreative(null)} aria-label={t('btn.close')}>
              ×
            </button>
            {selectedCreative.item.image && (
              <img
                className="creative-modal-image"
                src={selectedCreative.item.image}
                alt={t(selectedCreative.item.titleKey)}
              />
            )}
            <div className="creative-modal-content">
              <span className="creative-modal-kicker" style={{ color: selectedCreative.region.color }}>
                {selectedCreative.item.type
                  ? typeLabels[selectedCreative.item.type][locale === 'en' ? 'en' : 'pt']
                  : t(selectedCreative.region.nameKey)}
              </span>
              <h2 id="creative-modal-title">{t(selectedCreative.item.titleKey)}</h2>
              <p>{t(selectedCreative.item.descriptionKey)}</p>
            </div>
          </article>
        </div>
      )}
    </div>
  )
}
