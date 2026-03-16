const inputClass = 'w-full border border-line rounded-md px-3 py-1.5 text-[13px] text-body bg-surface focus:outline-none focus:ring-1 focus:ring-accent'

export default function FormField({ label, name, value, onChange, required, type = 'text', children }) {
  return (
    <div>
      <label className="block text-[11px] text-muted mb-0.5">
        {label}{required && ' *'}
      </label>
      {children ?? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClass}
        />
      )}
    </div>
  )
}

export { inputClass }
