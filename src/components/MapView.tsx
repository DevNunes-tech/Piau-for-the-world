import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, GeoJSON } from 'react-leaflet'
import { Icon } from 'leaflet'
import type { Layer } from 'leaflet'
import type { Feature, GeoJsonObject, Geometry } from 'geojson'
import 'leaflet/dist/leaflet.css'
import { REGIONS } from '../data/regions'
import { FEATURED_CITIES } from '../data/cities'
import { useTranslation } from 'react-i18next'
import type { Spot } from '../data/regions'
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

const MediaIcon = new Icon({
  iconUrl:
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 44%22%3E%3Cpath fill=%22%23057132%22 d=%22M16 0C7.2 0 0 7.1 0 15.9 0 27.7 16 44 16 44s16-16.3 16-28.1C32 7.1 24.8 0 16 0Z%22/%3E%3Cpath fill=%22white%22 d=%22M22.6 12.6h-2.8l-1.4-2h-4.8l-1.4 2H9.4A2.4 2.4 0 0 0 7 15v9.2a2.4 2.4 0 0 0 2.4 2.4h13.2a2.4 2.4 0 0 0 2.4-2.4V15a2.4 2.4 0 0 0-2.4-2.4Zm-6.6 11a4.6 4.6 0 1 1 0-9.2 4.6 4.6 0 0 1 0 9.2Zm0-2.1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z%22/%3E%3C/svg%3E',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function toEmbedUrl(url: string) {
  return url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
}

export default function MapView({ onCityChoose }: MapViewProps) {
  const { t } = useTranslation()
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [municipiosData, setMunicipiosData] = useState<GeoJsonObject | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const allSpots = useMemo(() => REGIONS.flatMap((region) => region.spots), [])
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => console.log('Geolocation not available'),
      )
    }
  }, [])

  useEffect(() => {
    fetch('/data/municipios_piaui.json')
      .then((response) => response.json())
      .then((data: GeoJsonObject) => setMunicipiosData(data))
      .catch((error) => console.error('Error loading municipios data:', error))
  }, [])

  useEffect(() => {
    setSelectedPhotoIndex(0)
  }, [selectedSpot?.id])

  const piauiCenter: [number, number] = [-5.09, -42.8]

  return (
    <div className="map-view">
      <header className="map-view-heading">
        <p>{t('map.mediaKicker', 'Midia georreferenciada')}</p>
        <h2>{t('nav.map')}</h2>
      </header>

      <MapContainer center={piauiCenter} zoom={7} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {municipiosData && (
          <GeoJSON
            data={municipiosData}
            style={{ color: '#057132', weight: 1, opacity: 0.45, fillOpacity: 0.05 }}
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
            <Popup>
              {t('msg.userLocation')}: {userLocation[0].toFixed(2)}, {userLocation[1].toFixed(2)}
            </Popup>
          </CircleMarker>
        )}

        {allSpots.map((spot) => {
          const cityMatch = FEATURED_CITIES.find(
            (city) => city.name.toLowerCase() === spot.municipality.toLowerCase(),
          )
          const photos = spot.photos && spot.photos.length > 0 ? spot.photos : spot.image ? [spot.image] : []
          const videos = spot.videos ?? []
          const hasMedia = photos.length > 0 || videos.length > 0
          const photoIndex = selectedSpot?.id === spot.id ? selectedPhotoIndex : 0
          const icon = hasMedia ? MediaIcon : DefaultIcon

          return (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lng]}
              icon={icon}
              eventHandlers={{
                click: () => setSelectedSpot(spot),
              }}
            >
              <Popup minWidth={280} maxWidth={360}>
                <div className="popup-content">
                  <h4>{t(spot.titleKey)}</h4>
                  <p>
                    <strong>{spot.municipality}</strong>
                  </p>
                  <p className="popup-coordinates">
                    {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                  </p>

                  {photos.length > 0 && (
                    <div className="popup-media">
                      <img src={photos[photoIndex]} alt={`${t(spot.titleKey)} - foto ${photoIndex + 1}`} />
                      {photos.length > 1 && (
                        <div className="popup-photo-controls">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPhotoIndex((index) => (index - 1 + photos.length) % photos.length)
                            }
                            aria-label="Foto anterior"
                          >
                            &lt;
                          </button>
                          <span>
                            {photoIndex + 1} / {photos.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedPhotoIndex((index) => (index + 1) % photos.length)}
                            aria-label="Proxima foto"
                          >
                            &gt;
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {videos.length > 0 && (
                    <div className="popup-video">
                      <iframe
                        src={toEmbedUrl(videos[0].url)}
                        title={videos[0].title}
                        allowFullScreen
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                      <p>{videos[0].title}</p>
                    </div>
                  )}

                  <p>{t(spot.summaryKey)}</p>
                  {cityMatch && (
                    <button type="button" className="map-city-action" onClick={() => onCityChoose(cityMatch.id)}>
                      {t('map.exploreCity')}
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
