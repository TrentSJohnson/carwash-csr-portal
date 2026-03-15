const DATE_RANGES = [
  { id: 'all', label: 'All Time' },
  { id: 'month', label: 'Current Month' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '24h', label: 'Last 24 Hrs' },
]

export { DATE_RANGES }

export default function DateRangeSelect({ value, onChange }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted mb-2.5">
        Date Range:
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[12px] border border-line-input rounded px-2 py-1 text-body bg-surface outline-none focus:border-accent"
      >
        {DATE_RANGES.map(({ id, label }) => (
          <option key={id} value={id}>{label}</option>
        ))}
      </select>
    </div>
  )
}
