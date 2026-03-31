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

  function resolve(choice: 'accepted' | 'declined') {
    localStorage.setItem(STORAGE_KEY, choice)
    setVisible(false)
    window.dispatchEvent(new Event('mz:cookie-resolved'))
  }

  const accept  = () => resolve('accepted')
  const decline = () => resolve('declined')

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[170] flex items-center justify-center px-4"
      style={{ animation: 'cookieFade 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      <style>{`
        @keyframes cookieFade {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1);    }
        }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={decline} />

      <div className="relative bg-[#161616] border border-white/[0.1] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] w-full max-w-md px-6 py-5 sm:px-8 sm:py-6 flex flex-col items-center text-center gap-4">

        {/* Cookie icon */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF6523]/10 border border-[#FF6523]/20 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6523" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
            <path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01"/>
          </svg>
        </div>

        {/* Text */}
        <div>
          <p className="text-white text-sm font-semibold mb-1">We use cookies</p>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
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
            className="text-xs sm:text-sm font-medium text-white/40 hover:text-white/70 border border-white/[0.1] hover:border-white/20 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-xs sm:text-sm font-semibold bg-[#FF6523] hover:bg-[#E5561E] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
