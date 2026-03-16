export function getDescription(activity) {
  return activity.notes
    ? `${activity.action_taken}: ${activity.notes}`
    : activity.action_taken
}

export function formatMemberName(member) {
  return member?.first_name || member?.last_name
    ? `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim()
    : '—'
}

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
  return new Date(ts).toLocaleString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
