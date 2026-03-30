'use client'

import { useState, useEffect } from 'react'

export default function ReadProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function update() {
      const scrolled = window.scrollY
      const total    = document.documentElement.scrollHeight - window.innerHeight
      setPct(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 bg-white/[0.06] z-50 pointer-events-none">
      <div
        className="h-full bg-[#FF6523] transition-[width] duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
