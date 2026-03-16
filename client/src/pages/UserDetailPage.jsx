import { useState, useEffect } from 'react'
import useFormModal from '../hooks/useFormModal'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getMember,
  getMemberVehicles,
  getMemberSubscriptions,
  getMemberTransactions,
  getMemberActivities,
  updateMember,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getPlans,
  updateSubscription,
} from '../services/api'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import FormField, { inputClass } from '../components/FormField'
import DataTable, { tdClass } from '../components/DataTable'
import { formatDate, formatDateTime } from '../utils/format'

function EditMemberModal({ member, onClose, onSaved }) {
  const { form, saving, err, handleChange, handleSubmit } = useFormModal(
    {
      first_name:     member.first_name     ?? '',
      last_name:      member.last_name      ?? '',
      email:          member.email          ?? '',
      phone:          member.phone          ?? '',
      account_status: member.account_status ?? 'Active',
    },
    async (form) => { onSaved(await updateMember(member._id, form)) },
  )

  return (
    <Modal title="Edit Member Info" onClose={onClose} onSubmit={handleSubmit} saving={saving}>
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

function AddVehicleModal({ memberId, onClose, onSaved }) {
  const { form, saving, err, handleChange, handleSubmit } = useFormModal(
    { make_model: '', license_plate: '', state: '', rfid_tag_id: '' },
    async (form) => { onSaved(await createVehicle({ ...form, member_id: memberId })) },
  )

  return (
    <Modal title="Add Vehicle" onClose={onClose} onSubmit={handleSubmit} saving={saving} submitLabel="Add Vehicle">
      {[
        { label: 'Make / Model',  name: 'make_model'    },
        { label: 'License Plate', name: 'license_plate', required: true },
        { label: 'State',         name: 'state'          },
        { label: 'RFID Tag ID',   name: 'rfid_tag_id'    },
      ].map(({ label, name, required }) => (
        <FormField key={name} label={label} name={name} value={form[name]} onChange={handleChange} required={required} />
      ))}
      {err && <p className="text-[12px] text-error">{err}</p>}
    </Modal>
  )
}

function EditVehicleModal({ vehicle, subscription, plans, onClose, onSaved }) {
  const { form, saving, err, handleChange, handleSubmit } = useFormModal(
    {
      make_model:    vehicle.make_model    ?? '',
      license_plate: vehicle.license_plate ?? '',
      state:         vehicle.state         ?? '',
      rfid_tag_id:   vehicle.rfid_tag_id   ?? '',
      plan_id:       subscription?.plan_id?._id ?? subscription?.plan_id ?? '',
      sub_status:    subscription?.status ?? '',
    },
    async (form) => {
      const { plan_id, sub_status, ...vehicleFields } = form
      const updatedVehicle = await updateVehicle(vehicle._id, vehicleFields)

      let updatedSub = subscription
      if (subscription) {
        const subChanges = {}
        if (plan_id && plan_id !== (subscription.plan_id?._id ?? subscription.plan_id)) subChanges.plan_id = plan_id
        if (sub_status && sub_status !== subscription.status) subChanges.status = sub_status
        if (Object.keys(subChanges).length > 0) {
          updatedSub = await updateSubscription(subscription._id, subChanges)
        }
      }

      onSaved(updatedVehicle, updatedSub)
    },
  )

  return (

    <Modal title="Edit Vehicle" onClose={onClose} onSubmit={handleSubmit} saving={saving}>
      {[
        { label: 'Make / Model', name: 'make_model' },
        { label: 'License Plate', name: 'license_plate' },
        { label: 'State', name: 'state' },
        { label: 'RFID Tag ID', name: 'rfid_tag_id' },
      ].map(({ label, name }) => (
        <FormField key={name} label={label} name={name} value={form[name]} onChange={handleChange} />
      ))}
      {subscription && plans.length > 0 && (
        <FormField label="Plan" name="plan_id">
          <select name="plan_id" value={form.plan_id} onChange={handleChange} className={inputClass}>
            {plans.map((p) => (
              <option key={p._id} value={p._id}>{p.plan_name}</option>
            ))}
          </select>
        </FormField>
      )}
      {subscription && (
        <FormField label="Subscription Status" name="sub_status">
          <select name="sub_status" value={form.sub_status} onChange={handleChange} className={inputClass}>
            {['Active', 'Paused', 'Overdue', 'Canceled'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>
      )}
      {err && <p className="text-[12px] text-error">{err}</p>}
    </Modal>
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
  const [plans, setPlans]                 = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  const [editingVehicle, setEditingVehicle] = useState(null)
  const [addingVehicle, setAddingVehicle]   = useState(false)
  const [editingMember, setEditingMember]   = useState(false)

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
      getPlans(),
    ])
      .then(([m, v, s, t, a, p]) => {
        setMember(m)
        setVehicles(v)
        setSubscriptions(s)
        setTransactions(t)
        setActivities(a)
        setPlans(p)
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

  function handleMemberSaved(updated) {
    setMember(updated)
    setEditingMember(false)
    refreshActivities()
  }

  function handleVehicleAdded(newVehicle) {
    setVehicles((prev) => [...prev, newVehicle])
    setAddingVehicle(false)
    refreshActivities()
  }

  function handleVehicleSaved(updatedVehicle, updatedSub) {
    setVehicles((prev) => prev.map((v) => (v._id === updatedVehicle._id ? updatedVehicle : v)))
    if (updatedSub) {
      getMemberSubscriptions(id).then(setSubscriptions).catch(() => {})
    }
    setEditingVehicle(null)
    refreshActivities()
  }

  const subByVehicle = Object.fromEntries(
    subscriptions.map((s) => [s.vehicle_id?._id ?? s.vehicle_id, s])
  )

  if (loading) return <p className="p-6 text-[13px] text-muted">Loading...</p>
  if (error)   return <p className="p-6 text-[13px] text-error">{error}</p>
  if (!member) return null

  return (
    <div className="flex h-full">
      <aside className="w-52 py-5 px-4 bg-surface border-r border-line-strong shrink-0 flex flex-col gap-4">
        <button
          onClick={() => navigate('/users')}
          className="text-[12px] text-accent hover:underline self-start"
        >
          ← Back to Users
        </button>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted">
              Account Info
            </p>
            <button
              onClick={() => setEditingMember(true)}
              title="Edit member info"
              className="text-accent hover:text-accent/70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-9 9A2 2 0 016 16H4a1 1 0 01-1-1v-2a2 2 0 01.586-1.414l9-9z" />
              </svg>
            </button>
          </div>

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

      {editingMember && (
        <EditMemberModal
          member={member}
          onClose={() => setEditingMember(false)}
          onSaved={handleMemberSaved}
        />
      )}

      {addingVehicle && (
        <AddVehicleModal
          memberId={id}
          onClose={() => setAddingVehicle(false)}
          onSaved={handleVehicleAdded}
        />
      )}

      {editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          subscription={subByVehicle[editingVehicle._id]}
          plans={plans}
          onClose={() => setEditingVehicle(null)}
          onSaved={handleVehicleSaved}
        />
      )}

      <section className="flex-1 p-6 overflow-auto">
        <DataTable
          title="Vehicles"
          cols={['Vehicle', 'License #', 'State', 'RFID', 'Plan', 'Sub Status', '']}
          empty="No vehicles on file."
          headerAction={
            <button
              onClick={() => setAddingVehicle(true)}
              className="text-[12px] text-accent hover:underline"
            >
              + Add Vehicle
            </button>
          }
          rows={vehicles.map((v) => {
            const sub = subByVehicle[v._id]
            return (
              <tr key={v._id} className="group">
                <td className={tdClass}>{v.make_model ?? '—'}</td>
                <td className={tdClass}>{v.license_plate}</td>
                <td className={tdClass}>{v.state ?? '—'}</td>
                <td className={tdClass}>{v.rfid_tag_id ?? '—'}</td>
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

        <DataTable
          title="Transactions"
          cols={['Amount', 'Date', 'Status']}
          empty="No transactions found."
          rows={transactions.map((t) => (
            <tr key={t._id} className="group">
              <td className={tdClass}>${t.amount?.toFixed(2)}</td>
              <td className={tdClass}>{formatDateTime(t.timestamp)}</td>
              <td className={tdClass}><StatusBadge value={t.status} /></td>
            </tr>
          ))}
        />

        <DataTable
          title="Activity"
          cols={['Action', 'Date', 'CSR Rep', 'Notes']}
          empty="No activity on record."
          rows={activities.map((a) => (
            <tr key={a._id} className="group">
              <td className={tdClass}>{a.action_taken}</td>
              <td className={tdClass}>{formatDateTime(a.timestamp)}</td>
              <td className={tdClass}>{a.csr_id ?? '—'}</td>
              <td className={tdClass}>{a.notes ?? '—'}</td>
            </tr>
          ))}
        />
      </section>
    </div>
  )
}
