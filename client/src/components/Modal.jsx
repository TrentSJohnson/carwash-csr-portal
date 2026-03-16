export default function Modal({ title, onClose, onSubmit, saving, submitLabel = 'Save', children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-[14px] font-semibold text-body mb-4">{title}</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          {children}
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
              {saving ? 'Saving…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
