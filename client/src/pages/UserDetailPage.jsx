import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getMember,
  getMemberVehicles,
  getMemberSubscriptions,
  getMemberTransactions,
  getMemberActivities,
  updateVehicle,
  deleteVehicle,
} from '../services/api'

const STATUS_STYLES = {
  Active:    'bg-status-success-bg text-status-success-text',
  Inactive:  'bg-status-pending-bg text-status-pending-text',
  Suspended: 'bg-status-failed-bg text-status-failed-text',
  Paused:    'bg-status-pending-bg text-status-pending-text',
  Overdue:   'bg-status-failed-bg text-status-failed-text',
  Canceled:  'bg-line text-muted',
  Success:   'bg-status-success-bg text-status-success-text',
  Failed:    'bg-status-failed-bg text-status-failed-text',
  Pending:   'bg-status-pending-bg text-status-pending-text',
}

function StatusBadge({ value }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[value] ?? 'bg-line text-muted'}`}>
      {value}
    </span>
  )
}

function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function SectionTable({ title, cols, rows, empty }) {
  return (
    <div className="mb-7">
      <h3 className="text-[13px] font-semibold text-brand mb-2">{title}</h3>
      <table className="w-full border-collapse bg-surface rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
        <thead>
          <tr className="bg-surface-alt border-b-2 border-line-header">
            {cols.map((c) => (
              <th key={c} className="text-left px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.4px] text-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={cols.length} className="px-3.5 py-2.5 text-[13px] text-center text-faint italic">
                {empty}
              </td>
            </tr>
          ) : rows}
        </tbody>
      </table>
    </div>
  )
}

const tdClass = 'px-3.5 py-2 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover'

function EditVehicleModal({ vehicle, onClose, onSaved }) {
  const [form, setForm] = useState({
    make_model:    vehicle.make_model    ?? '',
    license_plate: vehicle.license_plate ?? '',
    state:         vehicle.state         ?? '',
    rfid_tag_id:   vehicle.rfid_tag_id   ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState(null)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErr(null)
    try {
      const updated = await updateVehicle(vehicle._id, form)
      onSaved(updated)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-[14px] font-semibold text-body mb-4">Edit Vehicle</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {[
            { label: 'Make / Model', name: 'make_model' },
            { label: 'License Plate', name: 'license_plate' },
            { label: 'State', name: 'state' },
            { label: 'RFID Tag ID', name: 'rfid_tag_id' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-[11px] text-muted mb-0.5">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border border-line rounded-md px-3 py-1.5 text-[13px] text-body bg-surface focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          ))}
          {err && <p className="text-[12px] text-error">{err}</p>}
          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-[12px] rounded-md border border-line text-muted hover:bg-surface-alt"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 text-[12px] rounded-md bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [member, setMember]               = useState(null)
  const [vehicles, setVehicles]           = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [transactions, setTransactions]   = useState([])
  const [activities, setActivities]       = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  const [editingVehicle, setEditingVehicle] = useState(null)

  function refreshActivities() {
    getMemberActivities(id).then(setActivities).catch(() => {})
  }

  useEffect(() => {
    Promise.all([
      getMember(id),
      getMemberVehicles(id),
      getMemberSubscriptions(id),
      getMemberTransactions(id),
      getMemberActivities(id),
    ])
      .then(([m, v, s, t, a]) => {
        setMember(m)
        setVehicles(v)
        setSubscriptions(s)
        setTransactions(t)
        setActivities(a)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDeleteVehicle(vehicle) {
    if (!window.confirm(`Delete ${vehicle.make_model ?? vehicle.license_plate}?`)) return
    await deleteVehicle(vehicle._id)
    setVehicles((prev) => prev.filter((v) => v._id !== vehicle._id))
    refreshActivities()
  }

  function handleVehicleSaved(updated) {
    setVehicles((prev) => prev.map((v) => (v._id === updated._id ? updated : v)))
    setEditingVehicle(null)
    refreshActivities()
  }

  // Build a vehicle_id → subscription map for the vehicles table
  const subByVehicle = Object.fromEntries(
    subscriptions.map((s) => [s.vehicle_id?._id ?? s.vehicle_id, s])
  )

  if (loading) return <p className="p-6 text-[13px] text-muted">Loading...</p>
  if (error)   return <p className="p-6 text-[13px] text-error">{error}</p>
  if (!member) return null

  return (
    <div className="flex h-full">
      {/* Left panel — account info */}
      <aside className="w-52 py-5 px-4 bg-surface border-r border-line-strong shrink-0 flex flex-col gap-4">
        <button
          onClick={() => navigate('/users')}
          className="text-[12px] text-accent hover:underline self-start"
        >
          ← Back to Users
        </button>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted mb-3">
            Account Info
          </p>

          {[
            { label: 'First Name', value: member.first_name },
            { label: 'Last Name',  value: member.last_name  },
            { label: 'Email',      value: member.email      },
            { label: 'Phone',      value: member.phone ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="mb-3">
              <p className="text-[11px] text-muted mb-0.5">{label}</p>
              <p className="text-[13px] text-body break-all">{value}</p>
            </div>
          ))}

          <div>
            <p className="text-[11px] text-muted mb-1">Status</p>
            <StatusBadge value={member.account_status} />
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-[11px] text-faint">Member since {formatDate(member.createdAt)}</p>
        </div>
      </aside>

      {editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSaved={handleVehicleSaved}
        />
      )}

      {/* Right panel — tables */}
      <section className="flex-1 p-6 overflow-auto">
        <SectionTable
          title="Vehicles"
          cols={['Vehicle', 'License #', 'State', 'Plan', 'Sub Status', '']}
          empty="No vehicles on file."
          rows={vehicles.map((v) => {
            const sub = subByVehicle[v._id]
            return (
              <tr key={v._id} className="group">
                <td className={tdClass}>{v.make_model ?? '—'}</td>
                <td className={tdClass}>{v.license_plate}</td>
                <td className={tdClass}>{v.state ?? '—'}</td>
                <td className={tdClass}>{sub?.plan_id?.plan_name ?? '—'}</td>
                <td className={tdClass}>
                  {sub ? <StatusBadge value={sub.status} /> : '—'}
                </td>
                <td className={`${tdClass} w-16`}>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingVehicle(v)}
                      title="Edit vehicle"
                      className="text-accent hover:text-accent/70"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-9 9A2 2 0 016 16H4a1 1 0 01-1-1v-2a2 2 0 01.586-1.414l9-9z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(v)}
                      title="Delete vehicle"
                      className="text-error hover:text-error/70"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        />

        <SectionTable
          title="Transactions"
          cols={['Amount', 'Date', 'Status']}
          empty="No transactions found."
          rows={transactions.map((t) => (
            <tr key={t._id} className="group">
              <td className={tdClass}>${t.amount?.toFixed(2)}</td>
              <td className={tdClass}>{formatDate(t.timestamp)}</td>
              <td className={tdClass}><StatusBadge value={t.status} /></td>
            </tr>
          ))}
        />

        <SectionTable
          title="Activity"
          cols={['Action', 'Date', 'CSR Rep', 'Notes']}
          empty="No activity on record."
          rows={activities.map((a) => (
            <tr key={a._id} className="group">
              <td className={tdClass}>{a.action_taken}</td>
              <td className={tdClass}>{formatDate(a.timestamp)}</td>
              <td className={tdClass}>{a.csr_id ?? '—'}</td>
              <td className={tdClass}>{a.notes ?? '—'}</td>
            </tr>
          ))}
        />
      </section>
    </div>
  )
}
