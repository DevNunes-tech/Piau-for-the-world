import type { CSSProperties } from 'react'
import type { CreativeItem } from '../data/regions'
import { useTranslation } from 'react-i18next'
import '../styles/CreativeCard.css'

interface CreativeCardProps {
  item: CreativeItem
  regionColor: string
  onViewMore: () => void
}

const typeLabels: Record<NonNullable<CreativeItem['type']>, { pt: string; en: string }> = {
  artesanato: { pt: 'Artesanato', en: 'Craft' },
  gastronomia: { pt: 'Gastronomia', en: 'Gastronomy' },
  evento: { pt: 'Evento', en: 'Event' },
}

export default function CreativeCard({ item, regionColor, onViewMore }: CreativeCardProps) {
  const { t, i18n } = useTranslation()
  const locale: 'pt' | 'en' = i18n.language === 'en' ? 'en' : 'pt'

  return (
    <article className="creative-card" style={{ '--creative-color': regionColor } as CSSProperties}>
      {item.image && (
        <img className="creative-card-image" src={item.image} alt={t(item.titleKey)} />
      )}
      <div className="creative-card-body">
        {item.type && <span className="creative-card-type">{typeLabels[item.type][locale]}</span>}
        <h3>{t(item.titleKey)}</h3>
        <p>{t(item.descriptionKey)}</p>
        <button className="view-more-btn" onClick={onViewMore}>
          {t('btn.viewMore')}
        </button>
      </div>
    </article>
  )
}
