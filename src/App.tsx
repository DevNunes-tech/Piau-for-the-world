import { useEffect, useState } from 'react'
import TerritoryExplorer from './components/TerritoryExplorer'
import MapView from './components/MapView'
import CreativeEconomy from './components/CreativeEconomy'
import ItineraryBuilder from './components/ItineraryBuilder'
import InnovationLab from './components/InnovationLab'
import InvestePiauiCulture from './components/InvestePiauiCulture'
import LanguageToggle from './components/LanguageToggle'
import { useTranslation } from 'react-i18next'
import { recordPageVisit } from './lib/gamification'
import './App.css'

export type Page = 'home' | 'map' | 'creative' | 'itinerary' | 'lab' | 'invest'

export default function App() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null)

  useEffect(() => {
    recordPageVisit(currentPage)
  }, [currentPage])

  const navigateToCity = (cityId: string) => {
    setSelectedCityId(cityId)
    setCurrentPage('home')
  }

  const navItems: { page: Page; label: string; icon: string }[] = [
    { page: 'home', label: t('nav.home'), icon: 'home' },
    { page: 'map', label: t('nav.map'), icon: 'map' },
    { page: 'itinerary', label: t('nav.itinerary'), icon: 'route' },
    { page: 'creative', label: t('nav.creative'), icon: 'palette' },
    { page: 'invest', label: t('nav.invest'), icon: 'invest' },
    { page: 'lab', label: t('nav.lab'), icon: 'lab' },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'map':
        return <MapView onCityChoose={navigateToCity} />
      case 'creative':
        return <CreativeEconomy />
      case 'itinerary':
        return <ItineraryBuilder />
      case 'lab':
        return <InnovationLab />
      case 'invest':
        return <InvestePiauiCulture onOpenMap={() => setCurrentPage('map')} />
      default:
        return (
          <TerritoryExplorer
            selectedCityId={selectedCityId}
            onCitySelect={(cityId) => setSelectedCityId(cityId)}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <LanguageToggle />
        </div>
      </header>

      <main className="app-main">
        {renderPage()}
      </main>

      <nav className="app-nav">
        {navItems.map((item) => (
          <button
            key={item.page}
            className={`nav-btn ${currentPage === item.page ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.page)}
            aria-label={item.label}
          >
            <span className={`nav-icon nav-icon-${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
