export const tdClass = 'px-3.5 py-2.5 text-[13px] text-body border-b border-line group-last:border-b-0 group-hover:bg-surface-hover'

export default function DataTable({ title, cols, rows, empty, headerAction }) {
  return (
    <div className="mb-7">
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-2">
          {title && <h3 className="text-[13px] font-semibold text-brand">{title}</h3>}
          {headerAction}
        </div>
      )}
      <table className="w-full border-collapse bg-surface rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
        <thead>
          <tr className="bg-surface-alt border-b-2 border-line-header">
            {cols.map((c) => (
              <th key={c} className="text-left px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.4px] text-muted">
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
