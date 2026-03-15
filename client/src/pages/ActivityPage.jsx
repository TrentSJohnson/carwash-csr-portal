import { useState, useEffect, useMemo } from 'react'
import { getActivities } from '../services/api'
import DateRangeSelect from '../components/DateRangeSelect'

function formatDate(ts) {
  const d = new Date(ts)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = String(hours % 12 || 12).padStart(2, '0')
  return `${month}/${day} ${h}:${minutes} ${ampm}`
}

function getTimeThreshold(rangeId) {
  const now = new Date()
  if (rangeId === '24h') return new Date(now - 24 * 60 * 60 * 1000)
  if (rangeId === '7d') return new Date(now - 7 * 24 * 60 * 60 * 1000)
  if (rangeId === 'month') return new Date(now.getFullYear(), now.getMonth(), 1)
  return null
}

function getDescription(activity) {
  return activity.notes
    ? `${activity.action_taken}: ${activity.notes}`
    : activity.action_taken
}

export default function ActivityPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeFilter, setTimeFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getActivities()
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const threshold = getTimeThreshold(timeFilter)
    return activities.filter((a) => {
      if (threshold && new Date(a.timestamp) < threshold) return false
      if (search) {
        const q = search.toLowerCase()
        const date = formatDate(a.timestamp).toLowerCase()
        const desc = getDescription(a).toLowerCase()
        const rep = (a.csr_id || '').toLowerCase()
        if (!rep.includes(q) && !date.includes(q) && !desc.includes(q)) return false
      }
      return true
    })
  }, [activities, timeFilter, search])

  return (
    <div className="flex h-full">
      <aside className="w-40 py-5 px-4 bg-surface border-r border-line-strong shrink-0">
        <div>
          <DateRangeSelect value={timeFilter} onChange={setTimeFilter} />
        </div>
      </aside>

      <section className="flex-1 p-5 px-6 overflow-auto">
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search activity by Rep Name, Date, or Description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-3 pr-9 border border-line-input rounded-md text-[13px] bg-surface text-brand outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(124,92,191,0.15)]"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
        </div>

        <h2 className="text-[15px] font-semibold text-brand mb-3">Activity Log</h2>

        {loading && <p className="text-[13px] text-muted py-3">Loading...</p>}
        {error && <p className="text-[13px] text-error py-3">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse bg-surface rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
            <thead>
              <tr className="bg-surface-alt border-b-2 border-line-header">
                <th className="text-left px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.4px] text-muted">Rep</th>
                <th className="text-left px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.4px] text-muted">Date</th>
                <th className="text-left px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.4px] text-muted">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3.5 py-2.5 text-[13px] text-center text-faint italic">
                    No activity found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a._id} className="group">
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">{a.csr_id}</td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">{formatDate(a.timestamp)}</td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">{getDescription(a)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
