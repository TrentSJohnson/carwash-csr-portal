import { useState, useMemo } from 'react'
import { getTransactions } from '../services/api'
import DateRangeSelect from '../components/DateRangeSelect'
import SearchBar from '../components/SearchBar'
import StatusBadge from '../components/StatusBadge'
import DataTable, { tdClass } from '../components/DataTable'
import useStatusFilter from '../hooks/useStatusFilter'
import useFetch from '../hooks/useFetch'
import { formatDateTime, getDateThreshold } from '../utils/format'

const STATUS_FILTERS = [
  { id: 'all',     label: 'All Statuses' },
  { id: 'Pending', label: 'Pending'      },
  { id: 'Failed',  label: 'Failed'       },
  { id: 'Success', label: 'Success'      },
]

export default function TransactionsPage() {
  const { data: transactions, loading, error } = useFetch(getTransactions)
  const { selectedStatuses, toggleStatus } = useStatusFilter()
  const [dateRange, setDateRange]       = useState('all')
  const [search, setSearch]             = useState('')

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
                checked={selectedStatuses.has(id)}
                onChange={() => toggleStatus(id)}
                className="cursor-pointer accent-accent"
              />
              {label}
            </label>
          ))}
        </div>

        <DateRangeSelect value={dateRange} onChange={setDateRange} />
      </aside>

      <section className="flex-1 p-5 px-6 overflow-auto">
        <SearchBar value={search} onChange={setSearch} placeholder="Search transactions by ID, Member, or License Plate" />

        <h2 className="text-[15px] font-semibold text-brand mb-3">Transactions</h2>

        {loading && <p className="text-[13px] text-muted py-3">Loading...</p>}
        {error   && <p className="text-[13px] text-error py-3">{error}</p>}

        {!loading && !error && (

          <DataTable
            cols={['ID', 'Member', 'Vehicle', 'Plan', 'Amount', 'Status', 'Date']}
            empty="No transactions found."
            rows={filtered.map((t) => (
              <tr key={t._id ?? t.id} className="group">
                <td className={tdClass}>{t._id ?? t.id}</td>
                <td className={tdClass}>{t.member_id?.first_name} {t.member_id?.last_name}</td>
                <td className={tdClass}>{t.subscription_id?.vehicle_id?.license_plate}</td>
                <td className={tdClass}>{t.subscription_id?.plan_id?.plan_name}</td>
                <td className={tdClass}>{t.amount}</td>
                <td className={tdClass}><StatusBadge value={t.status} /></td>
                <td className={tdClass}>{formatDateTime(t.timestamp ?? t.createdAt)}</td>
              </tr>
            ))}
          />
        )}
      </section>
    </div>
  )
}
