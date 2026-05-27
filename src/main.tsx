import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import i18n from './i18n/config'
import App from './App.tsx'

function Root() {
  useEffect(() => {
    const saved = localStorage.getItem('language')
    if (saved === 'pt' || saved === 'en') {
      void i18n.changeLanguage(saved)
    }
  }, [])

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
