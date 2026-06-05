import { useLocation, useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-[#99120f]/10 bg-white/95 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          {!isHome ? (
            <button
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#99120f] transition hover:bg-[#99120f]/5 dark:text-amber-400 dark:hover:bg-neutral-800 dark:hover:text-amber-300"
              aria-label="Volver atrás"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : (
            <div className="h-11 w-11" />
          )}
          <div className="flex items-center gap-1 leading-none">
            <span className="font-serif italic tracking-wide text-[#151418] dark:text-[#FBF5DD]"
              style={{ fontSize: '1.125rem', fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              Cervecería
            </span>
            <span className="font-bold tracking-tight"
              style={{ fontSize: '1.25rem', color: '#99120f', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Burgos
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-lg flex-1 px-4 py-4" tabIndex={-1}>
        {children}
      </main>

      <footer className="border-t border-[#99120f]/10 py-3 text-center text-xs text-[#99120f]/50 dark:border-neutral-700 dark:text-neutral-500">
        <span>CerveceriaBurgos Recetas — v1.1.0</span>
      </footer>
    </div>
  )
}
