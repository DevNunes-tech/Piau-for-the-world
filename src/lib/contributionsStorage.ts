const STORAGE_KEY = 'piaui-viva-contributions-v1'

export type ContributionRole =
  | 'teacher'
  | 'student'
  | 'guide'
  | 'artisan'
  | 'manager'
  | 'other'

export type ContributionPayload = {
  id: string
  createdAt: string
  role: ContributionRole
  title: string
  description: string
  contact?: string
}

export function loadContributions(): ContributionPayload[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as ContributionPayload[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function saveContribution(entry: Omit<ContributionPayload, 'id' | 'createdAt'>): ContributionPayload {
  const list = loadContributions()
  const item: ContributionPayload = {
    ...entry,
    id:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
  }
  list.unshift(item)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)))
  return item
}
