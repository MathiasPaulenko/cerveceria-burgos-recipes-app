import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface CategoryFilterProps {
  categories: string[]
  selected: string | null
  onSelect: (category: string | null) => void
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const allActive = selected === null
  const label = allActive ? 'Filtrar por categoría' : selected

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  const handleSelect = (cat: string | null) => {
    onSelect(cat)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full min-h-[48px] items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
          open || !allActive
            ? 'border-[#99120f]/40 bg-white text-[#99120f] dark:border-amber-500/40 dark:bg-neutral-900 dark:text-amber-400'
            : 'border-[#99120f]/10 bg-white text-[#151418] hover:border-[#99120f]/30 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600'
        }`}
      >
        <span className="truncate">{label}</span>
        <ChevronDown className={`ml-3 h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#99120f]/10 bg-white shadow-lg animate-fade-in dark:border-neutral-700 dark:bg-neutral-800">
          <div className="max-h-64 overflow-y-auto p-1.5">
            <button
              onClick={() => handleSelect(null)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                allActive
                  ? 'bg-[#99120f]/10 font-semibold text-[#99120f] dark:bg-amber-500/10 dark:text-amber-400'
                  : 'text-[#151418] hover:bg-[#FBF5DD] dark:text-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <span>Todas las categorías</span>
              {allActive && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
            </button>
            <div className="my-1 border-t border-[#99120f]/10 dark:border-neutral-700" />
            {categories.map((cat) => {
              const isActive = selected === cat
              return (
                <button
                  key={cat}
                  onClick={() => handleSelect(isActive ? null : cat)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-[#99120f]/10 font-semibold text-[#99120f] dark:bg-amber-500/10 dark:text-amber-400'
                      : 'text-[#151418] hover:bg-[#FBF5DD] dark:text-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
