import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="flex h-11 w-11 items-center justify-center rounded-xl transition hover:bg-neutral-800 dark:hover:bg-neutral-800"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5 text-[#99120f]" aria-hidden="true" />
      )}
    </button>
  )
}
