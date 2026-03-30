'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

/* ─── Icons ───────────────────────────────────────────────────── */
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill={filled ? '#FF6523' : 'none'} stroke={filled ? '#FF6523' : 'currentColor'} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill={filled ? '#8B5CF6' : 'none'} stroke={filled ? '#8B5CF6' : 'currentColor'} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ─── Share Sheet ─────────────────────────────────────────────── */
function ShareSheet({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const url = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* fallback: select text */ }
  }

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ url })
      onClose()
    }
  }

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 bg-[#0F0F0F] border border-white/[0.1] rounded-2xl p-3 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-1"
    >
      <button
        onClick={copyLink}
        className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors duration-100 cursor-pointer"
      >
        {copied ? <><CheckIcon /> <span className="text-[#8B5CF6]">Copied!</span></> : '🔗 Copy link'}
      </button>
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={shareNative}
          className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors duration-100 cursor-pointer"
        >
          📤 Share…
        </button>
      )}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors duration-100"
      >
        𝕏 Share on X
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors duration-100"
      >
        💬 WhatsApp
      </a>
    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function ArticleInteractions({
  slug,
  likeCount,
  commentCount,
}: {
  slug:         string
  likeCount:    number
  commentCount: number
}) {
  const { user, openModal } = useAuth()

  const [liked,  setLiked]  = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  // Restore persisted state
  useEffect(() => {
    if (!user) return
    setLiked(localStorage.getItem(`like:${user.id}:${slug}`) === '1')
    // Check Supabase for saved state
    const supabase = createClient()
    supabase.from('saved_posts').select('post_slug')
      .eq('user_id', user.id).eq('post_slug', slug).maybeSingle()
      .then(({ data }) => setSaved(!!data))
  }, [user, slug])

  const toggleLike = () => {
    if (!user) { openModal(); return }
    const next = !liked
    setLiked(next)
    if (next) localStorage.setItem(`like:${user.id}:${slug}`, '1')
    else       localStorage.removeItem(`like:${user.id}:${slug}`)
  }

  const toggleSave = async () => {
    if (!user) { openModal(); return }
    const next = !saved
    setSaved(next)
    const supabase = createClient()
    if (next) {
      await supabase.from('saved_posts').insert({ user_id: user.id, post_slug: slug })
    } else {
      await supabase.from('saved_posts').delete().eq('user_id', user.id).eq('post_slug', slug)
    }
  }

  const handleShare = () => {
    setShareOpen((v) => !v)
  }

  const scrollToComments = () => {
    if (!user) { openModal(); return }
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })
  }

  const btnBase = 'inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none'

  return (
    <div className="flex items-center gap-3 flex-wrap py-6 border-t border-b border-white/[0.07] my-10">
      {/* Like */}
      <button
        onClick={toggleLike}
        className={[btnBase, liked
          ? 'bg-[#FF6523]/10 border-[#FF6523]/30 text-[#FF6523]'
          : 'bg-white/[0.05] border-white/[0.1] text-white/60 hover:text-white hover:border-white/20',
        ].join(' ')}
      >
        <HeartIcon filled={liked} />
        {likeCount + (liked ? 1 : 0)}
      </button>

      {/* Save */}
      <button
        onClick={toggleSave}
        className={[btnBase, saved
          ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]'
          : 'bg-white/[0.05] border-white/[0.1] text-white/60 hover:text-white hover:border-white/20',
        ].join(' ')}
      >
        <BookmarkIcon filled={saved} />
        {saved ? 'Saved' : 'Save'}
      </button>

      {/* Share */}
      <div className="relative">
        <button
          onClick={handleShare}
          className={[btnBase, 'bg-white/[0.05] border-white/[0.1] text-white/60 hover:text-white hover:border-white/20'].join(' ')}
        >
          <ShareIcon /> Share
        </button>
        {shareOpen && <ShareSheet onClose={() => setShareOpen(false)} />}
      </div>

      {/* Comments */}
      <button
        onClick={scrollToComments}
        className={[btnBase, 'bg-white/[0.05] border-white/[0.1] text-white/60 hover:text-white hover:border-white/20'].join(' ')}
      >
        <CommentIcon /> {commentCount} Comments
      </button>
    </div>
  )
}
