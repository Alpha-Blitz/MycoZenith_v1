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
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[170] w-[calc(100%-2.5rem)] max-w-2xl"
      style={{ animation: 'cookieSlide 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      <style>{`
        @keyframes cookieSlide {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0);    }
        }
      `}</style>

      <div className="bg-[#161616] border border-white/[0.1] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] px-8 py-6 flex flex-col items-center text-center gap-5">

        {/* Cookie icon */}
        <div className="w-11 h-11 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
            <path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01"/>
          </svg>
        </div>

        {/* Text */}
        <div>
          <p className="text-white text-sm font-semibold mb-1">We use cookies</p>
          <p className="text-white/50 text-sm leading-relaxed">
            We use cookies to improve your experience and analyse site usage.{' '}
            <Link href="/cookies" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors duration-150">
              Learn more
            </Link>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={decline}
            className="text-sm font-medium text-white/40 hover:text-white/70 border border-white/[0.1] hover:border-white/20 px-5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-sm font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
