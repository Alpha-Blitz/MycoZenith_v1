'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

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

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function AuthModal() {
  const { isOpen, closeModal, signIn, signUp } = useAuth()

  const [tab,      setTab]      = useState<'signin' | 'signup'>('signin')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setName(''); setEmail(''); setPassword('')
    setError(null); setSuccess(false); setShowPass(false); setResetSent(false)
  }, [tab, isOpen])

  useEffect(() => {
    if (isOpen) setTimeout(() => emailRef.current?.focus(), 80)
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeModal])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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

  async function handleGoogleSignIn() {
    setGLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) { setError(error.message); setGLoading(false) }
      // On success the browser redirects — keep spinner until navigation
    } catch {
      setError('Google sign-in failed. Please try again.')
      setGLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!email) { setError('Enter your email above first.'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    setLoading(false)
    if (error) setError(error.message)
    else setResetSent(true)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ animation: 'fadeIn 0.18s ease' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={closeModal} aria-hidden="true" />

      {/* Card */}
      <div className="relative w-full max-w-[420px] bg-[#161616] border border-white/[0.1] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-7 pb-0">
          <span style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-[18px] font-semibold text-slate-100 tracking-wide">
            MycoZenith
          </span>
          <button onClick={closeModal} aria-label="Close"
            className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer">
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
            <button key={t} onClick={() => setTab(t)}
              className={[
                'pb-2.5 mr-6 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer',
                tab === t ? 'text-white border-[#FF6523]' : 'text-white/40 border-transparent hover:text-white/70',
              ].join(' ')}>
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
            <button onClick={closeModal}
              className="mt-6 text-sm text-[#FF6523] hover:text-[#E5561E] transition-colors duration-200 cursor-pointer">
              Done
            </button>
          </div>
        ) : resetSent ? (
          <div className="px-8 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <p className="text-white font-semibold text-base mb-1">Reset link sent</p>
            <p className="text-white/50 text-sm leading-relaxed">
              Check <span className="text-white/75">{email}</span> for a password reset link.
            </p>
            <button onClick={closeModal}
              className="mt-6 text-sm text-[#FF6523] hover:text-[#E5561E] transition-colors duration-200 cursor-pointer">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 flex flex-col gap-4">

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={gLoading}
              className="w-full inline-flex items-center justify-center gap-3 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] text-white text-sm font-medium py-3 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60"
            >
              {gLoading ? <Spinner /> : <GoogleIcon />}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-white/25 text-xs">or</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {/* Name field (signup only) */}
            {tab === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-white/60 text-xs font-medium tracking-wide uppercase">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith" autoComplete="name" required
                  className="bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-4 py-3 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200" />
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-xs font-medium tracking-wide uppercase">Email</label>
              <input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email" required
                className="bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-4 py-3 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200" />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-white/60 text-xs font-medium tracking-wide uppercase">Password</label>
                {tab === 'signin' && (
                  <button type="button" onClick={handleForgotPassword}
                    className="text-[#8B5CF6] text-xs hover:text-[#a78bfa] transition-colors duration-200 cursor-pointer">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'Min. 8 characters' : '••••••••'}
                  autoComplete={tab === 'signin' ? 'current-password' : 'new-password'} required
                  className="w-full bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-4 py-3 pr-11 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200" />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 transition-colors duration-200 cursor-pointer"
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {error && <p className="text-[#FF6523] text-xs leading-relaxed -mt-1">{error}</p>}

            <button type="submit" disabled={loading}
              className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-[#FF6523] hover:bg-[#E5561E] disabled:opacity-60 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer">
              {loading && <Spinner />}
              {loading
                ? (tab === 'signin' ? 'Signing in…' : 'Creating account…')
                : (tab === 'signin' ? 'Sign In' : 'Create Account')}
            </button>

            <p className="text-center text-white/35 text-xs mt-1">
              {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={() => setTab(tab === 'signin' ? 'signup' : 'signin')}
                className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors duration-200 cursor-pointer">
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
