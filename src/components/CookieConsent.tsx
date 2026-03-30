'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'mz_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[170] w-[calc(100%-2.5rem)] max-w-xl"
      style={{ animation: 'cookieSlide 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      <style>{`
        @keyframes cookieSlide {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0);    }
        }
      `}</style>

      <div className="bg-[#161616] border border-white/[0.1] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">

        {/* Cookie icon */}
        <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
            <path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01"/>
          </svg>
        </div>

        {/* Text */}
        <p className="text-white/55 text-xs leading-relaxed flex-1">
          We use cookies to improve your experience and analyse site usage.{' '}
          <Link href="/cookies" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors duration-150">
            Learn more
          </Link>
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="text-xs font-medium text-white/40 hover:text-white/70 px-3 py-2 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
