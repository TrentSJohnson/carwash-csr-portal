import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMembers } from '../services/api'

const STATUS_FILTERS = [
  { id: 'all', label: 'All Statuses' },
  { id: 'Active', label: 'Active' },
  { id: 'Inactive', label: 'Inactive' },
  { id: 'Suspended', label: 'Suspended' },
]

const STATUS_STYLES = {
  Active:    'bg-status-success-bg text-status-success-text',
  Inactive:  'bg-status-pending-bg text-status-pending-text',
  Suspended: 'bg-status-failed-bg text-status-failed-text',
}

function formatDate(ts) {
  const d = new Date(ts)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day   = String(d.getDate()).padStart(2, '0')
  return `${month}/${day}`
}

export default function UsersPage() {
  const [members, setMembers]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [selectedStatuses, setSelectedStatuses] = useState(new Set(['all']))
  const [search, setSearch]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getMembers()
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function toggleStatus(id) {
    setSelectedStatuses((prev) => {
      const next = new Set(prev)
      if (id === 'all') return new Set(['all'])
      next.delete('all')
      if (next.has(id)) {
        next.delete(id)
        if (next.size === 0) return new Set(['all'])
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (!selectedStatuses.has('all') && !selectedStatuses.has(m.account_status)) return false
      if (search) {
        const q = search.toLowerCase()
        const name  = `${m.first_name} ${m.last_name}`.toLowerCase()
        const email = (m.email ?? '').toLowerCase()
        const phone = (m.phone ?? '').toLowerCase()
        if (!name.includes(q) && !email.includes(q) && !phone.includes(q)) return false
      }
      return true
    })
  }, [members, selectedStatuses, search])

  return (
    <div className="flex h-full">
      <aside className="w-40 py-5 px-4 bg-surface border-r border-line-strong shrink-0">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted mb-2.5">
            Filters (By Status)
          </p>
          {STATUS_FILTERS.map(({ id, label }) => (
            <label key={id} className="flex items-center gap-2 text-[13px] text-body mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={id === 'all' ? selectedStatuses.has('all') : selectedStatuses.has(id)}
                onChange={() => toggleStatus(id)}
                className="cursor-pointer accent-accent"
              />
              {label}
            </label>
          ))}
        </div>
      </aside>

      <section className="flex-1 p-5 px-6 overflow-auto">
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search users by name, email, or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-3 pr-9 border border-line-input rounded-md text-[13px] bg-surface text-brand outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(124,92,191,0.15)]"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
        </div>

        <h2 className="text-[15px] font-semibold text-brand mb-3">Users</h2>

        {loading && <p className="text-[13px] text-muted py-3">Loading...</p>}
        {error   && <p className="text-[13px] text-error py-3">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse bg-surface rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
            <thead>
              <tr className="bg-surface-alt border-b-2 border-line-header">
                {['Name', 'Email', 'Phone', 'Status', 'Since'].map((col) => (
                  <th key={col} className="text-left px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.4px] text-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3.5 py-2.5 text-[13px] text-center text-faint italic">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m._id} className="group cursor-pointer" onClick={() => navigate(`/users/${m._id}`)}>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {m.first_name} {m.last_name}
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {m.email}
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {m.phone ?? '—'}
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[m.account_status] ?? 'bg-line text-muted'}`}>
                        {m.account_status}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {formatDate(m.createdAt)}
                    </td>
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
