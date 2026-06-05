import { useState, useEffect } from 'react'

const STORAGE_KEY = 'cb-theme'

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored === 'dark'
  return false
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem(STORAGE_KEY, 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem(STORAGE_KEY, 'light')
    }
  }, [isDark])

  const toggle = () => setIsDark((prev) => !prev)

  return { isDark, toggle }
}
