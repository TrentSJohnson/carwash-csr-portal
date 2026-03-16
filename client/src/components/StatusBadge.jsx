import { STATUS_STYLES } from '../utils/statusStyles'

export default function StatusBadge({ value }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[value] ?? 'bg-line text-muted'}`}>
      {value}
    </span>
  )
}
