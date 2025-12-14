'use client'

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useCallback,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/** Listeners for theme changes */
const listeners = new Set<() => void>()

/**
 * Reads theme from localStorage or system preference.
 * @returns Current theme value.
 */
function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored) return stored
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

/**
 * Server-side snapshot always returns 'light'.
 * @returns Default theme for SSR.
 */
function getServerSnapshot(): Theme {
  return 'light'
}

/**
 * Subscribe to theme changes.
 * @param callback - Function to call when theme changes.
 * @returns Cleanup function.
 */
function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

/**
 * Updates the theme and notifies all listeners.
 * @param newTheme - The new theme to set.
 */
function setThemeValue(newTheme: Theme): void {
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
  listeners.forEach((listener) => listener())
}

/**
 * ThemeProvider manages the application's color theme state.
 * Uses useSyncExternalStore for SSR-safe hydration.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot)

  // Initialize data-theme attribute on first client render
  if (typeof window !== 'undefined') {
    const currentAttr = document.documentElement.getAttribute('data-theme')
    if (!currentAttr) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeValue(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const current = getThemeSnapshot()
    setThemeValue(current === 'light' ? 'dark' : 'light')
  }, [])

  return (
    <ThemeContext value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext>
  )
}

/**
 * Hook to access theme context.
 * @returns Current theme and functions to change it.
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
