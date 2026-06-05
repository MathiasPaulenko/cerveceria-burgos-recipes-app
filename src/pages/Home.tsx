import { Link } from 'react-router-dom'
import { Wine, UtensilsCrossed } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col gap-5 pt-8">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
          Carta de recetas
        </p>
        <h2 className="mt-1 text-lg font-semibold text-[#151418] dark:text-white">
          ¿Qué necesitas consultar?
        </h2>
      </div>

      <Link
        to="/cocktails"
        className="group relative flex min-h-[180px] flex-col items-start justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-[#99120f]/90 via-[#99120f] to-[#99120f]/80 p-6 shadow-lg shadow-[#99120f]/20 ring-1 ring-[#99120f]/30 transition hover:shadow-[#99120f]/30 hover:ring-[#99120f]/40 active:scale-[0.98] dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 dark:shadow-indigo-950/30 dark:ring-white/5 dark:hover:shadow-indigo-900/40 dark:hover:ring-white/10"
        aria-label="Ver catálogo de cócteles"
      >
        <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 dark:opacity-10">
          <Wine className="h-40 w-40 text-white dark:text-indigo-300" aria-hidden="true" strokeWidth={0.5} />
        </div>
        <Wine className="mb-4 h-10 w-10 text-white dark:text-indigo-300" aria-hidden="true" strokeWidth={1.5} />
        <h3 className="text-2xl font-bold text-white dark:text-white">Cócteles</h3>
        <p className="mt-1 text-sm text-white/70 dark:text-indigo-200/70">Recetas de bebidas y cócteles</p>
      </Link>

      <Link
        to="/foods"
        className="group relative flex min-h-[180px] flex-col items-start justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-[#99120f]/70 via-[#99120f]/90 to-[#99120f]/60 p-6 shadow-lg shadow-[#99120f]/15 ring-1 ring-[#99120f]/20 transition hover:shadow-[#99120f]/25 hover:ring-[#99120f]/30 active:scale-[0.98] dark:from-neutral-900 dark:via-emerald-950 dark:to-neutral-900 dark:shadow-emerald-950/30 dark:ring-white/5 dark:hover:shadow-emerald-900/40 dark:hover:ring-white/10"
        aria-label="Ver catálogo de comida y tapas"
      >
        <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 dark:opacity-10">
          <UtensilsCrossed className="h-40 w-40 text-white dark:text-emerald-300" aria-hidden="true" strokeWidth={0.5} />
        </div>
        <UtensilsCrossed className="mb-4 h-10 w-10 text-white dark:text-emerald-300" aria-hidden="true" strokeWidth={1.5} />
        <h3 className="text-2xl font-bold text-white dark:text-white">Comida y Tapas</h3>
        <p className="mt-1 text-sm text-white/70 dark:text-emerald-200/70">Recetas de cocina y tapas</p>
      </Link>
    </div>
  )
}
