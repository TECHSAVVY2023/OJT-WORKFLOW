const STORAGE_KEY = 'workflow_order_seq'

function getSeq(): number {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const n = parseInt(raw, 10)
        if (!Number.isNaN(n)) return n
      }
    } catch (_) {}
  }
  return 0
}

function setSeq(n: number) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(n))
  }
}

/** Returns next order number in format WF0001, WF0002, ... */
export function useOrderNumber() {
  function getNextOrderNumber(): string {
    const next = getSeq() + 1
    setSeq(next)
    return 'WF' + String(next).padStart(4, '0')
  }

  return { getNextOrderNumber }
}
