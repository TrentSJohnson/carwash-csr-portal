export function getDateThreshold(rangeId) {
  const now = new Date()
  if (rangeId === '24h')   return new Date(now - 24 * 60 * 60 * 1000)
  if (rangeId === '7d')    return new Date(now - 7 * 24 * 60 * 60 * 1000)
  if (rangeId === 'month') return new Date(now.getFullYear(), now.getMonth(), 1)
  return null
}

export function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatDateTime(ts) {
  if (!ts) return '—'
  const d     = new Date(ts)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day   = String(d.getDate()).padStart(2, '0')
  const year  = d.getFullYear()
  const hours = d.getHours()
  const mins  = String(d.getMinutes()).padStart(2, '0')
  const ampm  = hours >= 12 ? 'PM' : 'AM'
  const h     = String(hours % 12 || 12).padStart(2, '0')
  return `${month}/${day}/${year} ${h}:${mins} ${ampm}`
}
