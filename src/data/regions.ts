export type Spot = {
  id: string
  titleKey: string
  municipality: string
  lat: number
  lng: number
  category: string
  summaryKey: string
  image?: string
}

export type CreativeItem = {
  id: string
  titleKey: string
  descriptionKey: string
  image?: string
  type?: 'artesanato' | 'gastronomia' | 'evento'
}

export type CulturalEvent = {
  id: string
  titleKey: string
  descriptionKey: string
  location: string
  date?: string
  image?: string
}

export type Territory = {
  id: string
  nameKey: string
  summaryKey: string
  color: string
  center: [number, number]
  spots: Spot[]
  creative: CreativeItem[]
  events?: CulturalEvent[]
}

export const REGIONS: Territory[] = [
  {
    id: 'costaDoDelta',
    nameKey: 'region.costaDoDelta.name',
    summaryKey: 'region.costaDoDelta.summary',
    color: '#005c54',
    center: [-2.83, -41.76],
    spots: [
      {
        id: 'portoLuisCorreia',
        titleKey: 'spot.portoLuisCorreia.title',
        municipality: 'Luís Correia',
        lat: -2.8802,
        lng: -41.7601,
        category: 'Turismo',
        summaryKey: 'spot.portoLuisCorreia.summary',
        image:
          'https://commons.wikimedia.org/wiki/Special:FilePath/Praia_do_Coqueiro_-_Luis_Correia%2C_Piau%C3%AD%2C_Brasil_-_coqueiral.jpg?width=960',
      },
      {
        id: 'canyonRioPoti',
        titleKey: 'spot.canyonRioPoti.title',
        municipality: 'Buriti dos Montes',
        lat: -4.2168,
        lng: -41.1374,
        category: 'Patrimônio',
        summaryKey: 'spot.canyonRioPoti.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/C%C3%A2nion_do_Rio_Poti_em_Crate%C3%BAs.jpg?width=900',
      },
      {
        id: 'deltaDoParnaiba',
        titleKey: 'spot.deltaDoParnaiba.title',
        municipality: 'Ilha Grande',
        lat: -2.8,
        lng: -41.7,
        category: 'Natureza',
        summaryKey: 'spot.deltaDoParnaiba.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Delta_do_Parna%C3%ADba.jpg?width=900',
      },
      {
        id: 'cachoeiraUrubu',
        titleKey: 'spot.cachoeiraUrubu.title',
        municipality: 'Piripiri',
        lat: -3.0,
        lng: -41.5,
        category: 'Natureza',
        summaryKey: 'spot.cachoeiraUrubu.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cachoeira_do_Urubu.jpg?width=900',
      },
      {
        id: 'praiaBarraGrande',
        titleKey: 'spot.praiaBarraGrande.title',
        municipality: 'Luís Correia',
        lat: -2.9,
        lng: -41.8,
        category: 'Praia',
        summaryKey: 'spot.praiaBarraGrande.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Barra_Grande_-_Piaui.jpg?width=900',
      },
      {
        id: 'praiaPedraSal',
        titleKey: 'spot.praiaPedraSal.title',
        municipality: 'Luís Correia',
        lat: -2.8,
        lng: -41.7,
        category: 'Praia',
        summaryKey: 'spot.praiaPedraSal.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Praia_da_Pedra_do_Sal_Parna%C3%ADba.JPG?width=900',
      },
      {
        id: 'lagoaPortinho',
        titleKey: 'spot.lagoaPortinho.title',
        municipality: 'Luís Correia',
        lat: -2.8,
        lng: -41.7,
        category: 'Praia',
        summaryKey: 'spot.lagoaPortinho.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dunas_da_Lagoa_do_Portinho_-_Piau%C3%AD.jpg?width=900',
      },
      {
        id: 'praiaCoqueiro',
        titleKey: 'spot.praiaCoqueiro.title',
        municipality: 'Luís Correia',
        lat: -2.8,
        lng: -41.7,
        category: 'Praia',
        summaryKey: 'spot.praiaCoqueiro.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Praia_do_Coqueiro_-_Luis_Correia%2C_Piau%C3%AD%2C_Brasil_-_coqueiral.jpg?width=900',
      },
    ],
    creative: [
      {
        id: 'artesanatoMarajoara',
        titleKey: 'creative.artesanatoMarajoara.title',
        descriptionKey: 'creative.artesanatoMarajoara.description',
        type: 'artesanato',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Renda_de_bilro_da_Ilha_Grande-PI.jpg?width=900',
      },
      {
        id: 'praiasGastronomia',
        titleKey: 'creative.praiasGastronomia.title',
        descriptionKey: 'creative.praiasGastronomia.description',
        type: 'gastronomia',
        image: 'https://caminhosmelevem.com/wp-content/uploads/2022/10/fortaleza-ceara-edit-12.jpg',
      },
    ],
  },
  {
    id: 'poloDasOrigens',
    nameKey: 'region.poloDasOrigens.name',
    summaryKey: 'region.poloDasOrigens.summary',
    color: '#a75d2a',
    center: [-8.31, -42.93],
    spots: [
      {
        id: 'parque7Cidades',
        titleKey: 'spot.parque7Cidades.title',
        municipality: 'Piracuruca',
        lat: -3.8693,
        lng: -41.9548,
        category: 'Natureza',
        summaryKey: 'spot.parque7Cidades.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Parque_Nacional_de_Sete_Cidades_-_Piau%C3%AD.jpg?width=900',
      },
      {
        id: 'serraDaCapivara',
        titleKey: 'spot.serraDaCapivara.title',
        municipality: 'São Raimundo Nonato',
        lat: -8.5179,
        lng: -42.9495,
        category: 'Arqueologia',
        summaryKey: 'spot.serraDaCapivara.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Serra_da_Capivara.jpg?width=900',
      },
      {
        id: 'serraConfusoes',
        titleKey: 'spot.serraConfusoes.title',
        municipality: 'Caracol',
        lat: -9.0,
        lng: -43.0,
        category: 'Natureza',
        summaryKey: 'spot.serraConfusoes.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Serra_das_Confus%C3%B5es_-_Piau%C3%AD.jpg?width=900',
      },
      {
        id: 'liraEcoParque',
        titleKey: 'spot.liraEcoParque.title',
        municipality: 'Amarante',
        lat: -8.0,
        lng: -42.0,
        category: 'Ecoturismo',
        summaryKey: 'spot.liraEcoParque.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Escadaria_de_Amarante_%28Piau%C3%AD%29.jpg?width=900',
      },
      {
        id: 'miranteGritador',
        titleKey: 'spot.miranteGritador.title',
        municipality: 'Pedro II',
        lat: -7.5,
        lng: -42.0,
        category: 'Mirante',
        summaryKey: 'spot.miranteGritador.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mirante_do_Gritador_%283764960137%29.jpg?width=900',
      },
      {
        id: 'cachoeiraSaltoLiso',
        titleKey: 'spot.cachoeiraSaltoLiso.title',
        municipality: 'Pedro II',
        lat: -7.5,
        lng: -42.0,
        category: 'Cachoeira',
        summaryKey: 'spot.cachoeiraSaltoLiso.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cachoeira_do_Salto_Liso_-_Pedro_II_-_PI_%283759362567%29.jpg?width=900',
      },
      {
        id: 'caldeiraoRodrigues',
        titleKey: 'spot.caldeiraoRodrigues.title',
        municipality: 'São Raimundo Nonato',
        lat: -8.5,
        lng: -42.9,
        category: 'Arqueologia',
        summaryKey: 'spot.caldeiraoRodrigues.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Entrada_caldeirao_dos_rodrigues.jpg?width=900',
      },
      {
        id: 'cachoeiraEngenhoVelho',
        titleKey: 'spot.cachoeiraEngenhoVelho.title',
        municipality: 'São Raimundo Nonato',
        lat: -8.0,
        lng: -42.0,
        category: 'Cachoeira',
        summaryKey: 'spot.cachoeiraEngenhoVelho.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cachoeira_do_Salto_Liso_-_Pedro_II_-_PI_%283760236370%29.jpg?width=900',
      },
      {
        id: 'pedraCastelo',
        titleKey: 'spot.pedraCastelo.title',
        municipality: 'Castelo do Piauí',
        lat: -7.0,
        lng: -42.0,
        category: 'Histórico',
        summaryKey: 'spot.pedraCastelo.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/C%C3%A2nion_do_Rio_Poti_em_Crate%C3%BAs.jpg?width=900',
      },
      {
        id: 'cachoeiraTingidor',
        titleKey: 'spot.cachoeiraTingidor.title',
        municipality: 'São Raimundo Nonato',
        lat: -8.0,
        lng: -42.0,
        category: 'Cachoeira',
        summaryKey: 'spot.cachoeiraTingidor.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cachoeira_de_Salto_Liso%2C_Pedro_II%2C_Piau%C3%AD%2C_Brasil_8.JPG?width=900',
      },
    ],
    creative: [
      {
        id: 'arteRupestre',
        titleKey: 'creative.arteRupestre.title',
        descriptionKey: 'creative.arteRupestre.description',
        type: 'artesanato',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Capivaras_na_Serra_da_Capivara.jpg?width=900',
      },
      {
        id: 'cuisineNordestina',
        titleKey: 'creative.cuisineNordestina.title',
        descriptionKey: 'creative.cuisineNordestina.description',
        type: 'gastronomia',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Caju%C3%ADna_no_Piau%C3%AD%2C_Brasil.JPG?width=900',
      },
    ],
  },
  {
    id: 'teresina',
    nameKey: 'region.teresina.name',
    summaryKey: 'region.teresina.summary',
    color: '#5c2e91',
    center: [-5.09, -42.80],
    spots: [
      {
        id: 'rioPoti',
        titleKey: 'spot.rioPoti.title',
        municipality: 'Teresina',
        lat: -5.0869,
        lng: -42.8019,
        category: 'Cultural',
        summaryKey: 'spot.rioPoti.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vista_a%C3%A9rea_do_rio_Poti_em_Teresina.jpg?width=900',
      },
      {
        id: 'museuDoPiauí',
        titleKey: 'spot.museuDoPiaui.title',
        municipality: 'Teresina',
        lat: -5.0955,
        lng: -42.8032,
        category: 'Histórico',
        summaryKey: 'spot.museuDoPiaui.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Museu_do_Piau%C3%AD_pr%C3%A9dio.JPG?width=900',
      },
      {
        id: 'encontroRios',
        titleKey: 'spot.encontroRios.title',
        municipality: 'Teresina',
        lat: -5.1,
        lng: -42.8,
        category: 'Parque',
        summaryKey: 'spot.encontroRios.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Encontro_dos_Rios_Parna%C3%ADba_e_Poty_no_ano_de_2025.jpg?width=900',
      },
      {
        id: 'parqueFlorestaFossil',
        titleKey: 'spot.parqueFlorestaFossil.title',
        municipality: 'Teresina',
        lat: -5.1,
        lng: -42.8,
        category: 'Parque',
        summaryKey: 'spot.parqueFlorestaFossil.summary',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Floresta-Fossil-Teresina.jpeg?width=900',
      },    ],
    creative: [
      {
        id: 'economiaCriativaTeresina',
        titleKey: 'creative.economiaCriativaTeresina.title',
        descriptionKey: 'creative.economiaCriativaTeresina.description',
        type: 'evento',
        image: 'https://admin.pi.gov.br/uploads/Whats_App_Image_2024_04_01_at_10_20_54_AM_32fe704cb4.jpeg',
      },
      {
        id: 'eventosTeresina',
        titleKey: 'creative.eventosTeresina.title',
        descriptionKey: 'creative.eventosTeresina.description',
        type: 'evento',
        image: 'https://www.pi.gov.br/wp-content/uploads/2025/06/cidade-junina.jpg',
      },
      {
        id: 'festasPopulares',
        titleKey: 'creative.festasPopulares.title',
        descriptionKey: 'creative.festasPopulares.description',
        type: 'evento',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bumba-meu-boi.jpg?width=900',
      },
    ],
  },
]
