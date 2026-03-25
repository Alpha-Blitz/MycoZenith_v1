'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default function AuthModal() {
  const { isOpen, closeModal, signIn, signUp } = useAuth()

  const [tab,         setTab]         = useState<'signin' | 'signup'>('signin')
  const [name,        setName]        = useState('')
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [success,     setSuccess]     = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)

  // Reset form when tab changes or modal closes
  useEffect(() => {
    setName(''); setEmail(''); setPassword('')
    setError(null); setSuccess(false); setShowPass(false)
  }, [tab, isOpen])

  // Focus email on open
  useEffect(() => {
    if (isOpen) setTimeout(() => emailRef.current?.focus(), 80)
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeModal])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (tab === 'signin') {
      const err = await signIn(email, password)
      if (err) { setError(err); setLoading(false) }
      else { setLoading(false); closeModal() }
    } else {
      if (name.trim().length < 2) {
        setError('Please enter your full name.'); setLoading(false); return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.'); setLoading(false); return
      }
      const err = await signUp(email, password, name)
      if (err) { setError(err); setLoading(false) }
      else { setSuccess(true); setLoading(false) }
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ animation: 'fadeIn 0.18s ease' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative w-full max-w-[420px] bg-[#161616] border border-white/[0.1] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-7 pb-0">
          <span
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-[18px] font-semibold text-slate-100 tracking-wide"
          >
            MycoZenith
          </span>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Heading */}
        <div className="px-8 pt-5 pb-0">
          <h2 className="text-white text-2xl font-semibold tracking-tight">
            {tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-white/45 text-sm mt-1">
            {tab === 'signin'
              ? 'Sign in to access your account.'
              : 'Join thousands of performance-focused customers.'}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-0 px-8 mt-6 border-b border-white/[0.07]">
          {(['signin', 'signup'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'pb-2.5 mr-6 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer',
                tab === t
                  ? 'text-white border-[#F97316]'
                  : 'text-white/40 border-transparent hover:text-white/70',
              ].join(' ')}
            >
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Success state */}
        {success ? (
          <div className="px-8 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-white font-semibold text-base mb-1">Check your inbox</p>
            <p className="text-white/50 text-sm leading-relaxed">
              We sent a confirmation link to <span className="text-white/75">{email}</span>.<br />
              Click it to activate your account.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 text-sm text-[#F97316] hover:text-[#EA580C] transition-colors duration-200 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 flex flex-col gap-4">

            {/* Name field (signup only) */}
            {tab === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-white/60 text-xs font-medium tracking-wide uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  autoComplete="name"
                  required
                  className="bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-4 py-3 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200"
                />
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-xs font-medium tracking-wide uppercase">Email</label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-4 py-3 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-white/60 text-xs font-medium tracking-wide uppercase">Password</label>
                {tab === 'signin' && (
                  <button type="button" className="text-[#8B5CF6] text-xs hover:text-[#a78bfa] transition-colors duration-200 cursor-pointer">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'Min. 8 characters' : '••••••••'}
                  autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-4 py-3 pr-11 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 transition-colors duration-200 cursor-pointer"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[#F97316] text-xs leading-relaxed -mt-1">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              {loading && <Spinner />}
              {loading
                ? (tab === 'signin' ? 'Signing in…' : 'Creating account…')
                : (tab === 'signin' ? 'Sign In' : 'Create Account')}
            </button>

            {/* Toggle hint */}
            <p className="text-center text-white/35 text-xs mt-1">
              {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setTab(tab === 'signin' ? 'signup' : 'signin')}
                className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors duration-200 cursor-pointer"
              >
                {tab === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </p>

          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
