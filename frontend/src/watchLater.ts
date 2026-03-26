const STORAGE_KEY = 'movie_explorer_watch_later'
export const WATCH_LATER_UPDATED_EVENT = 'watch-later-updated'

function readIds(): number[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }
  try {
    const parsed = JSON.parse(raw) as number[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeIds(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent(WATCH_LATER_UPDATED_EVENT))
}

export function getWatchLaterIds(): number[] {
  return readIds()
}

export function isInWatchLater(movieId: number): boolean {
  return readIds().includes(movieId)
}

export function toggleWatchLater(movieId: number): boolean {
  const ids = readIds()
  if (ids.includes(movieId)) {
    writeIds(ids.filter((id) => id !== movieId))
    return false
  }
  writeIds([...ids, movieId])
  return true
}
