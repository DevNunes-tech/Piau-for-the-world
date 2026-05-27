export type CityHighlight = {
  id: string
  name: string
  nickname: string
  region: string
  section: 'faith' | 'routes' | 'nature'
  image: string
  summary: string
  details: string
  tags: string[]
  sourceLabel: string
  sourceUrl: string
}

export const CITY_SECTIONS = [
  {
    id: 'faith',
    title: 'Fé, história e memória',
    description: 'Cidades que guardam a formação cultural, religiosa e política do Piauí.',
  },
  {
    id: 'routes',
    title: 'Rotas, comércio e produção',
    description: 'Centros urbanos que movimentam estradas, feiras, serviços e economia criativa.',
  },
  {
    id: 'nature',
    title: 'Natureza e patrimônio vivo',
    description: 'Portas de entrada para parques, cachoeiras, litoral, opalas e paisagens únicas.',
  },
] as const

export const FEATURED_CITIES: CityHighlight[] = [
  {
    id: 'oeiras',
    name: 'Oeiras',
    nickname: 'Capital da Fé e 1ª capital do Piauí',
    region: 'Território Vale do Canindé',
    section: 'faith',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Igreja_Matriz_de_Nossa_Senhora_das_Vit%C3%B3rias_-_Oeiras_-_20240930164907.JPG?width=900',
    summary: 'Primeira capital piauiense, cidade de casarões, igrejas e celebrações religiosas históricas.',
    details:
      'Oeiras nasceu ligada à antiga Vila da Mocha e preserva um dos conjuntos históricos mais simbólicos do estado. A cidade é apresentada pelo turismo oficial do Piauí como primeira capital, Patrimônio Cultural Brasileiro e Capital da Fé, com destaque para a Semana Santa e a Procissão do Fogaréu.',
    tags: ['Fé', 'História', 'Patrimônio'],
    sourceLabel: 'Turismo Piauí',
    sourceUrl: 'https://turismo.pi.gov.br/turismo-piaui/oeiras/',
  },
  {
    id: 'picos',
    name: 'Picos',
    nickname: 'Capital do Mel e porta de entrada da Capadócia Nordestina',
    region: 'Centro-sul do Piauí',
    section: 'routes',
    image: 'https://www.picos40graus.com.br/userfiles/images/DSC_1966.JPG',
    summary: 'Cidade polo de comércio, produção de mel e acesso às formações rochosas da Capadócia Nordestina.',
    details:
      'Picos é conhecida como a porta de entrada para a Capadócia Nordestina. Além do entroncamento rodoviário e da produção de mel, a cidade conecta visitantes a paredões, cânions e paisagens geológicas únicas do sertão.',
    tags: ['Mel', 'Rodovias', 'Capadócia'],
    sourceLabel: 'Prefeitura de Picos',
    sourceUrl: 'https://www2.picos.pi.gov.br/secretarias/saude/secretaria-de-transito-faz-capacitacao-de-mototaxistas/',
  },
  {
    id: 'teresina',
    name: 'Teresina',
    nickname: 'Capital atual do Piauí',
    region: 'Entre os rios Poti e Parnaíba',
    section: 'routes',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ponte_Estaiada_-_Teresina.jpg?width=900',
    summary: 'Capital planejada, centro de serviços, cultura, economia criativa e encontro de rios.',
    details:
      'Teresina concentra equipamentos culturais, mercados, museus, parques urbanos e a relação forte com os rios Poti e Parnaíba. É o principal centro administrativo e de serviços do estado.',
    tags: ['Capital', 'Cultura', 'Serviços'],
    sourceLabel: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ponte_Estaiada_-_Teresina.jpg',
  },
  {
    id: 'parnaiba',
    name: 'Parnaíba',
    nickname: 'Portal do Delta',
    region: 'Litoral piauiense',
    section: 'nature',
    image: 'https://revistaoeste.com/oestegeral/wp-content/uploads/2025/09/parnaiba-750x375.jpg',
    summary: 'Base urbana para conhecer o Delta do Parnaíba, praias, ilhas e cultura litorânea.',
    details:
      'Parnaíba é uma das principais portas de entrada para o litoral do Piauí e para o Delta do Parnaíba, destino de natureza marcado por rios, ilhas, dunas, manguezais e comunidades tradicionais.',
    tags: ['Delta', 'Litoral', 'Natureza'],
    sourceLabel: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Delta_do_Parna%C3%ADba.jpg',
  },
  {
    id: 'luisCorreia',
    name: 'Luís Correia',
    nickname: 'Porto e praia do litoral piauiense',
    region: 'Litoral Piauiense',
    section: 'routes',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Praia_do_Coqueiro_-_Luis_Correia%2C_Piau%C3%AD%2C_Brasil_-_coqueiral.jpg?width=960',
    summary: 'Cidade litorânea e porto histórico que serve de base para o litoral e o Delta do Parnaíba.',
    details:
      'Luís Correia oferece praias com ondas, trilhas de dunas e pesca artesanal, servindo como um dos principais acessos ao litoral piauiense e ao ecoturismo costeiro.',
    tags: ['Litoral', 'Praias', 'Delta'],
    sourceLabel: 'Turismo Piauí',
    sourceUrl: 'https://turismo.pi.gov.br/',
  },
  {
    id: 'saoRaimundoNonato',
    name: 'São Raimundo Nonato',
    nickname: 'Portal da Serra da Capivara',
    region: 'Sudeste piauiense',
    section: 'nature',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Serra_da_Capivara.jpg?width=900',
    summary: 'Cidade referência para visitar sítios arqueológicos e paisagens da Serra da Capivara.',
    details:
      'São Raimundo Nonato funciona como base para experiências ligadas à Serra da Capivara, ao Museu do Homem Americano e aos roteiros de arqueologia, caatinga e história da presença humana no continente.',
    tags: ['Arqueologia', 'Caatinga', 'Museus'],
    sourceLabel: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Serra_da_Capivara.jpg',
  },
  {
    id: 'pedroII',
    name: 'Pedro II',
    nickname: 'Cidade das Opalas',
    region: 'Serra dos Matões',
    section: 'nature',
    image: 'https://s2-g1.glbimg.com/GJJCOoJYWaJ2NWqV1ZYeph7xsXw=/0x0:512x342/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2021/O/c/AqpXPUSPaxfpYBN3VKYA/mirante-gritador.jpg',
    summary: 'Destino serrano ligado às opalas, ao Festival de Inverno e às cachoeiras.',
    details:
      'Pedro II combina clima de serra, artesanato mineral, música e ecoturismo. A cidade é lembrada pelas opalas, pelo Festival de Inverno e por atrativos naturais como a Cachoeira do Salto Liso.',
    tags: ['Opalas', 'Serra', 'Festival'],
    sourceLabel: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Pedro_II_(Piau%C3%AD)',
  },
  {
    id: 'piripiri',
    name: 'Piripiri',
    nickname: 'Caminho das cachoeiras',
    region: 'Norte do Piauí',
    section: 'nature',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cachoeira_do_Urubu.jpg?width=900',
    summary: 'Ponto de apoio para visitar a Cachoeira do Urubu e roteiros naturais do norte do estado.',
    details:
      'Piripiri está próxima a áreas de lazer, trilhas e quedas d’água conhecidas no norte piauiense. É uma cidade estratégica para conectar turismo de natureza, comércio regional e cultura popular.',
    tags: ['Cachoeira', 'Natureza', 'Norte'],
    sourceLabel: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cachoeira_do_Urubu.jpg',
  },
  {
    id: 'floriano',
    name: 'Floriano',
    nickname: 'Princesa do Sul',
    region: 'Sul do Piauí',
    section: 'routes',
    image: 'https://cdn.paytour.com.br/assets/images/passeios-2501538/2d1f7c7246206d5136033bc5e575cad6/Floriano_Easy-Resize.com_optimized.webp',
    summary: 'Centro regional às margens do Rio Parnaíba, com comércio, cultura e vida ribeirinha.',
    details:
      'Floriano se destaca como polo regional do sul piauiense, com forte relação com o Rio Parnaíba, serviços, comércio e circulação cultural entre o Piauí e o Maranhão.',
    tags: ['Rio Parnaíba', 'Comércio', 'Sul'],
    sourceLabel: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Floriano_(Piau%C3%AD)',
  },
]
