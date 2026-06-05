import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white py-3 pl-10 pr-12 text-[#151418] placeholder-neutral-400 outline-none ring-1 ring-[#99120f]/15 transition focus:ring-2 focus:ring-[#99120f] dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500 dark:ring-neutral-700 dark:focus:ring-amber-500"
        autoComplete="off"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-[#99120f]/5 hover:text-[#99120f] dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
