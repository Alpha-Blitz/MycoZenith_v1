'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'mz_offer_dismissed'

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function FirstVisitPopup() {
  const [visible, setVisible]   = useState(false)
  const [email,   setEmail]     = useState('')
  const [done,    setDone]      = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 1800)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    setDone(true)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  if (!mounted || !visible) return null

  return (
    <div
      className="fixed bottom-5 right-5 z-[180] w-[360px] bg-[#161616] border border-white/[0.1] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
      style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>

      {/* Orange accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#F97316] to-[#EA580C]" />

      <div className="p-5">
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors duration-200 cursor-pointer"
        >
          <XIcon />
        </button>

        {!done ? (
          <>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#F97316]/15 border border-[#F97316]/30 text-[#F97316] text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full mb-4">
              Limited Offer
            </div>

            <h3 className="text-white text-lg font-semibold tracking-tight leading-snug mb-1">
              10% off your first order
            </h3>
            <p className="text-white/45 text-xs leading-relaxed mb-4">
              Enter your email to unlock your discount code — delivered instantly.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#F97316]/60 transition-colors duration-200"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                Claim 10% Off <ArrowRight />
              </button>
            </form>

            <button
              onClick={dismiss}
              className="mt-3 w-full text-center text-white/25 text-xs hover:text-white/45 transition-colors duration-200 cursor-pointer"
            >
              No thanks
            </button>
          </>
        ) : (
          <div className="py-4 text-center">
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="text-white font-semibold mb-1">You're in!</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-1">
              Check your inbox for your <span className="text-[#F97316] font-semibold">10% off</span> code.
            </p>
            <p className="text-white/30 text-xs">Valid on your first order only.</p>
            <button
              onClick={dismiss}
              className="mt-4 text-white/30 text-xs hover:text-white/50 transition-colors duration-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
