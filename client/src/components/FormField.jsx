import { inputClass } from '../utils/formStyles'

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

