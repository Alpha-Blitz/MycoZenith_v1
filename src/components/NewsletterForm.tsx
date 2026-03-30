'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/email/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage('You\'re subscribed!')
        setEmail('')
      } else {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to subscribe')
      }
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl px-4 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
          fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <p className="text-[#8B5CF6] text-sm font-medium">{message}</p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus('idle'); setMessage('') }}
        placeholder="your@email.com"
        autoComplete="email"
        required
        className="bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/30 px-4 py-3 rounded-lg outline-none focus:border-[#8B5CF6] transition-colors duration-200"
      />
      {status === 'error' && <p className="text-red-400 text-xs">{message}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#FF6523] hover:bg-[#E5561E] disabled:opacity-60 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  )
}
