import type { Spot } from './regions'

export const TRAVEL_INTEREST_IDS = [
  'eco',
  'religious',
  'historical',
  'adventure',
  'gastronomy',
  'popularCulture',
  'environmentalEd',
  'schoolRoute',
] as const

export type TravelInterestId = (typeof TRAVEL_INTEREST_IDS)[number]

const CATEGORY_INTERESTS: Record<string, TravelInterestId[]> = {
  Natureza: ['eco', 'environmentalEd', 'adventure'],
  Ecoturismo: ['eco', 'environmentalEd', 'schoolRoute'],
  Parque: ['eco', 'environmentalEd', 'schoolRoute', 'adventure'],
  Praia: ['gastronomy', 'adventure', 'eco'],
  Turismo: ['gastronomy', 'popularCulture', 'adventure'],
  Patrimônio: ['historical', 'religious', 'popularCulture'],
  Histórico: ['historical', 'schoolRoute', 'popularCulture'],
  Cultural: ['popularCulture', 'historical', 'gastronomy'],
  Arqueologia: ['historical', 'schoolRoute', 'environmentalEd'],
  Cachoeira: ['adventure', 'eco', 'environmentalEd'],
  Mirante: ['adventure', 'eco', 'historical'],
}

export function interestsForSpot(spot: Spot): TravelInterestId[] {
  const fromCategory = CATEGORY_INTERESTS[spot.category]
  if (fromCategory?.length) return [...fromCategory]
  return ['popularCulture']
}

export function spotMatchesInterests(
  spot: Spot,
  selected: TravelInterestId[],
): boolean {
  if (selected.length === 0) return true
  const tags = interestsForSpot(spot)
  return selected.some((id) => tags.includes(id))
}
