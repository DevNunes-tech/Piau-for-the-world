import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import VirtualPiauiAssistant from './VirtualPiauiAssistant'
import GamificationPanel from './GamificationPanel'
import ContributionForm from './ContributionForm'
import '../styles/InnovationLab.css'

type LabTab = 'assistant' | 'play' | 'contribute'

export default function InnovationLab() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<LabTab>('assistant')
  const [gVersion, setGVersion] = useState(0)

  const bump = () => setGVersion((v) => v + 1)

  return (
    <div className="innovation-lab">
      <header className="innovation-lab-header">
        <h1>{t('lab.title')}</h1>
        <p>{t('lab.subtitle')}</p>
      </header>

      <div className="innovation-lab-tabs" role="tablist" aria-label={t('lab.title')}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'assistant'}
          className={tab === 'assistant' ? 'active' : ''}
          onClick={() => setTab('assistant')}
        >
          {t('lab.tabAssistant')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'play'}
          className={tab === 'play' ? 'active' : ''}
          onClick={() => setTab('play')}
        >
          {t('lab.tabPlay')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'contribute'}
          className={tab === 'contribute' ? 'active' : ''}
          onClick={() => setTab('contribute')}
        >
          {t('lab.tabContribute')}
        </button>
      </div>

      <div className="innovation-lab-panel" role="tabpanel">
        {tab === 'assistant' && <VirtualPiauiAssistant onInteraction={bump} />}
        {tab === 'play' && <GamificationPanel version={gVersion} onUpdate={bump} />}
        {tab === 'contribute' && <ContributionForm />}
      </div>
    </div>
  )
}
