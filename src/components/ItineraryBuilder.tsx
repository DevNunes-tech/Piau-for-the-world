import { useMemo, useState } from 'react'
import { REGIONS } from '../data/regions'
import type { Spot, Territory } from '../data/regions'
import { useTranslation } from 'react-i18next'
import '../styles/ItineraryBuilder.css'

type SpotWithRegion = Spot & { region: Territory }

function getDistanceKm([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function getRouteDistance(route: SpotWithRegion[]) {
  if (route.length < 2) return 0
  return route.reduce((sum, current, index, arr) => {
    if (index === 0) return 0
    const previous = arr[index - 1]
    return sum + getDistanceKm([previous.lat, previous.lng], [current.lat, current.lng])
  }, 0)
}

function buildNearestNeighborRoute(spots: SpotWithRegion[], startSpot: SpotWithRegion) {
  const route: SpotWithRegion[] = [startSpot]
  const remaining = spots.filter((spot) => spot.id !== startSpot.id)

  while (remaining.length > 0) {
    const last = route[route.length - 1]
    let closestIndex = 0
    let closestDistance = getDistanceKm([last.lat, last.lng], [remaining[0].lat, remaining[0].lng])

    for (let i = 1; i < remaining.length; i += 1) {
      const distance = getDistanceKm([last.lat, last.lng], [remaining[i].lat, remaining[i].lng])
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    route.push(remaining.splice(closestIndex, 1)[0])
  }

  return route
}

function getSuggestedRoute(spots: SpotWithRegion[]) {
  if (spots.length <= 1) return spots

  return spots.reduce<SpotWithRegion[]>((best, startSpot) => {
    const candidate = buildNearestNeighborRoute(spots, startSpot)
    return getRouteDistance(candidate) < getRouteDistance(best) ? candidate : best
  }, buildNearestNeighborRoute(spots, spots[0]))
}

export default function ItineraryBuilder() {
  const { t } = useTranslation()
  const [selectedSpots, setSelectedSpots] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const handleSpotToggle = (spotId: string) => {
    setSelectedSpots((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    )
  }

  const filteredSpots = selectedRegion === 'all'
    ? REGIONS.flatMap((region) => region.spots)
    : REGIONS.find((region) => region.id === selectedRegion)?.spots || []

  const allRegions = ['all', ...REGIONS.map((region) => region.id)]

  const selectedRoute = useMemo(
    () => REGIONS
      .flatMap((region) => region.spots.map((spot) => ({ ...spot, region })))
      .filter(({ id }) => selectedSpots.includes(id)),
    [selectedSpots]
  )

  const suggestedRoute = useMemo(() => getSuggestedRoute(selectedRoute), [selectedRoute])

  const totalDistance = useMemo(() => getRouteDistance(suggestedRoute), [suggestedRoute])

  return (
    <div className="itinerary-builder">
      <div className="itinerary-header">
        <h2>{t('nav.itinerary')}</h2>
        <p>{t('itinerary.description')}</p>
      </div>

      <div className="filter-buttons">
        {allRegions.map((region) => (
          <button
            key={region}
            className={`filter-btn ${selectedRegion === region ? 'active' : ''}`}
            onClick={() => setSelectedRegion(region)}
          >
            {region === 'all' ? t('btn.all') : t(`region.${region}.name`)}
          </button>
        ))}
      </div>

      <div className="spots-list">
        {filteredSpots.map((spot) => (
          <div key={spot.id} className="spot-item">
            <input
              type="checkbox"
              id={spot.id}
              checked={selectedSpots.includes(spot.id)}
              onChange={() => handleSpotToggle(spot.id)}
            />
            <label htmlFor={spot.id}>
              <div className="spot-info">
                <h4>{t(spot.titleKey)}</h4>
                <p>{spot.municipality} - {spot.category}</p>
              </div>
            </label>
          </div>
        ))}
      </div>

      {selectedSpots.length > 0 && (
        <div className="itinerary-actions">
          <button className="btn-primary" type="button">
            {t('btn.calculateRoute')} ({selectedSpots.length})
          </button>
          <span className="route-total">
            {t('itinerary.totalDistance')}: {totalDistance.toFixed(1)} km
          </span>
          <div className="route-suggestion">
            <strong>{t('itinerary.startSuggestion')}</strong>
            <span>{suggestedRoute.length > 0 ? t(suggestedRoute[0].titleKey) : ''}</span>
          </div>
          <div className="route-preview" aria-live="polite">
            <h3>{t('itinerary.previewTitle')}</h3>
            <ol>
              {suggestedRoute.map(({ id, titleKey, municipality, region }) => (
                <li key={id}>
                  <strong>{t(titleKey)}</strong>
                  <span>{municipality} - {t(region.nameKey)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
