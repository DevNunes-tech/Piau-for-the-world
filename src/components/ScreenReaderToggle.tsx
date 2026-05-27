import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenReader } from '../lib/screenReaderContext'
import '../styles/LanguageToggle.css'

export default function ScreenReaderToggle() {
  const { i18n, t } = useTranslation()
  const { enabled, toggleScreenReader, speak } = useScreenReader()

  const handleToggle = () => {
    toggleScreenReader()
    const actionMessage = !enabled
      ? t('accessibility.screenReaderOn')
      : t('accessibility.screenReaderOff')
    speak(actionMessage)
  }

  return (
    <button
      className="language-toggle accessibility-toggle"
      type="button"
      onClick={handleToggle}
      aria-pressed={enabled}
      aria-label={t('accessibility.screenReader')}
      title={t('accessibility.screenReader')}
    >
      {t('accessibility.screenReader')}
    </button>
  )
}
