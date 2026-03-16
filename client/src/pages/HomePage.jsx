import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMembers, getActivities, getTransactions } from '../services/api'

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

function getDescription(activity) {
  return activity.notes
    ? `${activity.action_taken}: ${activity.notes}`
    : activity.action_taken
}

export default function HomePage() {
  const [members, setMembers] = useState([])
  const [activities, setActivities] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getMembers(), getActivities(), getTransactions()])
      .then(([m, a, t]) => {
        setMembers(Array.isArray(m) ? m : [])
        setActivities(Array.isArray(a) ? a : [])
        setTransactions(Array.isArray(t) ? t : [])
      })
      .finally(() => setLoading(false))
  }, [])

  const overdueCount = useMemo(
    () => transactions.filter((t) => t.status === 'Failed' || t.status === 'Pending').length,
    [transactions]
  )

  const activeCount = useMemo(
    () => members.filter((m) => m.account_status === 'Active').length,
    [members]
  )

  const recentActivities = useMemo(() => activities.slice(0, 10), [activities])

  const statCards = [
    {
      label: 'Find Users',
      value: members.length,
      sub: `${activeCount} active`,
      icon: '👤',
      onClick: () => navigate('/users'),
    },
    {
      label: 'Activity',
      value: activities.length,
      sub: 'total entries',
      icon: '📈',
      onClick: () => navigate('/activity'),
    },
    {
      label: 'See Overdue',
      value: overdueCount,
      sub: 'pending / failed',
      icon: '⚠️',
      onClick: () => navigate('/transactions'),
    },
    {
      label: 'Transactions',
      value: transactions.length,
      sub: 'all time',
      icon: '💳',
      onClick: () => navigate('/transactions'),
    },
  ]

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <button
            key={card.label}
            onClick={card.onClick}
            className="bg-surface border border-line rounded-lg p-4 text-left hover:border-accent hover:shadow-[0_0_0_2px_rgba(124,92,191,0.1)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{card.icon}</span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.4px] text-muted">
                {card.label}
              </span>
            </div>
            {loading ? (
              <div className="text-[22px] font-bold text-brand">—</div>
            ) : (
              <div className="text-[22px] font-bold text-brand">{card.value}</div>
            )}
            <div className="text-[11px] text-faint mt-0.5">{card.sub}</div>
          </button>
        ))}
      </div>

      <h2 className="text-[15px] font-semibold text-brand mb-3">Recent Activity</h2>

      {loading && <p className="text-[13px] text-muted py-3">Loading...</p>}

      {!loading && (
        <table className="w-full border-collapse bg-surface rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
          <thead>
            <tr className="bg-surface-alt border-b-2 border-line-header">
              {['Rep', 'Name', 'Action', 'Time', 'Status'].map((col) => (
                <th
                  key={col}
                  className="text-left px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.4px] text-muted"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentActivities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3.5 py-2.5 text-[13px] text-center text-faint italic">
                  No recent activity.
                </td>
              </tr>
            ) : (
              recentActivities.map((a) => (
                <tr
                  key={a._id}
                  className="group cursor-pointer"
                  onClick={() => a.member_id && navigate(`/users/${a.member_id._id ?? a.member_id}`)}
                >
                  <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                    {a.csr_id}
                  </td>
                  <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                    {a.member_id?.first_name || a.member_id?.last_name
                      ? `${a.member_id.first_name ?? ''} ${a.member_id.last_name ?? ''}`.trim()
                      : '—'}
                  </td>
                  <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                    {getDescription(a)}
                  </td>
                  <td className="px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                    {formatDate(a.timestamp)}
                  </td>
                  <td className="px-3.5 py-2.5 text-[13px] border-b border-line group-last:border-b-0 group-hover:bg-surface-hover">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-success-bg text-status-success-text">
                      Logged
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
