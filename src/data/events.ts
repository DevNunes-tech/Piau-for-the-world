export type CulturalEvent = {
  id: string
  titleKey: string
  descriptionKey: string
  location: string
  dateKey?: string
  image?: string
  region: string
}

export const CULTURAL_EVENTS: CulturalEvent[] = [
  {
    id: 'festivalInvernoPedroII',
    titleKey: 'event.festivalInvernoPedroII.title',
    descriptionKey: 'event.festivalInvernoPedroII.description',
    location: 'Pedro II',
    dateKey: 'event.festivalInvernoPedroII.date',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=400&fit=crop',
    region: 'poloDasOrigens',
  },
  {
    id: 'semanaBumbaMeuBoi',
    titleKey: 'event.semanaBumbaMeuBoi.title',
    descriptionKey: 'event.semanaBumbaMeuBoi.description',
    location: 'Teresina',
    dateKey: 'event.semanaBumbaMeuBoi.date',
    image: 'https://images.unsplash.com/photo-1514306688687-30f079876921?w=500&h=400&fit=crop',
    region: 'teresina',
  },
  {
    id: 'encontroSaberesCapivara',
    titleKey: 'event.encontroSaberesCapivara.title',
    descriptionKey: 'event.encontroSaberesCapivara.description',
    location: 'São Raimundo Nonato',
    dateKey: 'event.encontroSaberesCapivara.date',
    image: 'https://images.unsplash.com/photo-1505373877411-f1d229d507a7?w=500&h=400&fit=crop',
    region: 'poloDasOrigens',
  },
]

export const ARTISANSHIP = [
  {
    id: 'ceramicaDelta',
    titleKey: 'artisan.ceramicaDelta.title',
    descriptionKey: 'artisan.ceramicaDelta.description',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=400&fit=crop',
    region: 'costaDoDelta',
  },
  {
    id: 'cajuinaArtesanal',
    titleKey: 'artisan.cajuinaArtesanal.title',
    descriptionKey: 'artisan.cajuinaArtesanal.description',
    image: 'https://images.unsplash.com/photo-1587738227684-feddb9745acf?w=500&h=400&fit=crop',
    region: 'costaDoDelta',
  },
  {
    id: 'rendaBilro',
    titleKey: 'artisan.rendaBilro.title',
    descriptionKey: 'artisan.rendaBilro.description',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=400&fit=crop',
    region: 'costaDoDelta',
  },
  {
    id: 'joiasOpala',
    titleKey: 'artisan.joiasOpala.title',
    descriptionKey: 'artisan.joiasOpala.description',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=400&fit=crop',
    region: 'poloDasOrigens',
  },
  {
    id: 'pacocaCarne',
    titleKey: 'artisan.pacocaCarne.title',
    descriptionKey: 'artisan.pacocaCarne.description',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
    region: 'poloDasOrigens',
  },
  {
    id: 'tapecariaRupestre',
    titleKey: 'artisan.tapecariaRupestre.title',
    descriptionKey: 'artisan.tapecariaRupestre.description',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=400&fit=crop',
    region: 'poloDasOrigens',
  },
]
