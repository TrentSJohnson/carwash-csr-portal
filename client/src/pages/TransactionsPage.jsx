import { useState, useEffect, useMemo } from 'react'
import { getTransactions } from '../services/api'
import DateRangeSelect from '../components/DateRangeSelect'
import SearchBar from '../components/SearchBar'

const STATUS_FILTERS = [
  { id: 'all', label: 'All Statuses' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Failed', label: 'Failed' },
  { id: 'Success', label: 'Success' },
]

const STATUS_STYLES = {
  Failed:  'bg-status-failed-bg text-status-failed-text',
  Success: 'bg-status-success-bg text-status-success-text',
  Pending: 'bg-status-pending-bg text-status-pending-text',
}

function formatDate(ts) {
  const d = new Date(ts)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day   = String(d.getDate()).padStart(2, '0')
  return `${month}/${day}`
}

function getDateThreshold(rangeId) {
  const now = new Date()
  if (rangeId === '24h') return new Date(now - 24 * 60 * 60 * 1000)
  if (rangeId === '7d')  return new Date(now - 7 * 24 * 60 * 60 * 1000)
  if (rangeId === 'month') return new Date(now.getFullYear(), now.getMonth(), 1)
  return null
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [selectedStatuses, setSelectedStatuses] = useState(new Set(['all']))
  const [dateRange, setDateRange]       = useState('all')
  const [search, setSearch]             = useState('')

  useEffect(() => {
    getTransactions()
      .then((data) => setTransactions(Array.isArray(data) ? data : []))
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
    const threshold = getDateThreshold(dateRange)
    return transactions.filter((t) => {
      if (threshold && new Date(t.timestamp ?? t.createdAt) < threshold) return false
      if (!selectedStatuses.has('all') && !selectedStatuses.has(t.status)) return false
      if (search) {
        const q      = search.toLowerCase()
        const id     = String(t._id ?? t.id ?? '').toLowerCase()
        const member = `${t.member_id?.first_name ?? ''} ${t.member_id?.last_name ?? ''}`.toLowerCase()
        const plate  = (t.subscription_id?.vehicle_id?.license_plate ?? '').toLowerCase()
        if (!id.includes(q) && !member.includes(q) && !plate.includes(q)) return false
      }
      return true
    })
  }, [transactions, selectedStatuses, dateRange, search])

  return (
    <div className="flex h-full">
      <aside className="w-40 py-5 px-4 bg-surface border-r border-line-strong shrink-0">
        <div className="mb-5">
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

        <div>
          <DateRangeSelect value={dateRange} onChange={setDateRange} />
        </div>
      </aside>

      <section className="flex-1 p-5 px-6 overflow-auto">
        <SearchBar value={search} onChange={setSearch} placeholder="Search transactions by ID, Member, or License Plate" />

        <h2 className="text-[15px] font-semibold text-brand mb-3">Transactions</h2>

        {loading && <p className="text-[13px] text-muted py-3">Loading...</p>}
        {error   && <p className="text-[13px] text-error py-3">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse bg-surface rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
            <thead>
              <tr className="bg-surface-alt border-b-2 border-line-header">
                {['ID', 'Member', 'Vehicle', 'Plan', 'Amount', 'Status', 'Date'].map((col) => (
                  <th key={col} className="text-left px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.4px] text-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3.5 py-2.5 text-[13px] text-center text-faint italic">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t._id ?? t.id} className="group">
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {t._id ?? t.id}
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {t.member_id?.first_name} {t.member_id?.last_name}
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {t.subscription_id?.vehicle_id?.license_plate}
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {t.subscription_id?.plan_id?.plan_name}
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {t.amount}
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[t.status] ?? 'bg-line text-muted'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                      {formatDate(t.timestamp ?? t.createdAt)}
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
