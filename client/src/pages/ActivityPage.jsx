import { useState, useEffect, useMemo } from 'react'
import { getActivities } from '../services/api'
import DateRangeSelect from '../components/DateRangeSelect'
import SearchBar from '../components/SearchBar'
import DataTable, { tdClass } from '../components/DataTable'
import { formatDate, getDateThreshold } from '../utils/format'

function getDescription(activity) {
  return activity.notes
    ? `${activity.action_taken}: ${activity.notes}`
    : activity.action_taken
}

export default function ActivityPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [timeFilter, setTimeFilter] = useState('all')
  const [search, setSearch]         = useState('')

  useEffect(() => {
    getActivities()
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const threshold = getDateThreshold(timeFilter)
    return activities.filter((a) => {
      if (threshold && new Date(a.timestamp) < threshold) return false
      if (search) {
        const q    = search.toLowerCase()
        const date = formatDate(a.timestamp).toLowerCase()
        const desc = getDescription(a).toLowerCase()
        const rep  = (a.csr_id || '').toLowerCase()
        if (!rep.includes(q) && !date.includes(q) && !desc.includes(q)) return false
      }
      return true
    })
  }, [activities, timeFilter, search])

  return (
    <div className="flex h-full">
      <aside className="w-40 py-5 px-4 bg-surface border-r border-line-strong shrink-0">
        <DateRangeSelect value={timeFilter} onChange={setTimeFilter} />
      </aside>

      <section className="flex-1 p-5 px-6 overflow-auto">
        <SearchBar value={search} onChange={setSearch} placeholder="Search activity by Rep Name, Date, or Description" />

        <h2 className="text-[15px] font-semibold text-brand mb-3">Activity Log</h2>

        {loading && <p className="text-[13px] text-muted py-3">Loading...</p>}
        {error   && <p className="text-[13px] text-error py-3">{error}</p>}

        {!loading && !error && (
          <DataTable
            cols={['Rep', 'Date', 'Description']}
            empty="No activity found."
            rows={filtered.map((a) => (
              <tr key={a._id} className="group">
                <td className={tdClass}>{a.csr_id}</td>
                <td className={tdClass}>{formatDate(a.timestamp)}</td>
                <td className={tdClass}>{getDescription(a)}</td>
              </tr>
            ))}
          />
        )}
      </section>
    </div>
  )
}
