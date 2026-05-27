import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/MapMediaGallery.css'

interface MapMediaGalleryProps {
  title: string
  photos?: string[]
  videos?: Array<{
    title: string
    url: string
    thumbnail?: string
  }>
  onClose: () => void
}

export default function MapMediaGallery({
  title,
  photos = [],
  videos = [],
  onClose,
}: MapMediaGalleryProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>(photos.length > 0 ? 'photos' : 'videos')
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const allPhotos = photos || []
  const allVideos = videos || []

  const hasPhotos = allPhotos.length > 0
  const hasVideos = allVideos.length > 0

  if (!hasPhotos && !hasVideos) {
    return null
  }

  return (
    <div className="map-media-gallery-overlay" onClick={onClose}>
      <div className="map-media-gallery" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-close" onClick={onClose} aria-label={t('btn.close')}>
          ✕
        </button>

        <h3>{title}</h3>

        {hasPhotos && hasVideos && (
          <div className="gallery-tabs">
            <button
              className={`tab ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              {t('map.photos', 'Fotos')} ({allPhotos.length})
            </button>
            <button
              className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              {t('map.videos', 'Vídeos')} ({allVideos.length})
            </button>
          </div>
        )}

        {activeTab === 'photos' && hasPhotos && (
          <div className="gallery-photos">
            <div className="photo-viewer">
              <img src={allPhotos[selectedPhotoIndex]} alt={`${title} - foto ${selectedPhotoIndex + 1}`} />
              {allPhotos.length > 1 && (
                <div className="photo-controls">
                  <button
                    onClick={() => setSelectedPhotoIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length)}
                    aria-label="Foto anterior"
                  >
                    ‹
                  </button>
                  <span>{selectedPhotoIndex + 1} / {allPhotos.length}</span>
                  <button
                    onClick={() => setSelectedPhotoIndex((i) => (i + 1) % allPhotos.length)}
                    aria-label="Próxima foto"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {allPhotos.length > 1 && (
              <div className="photo-thumbnails">
                {allPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Miniatura ${index + 1}`}
                    className={`thumbnail ${index === selectedPhotoIndex ? 'active' : ''}`}
                    onClick={() => setSelectedPhotoIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && hasVideos && (
          <div className="gallery-videos">
            <div className="videos-grid">
              {allVideos.map((video, index) => (
                <div key={index} className="video-item">
                  <div className="video-embed">
                    {video.url.includes('youtube') || video.url.includes('youtu.be') ? (
                      <iframe
                        width="100%"
                        height="200"
                        src={video.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        title={video.title}
                        allowFullScreen
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <video width="100%" height="200" controls poster={video.thumbnail}>
                        <source src={video.url} />
                        Seu navegador não suporta vídeos HTML5.
                      </video>
                    )}
                  </div>
                  <p>{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
