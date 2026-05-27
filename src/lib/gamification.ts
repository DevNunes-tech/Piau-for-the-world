const STORAGE_KEY = 'piaui-viva-gamification-v1'

export type BadgeId =
  | 'first_steps'
  | 'map_explorer'
  | 'itinerary_builder'
  | 'assistant_friend'
  | 'quiz_guardian'
  | 'delta_voice'

export type GamificationState = {
  points: number
  badges: BadgeId[]
  pagesVisited: Partial<Record<string, true>>
  maxItinerarySpots: number
  assistantTurns: number
  quizBestScore: number
}

const defaultState = (): GamificationState => ({
  points: 0,
  badges: [],
  pagesVisited: {},
  maxItinerarySpots: 0,
  assistantTurns: 0,
  quizBestScore: 0,
})

export function loadGamification(): GamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as GamificationState
    return {
      ...defaultState(),
      ...parsed,
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      pagesVisited: parsed.pagesVisited && typeof parsed.pagesVisited === 'object' ? parsed.pagesVisited : {},
    }
  } catch {
    return defaultState()
  }
}

function save(state: GamificationState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function addBadge(state: GamificationState, id: BadgeId, points: number) {
  if (state.badges.includes(id)) return state
  const next = { ...state, badges: [...state.badges, id], points: state.points + points }
  save(next)
  return next
}

export function recordPageVisit(page: string): GamificationState {
  const s = loadGamification()
  if (s.pagesVisited[page]) return s
  const next: GamificationState = {
    ...s,
    pagesVisited: { ...s.pagesVisited, [page]: true },
    points: s.points + 5,
  }
  save(next)
  let withBadges = addBadge(next, 'first_steps', 0)
  if (page === 'map') withBadges = addBadge(withBadges, 'map_explorer', 15)
  return withBadges
}

export function recordItinerarySelection(count: number): GamificationState {
  const s = loadGamification()
  const maxItinerarySpots = Math.max(s.maxItinerarySpots, count)
  const next: GamificationState = { ...s, maxItinerarySpots }
  save(next)
  if (maxItinerarySpots >= 3) return addBadge(next, 'itinerary_builder', 20)
  return next
}

export function recordAssistantTurn(): GamificationState {
  const s = loadGamification()
  const assistantTurns = s.assistantTurns + 1
  let next: GamificationState = { ...s, assistantTurns, points: s.points + 3 }
  save(next)
  if (assistantTurns >= 5) next = addBadge(next, 'assistant_friend', 12)
  return next
}

export function recordQuizScore(score: number, max: number): GamificationState {
  const s = loadGamification()
  const prevBest = s.quizBestScore
  const quizBestScore = Math.max(s.quizBestScore, score)
  const gained = Math.max(0, quizBestScore - prevBest)
  let next: GamificationState = { ...s, quizBestScore, points: s.points + gained * 8 }
  save(next)
  if (score >= max) next = addBadge(next, 'quiz_guardian', 25)
  return next
}

/** Conteúdo do assistente mencionou delta / voz do território */
export function recordDeltaMention(): GamificationState {
  const s = loadGamification()
  return addBadge(s, 'delta_voice', 10)
}
