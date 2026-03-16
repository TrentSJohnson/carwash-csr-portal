import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getMembers, createMember } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import FormField, { inputClass } from '../components/FormField'
import DataTable, { tdClass } from '../components/DataTable'
import useStatusFilter from '../hooks/useStatusFilter'
import { formatDate } from '../utils/format'

const STATUS_FILTERS = [
  { id: 'all',       label: 'All Statuses' },
  { id: 'Active',    label: 'Active'       },
  { id: 'Inactive',  label: 'Inactive'     },
  { id: 'Suspended', label: 'Suspended'    },
]

function AddUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', account_status: 'Active',
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
      const created = await createMember(form)
      onCreated(created)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Add User" onClose={onClose} onSubmit={handleSubmit} saving={saving} submitLabel="Add User">
      {[
        { label: 'First Name', name: 'first_name' },
        { label: 'Last Name',  name: 'last_name'  },
        { label: 'Email',      name: 'email'      },
        { label: 'Phone',      name: 'phone'      },
      ].map(({ label, name }) => (
        <FormField key={name} label={label} name={name} value={form[name]} onChange={handleChange} />
      ))}
      <FormField label="Status" name="account_status">
        <select
          name="account_status"
          value={form.account_status}
          onChange={handleChange}
          className={inputClass}
        >
          {['Active', 'Inactive', 'Suspended'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </FormField>
      {err && <p className="text-[12px] text-error">{err}</p>}
    </Modal>
  )
}

export default function UsersPage() {
  const [members, setMembers]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const { selectedStatuses, toggleStatus } = useStatusFilter()
  const [searchParams] = useSearchParams()
  const [search, setSearch]     = useState(searchParams.get('q') ?? '')
  const [showAdd, setShowAdd]   = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getMembers()
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

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

  function handleCreated(member) {
    setMembers((prev) => [...prev, member])
    setShowAdd(false)
    navigate(`/users/${member._id}`)
  }

  return (
    <div className="flex h-full">
      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onCreated={handleCreated} />}

      <aside className="w-40 py-5 px-4 bg-surface border-r border-line-strong shrink-0">
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

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-brand">Users</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="px-3 py-1.5 text-[12px] rounded-md bg-accent text-white hover:bg-accent/90"
          >
            + Add User
          </button>
        </div>

        {loading && <p className="text-[13px] text-muted py-3">Loading...</p>}
        {error   && <p className="text-[13px] text-error py-3">{error}</p>}

        {!loading && !error && (
          <DataTable
            cols={['Name', 'Email', 'Phone', 'Status', 'Since']}
            empty="No users found."
            rows={filtered.map((m) => (
              <tr key={m._id} className="group cursor-pointer" onClick={() => navigate(`/users/${m._id}`)}>
                <td className={tdClass}>{m.first_name} {m.last_name}</td>
                <td className={tdClass}>{m.email}</td>
                <td className={tdClass}>{m.phone ?? '—'}</td>
                <td className={tdClass}><StatusBadge value={m.account_status} /></td>
                <td className={tdClass}>{formatDate(m.createdAt)}</td>
              </tr>
            ))}
          />
        )}
      </section>
    </div>
  )
}
