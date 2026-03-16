export const STATUS_STYLES = {
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

export default function StatusBadge({ value }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[value] ?? 'bg-line text-muted'}`}>
      {value}
    </span>
  )
}
