'use client'

import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Admin layout scrolls inside <main class="overflow-y-auto">, not window
    const el = document.querySelector('main.overflow-y-auto') ?? window as unknown as Element
    const onScroll = () => setVisible((el as HTMLElement).scrollTop > 400)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  function scrollUp() {
    const el = document.querySelector('main.overflow-y-auto')
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollUp}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.12] text-white/60 hover:text-white hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 flex items-center justify-center transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  )
}
