const STORAGE_KEY = 'mahamma-admin-workspace-v1'

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function loadWorkspaceSnapshot() {
  if (!canUseLocalStorage()) return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function saveWorkspaceSnapshot(snapshot) {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // Ignore storage failures in the prototype.
  }
}

export function clearWorkspaceSnapshot() {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage failures in the prototype.
  }
}
