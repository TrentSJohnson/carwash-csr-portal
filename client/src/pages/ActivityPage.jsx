import { useState, useEffect, useMemo } from 'react'
import { getActivities } from '../services/api'
import './ActivityPage.css'

const TIME_FILTERS = [
  { id: '24h', label: 'Last 24 Hrs' },
  { id: '7d', label: 'Last 7 Days' },
  { id: 'month', label: 'Current Month' },
]

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

function getTimeThreshold(filterId) {
  const now = new Date()
  if (filterId === '24h') {
    return new Date(now - 24 * 60 * 60 * 1000)
  }
  if (filterId === '7d') {
    return new Date(now - 7 * 24 * 60 * 60 * 1000)
  }
  if (filterId === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }
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
  const [timeFilter, setTimeFilter] = useState('7d')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getActivities()
      .then(setActivities)
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
    <div className="activity-page">
      <aside className="activity-sidebar">
        <div className="filter-group">
          <p className="filter-title">Filters (By Time)</p>
          {TIME_FILTERS.map(({ id, label }) => (
            <label key={id} className="filter-option">
              <input
                type="checkbox"
                checked={timeFilter === id}
                onChange={() => setTimeFilter(id)}
              />
              {label}
            </label>
          ))}
        </div>
      </aside>

      <section className="activity-content">
        <div className="activity-search">
          <input
            type="text"
            placeholder="Search activity by Rep Name, Date, or Description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <h2 className="activity-log-title">Activity Log</h2>

        {loading && <p className="activity-status">Loading...</p>}
        {error && <p className="activity-status activity-status--error">{error}</p>}

        {!loading && !error && (
          <table className="activity-table">
            <thead>
              <tr>
                <th>Rep</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="activity-empty">No activity found.</td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a._id}>
                    <td>{a.csr_id}</td>
                    <td>{formatDate(a.timestamp)}</td>
                    <td>{getDescription(a)}</td>
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
