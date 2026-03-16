export function formatDate(ts, style = 'short') {
  if (!ts) return '—'
  const d = new Date(ts)
  if (style === 'full') {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day   = String(d.getDate()).padStart(2, '0')
  return `${month}/${day}`
}
