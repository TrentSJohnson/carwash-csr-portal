export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative mb-5">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-2 pl-3 pr-9 border border-line-input rounded-md text-[13px] bg-surface text-brand outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(124,92,191,0.15)]"
      />
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
    </div>
  )
}
