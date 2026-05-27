import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, GeoJSON } from 'react-leaflet'
import { Icon } from 'leaflet'
import type { Layer } from 'leaflet'
import type { Feature, GeoJsonObject, Geometry } from 'geojson'
import 'leaflet/dist/leaflet.css'
import { REGIONS } from '../data/regions'
import { FEATURED_CITIES } from '../data/cities'
import { useTranslation } from 'react-i18next'
import '../styles/MapView.css'

type MapViewProps = {
  onCityChoose: (cityId: string) => void
}

type MunicipioProperties = {
  NM_MUN?: string
  NM_RGI?: string
}

const DefaultIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function MapView({ onCityChoose }: MapViewProps) {
  const { t } = useTranslation()
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [municipiosData, setMunicipiosData] = useState<GeoJsonObject | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => console.log('Geolocation not available')
      )
    }
  }, [])

  useEffect(() => {
    fetch('/data/municipios_piaui.json')
      .then((response) => response.json())
      .then((data: GeoJsonObject) => setMunicipiosData(data))
      .catch((error) => console.error('Error loading municipios data:', error))
  }, [])

  const piauiCenter: [number, number] = [-5.09, -42.80]

  return (
    <div className="map-view">
      <h2>{t('nav.map')}</h2>
      <MapContainer center={piauiCenter} zoom={7} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {municipiosData && (
          <GeoJSON
            data={municipiosData}
            style={{ color: 'red', weight: 1, opacity: 0.5 }}
            onEachFeature={(feature: Feature<Geometry, MunicipioProperties>, layer: Layer) => {
              const municipality = feature.properties?.NM_MUN
              const region = feature.properties?.NM_RGI

              if (municipality) {
                layer.bindPopup(`<b>${municipality}</b><br/>${t('map.region')}: ${region ?? '-'}`)
              }
            }}
          />
        )}

        {userLocation && (
          <CircleMarker center={userLocation} radius={8} color="blue" fill>
            <Popup>{t('msg.userLocation')}: {userLocation[0].toFixed(2)}, {userLocation[1].toFixed(2)}</Popup>
          </CircleMarker>
        )}

        {REGIONS.map((region) =>
          region.spots.map((spot) => {
            const cityMatch = FEATURED_CITIES.find(
              (city) => city.name.toLowerCase() === spot.municipality.toLowerCase(),
            )

            return (
              <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={DefaultIcon}>
                <Popup>
                  <div className="popup-content">
                    <h4>{t(spot.titleKey)}</h4>
                    <p><strong>{spot.municipality}</strong></p>
                    <p>{t(spot.summaryKey)}</p>
                    {cityMatch && (
                      <button
                        type="button"
                        className="map-city-action"
                        onClick={() => onCityChoose(cityMatch.id)}
                      >
                        {t('map.exploreCity')}
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })
        )}
      </MapContainer>
    </div>
  )
}
