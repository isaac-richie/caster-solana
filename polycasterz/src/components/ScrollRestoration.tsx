'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Component to restore scroll position to top on route changes
 * Prevents the page from starting at the bottom when loading
 */
export function ScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top on every route change
    if (typeof window !== 'undefined') {
      // Use instant scroll to prevent visible jump
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [pathname])

  // Also ensure scroll is at top on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [])

  return null
}


