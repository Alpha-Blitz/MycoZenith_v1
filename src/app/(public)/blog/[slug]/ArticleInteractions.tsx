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

  const linkCls = "flex items-center gap-3 text-sm text-white/70 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors duration-100 cursor-pointer"

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 bg-[#0F0F0F] border border-white/[0.1] rounded-2xl p-2 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col"
    >
      {/* Copy link */}
      <button onClick={copyLink} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-white/[0.07] flex items-center justify-center text-base">🔗</span>
        {copied ? <span className="text-[#8B5CF6] font-medium">Copied!</span> : 'Copy Link'}
      </button>

      {/* Instagram — mobile deep link, opens app */}
      <a href={`instagram://share?url=${encodeURIComponent(url)}`} onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold">IG</span>
        Instagram
      </a>

      {/* WhatsApp */}
      <a href={`https://wa.me/?text=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-[#25D366] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.526 5.845L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.368l-.36-.214-3.722.868.936-3.613-.235-.371A9.818 9.818 0 1112 21.818z"/></svg>
        </span>
        WhatsApp
      </a>

      {/* X (Twitter) */}
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-black border border-white/10 flex items-center justify-center text-white text-xs font-black">𝕏</span>
        Share on X
      </a>

      {/* Facebook */}
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-[#1877F2] flex items-center justify-center text-white text-sm font-bold">f</span>
        Facebook
      </a>

      {/* Gmail */}
      <a href={`https://mail.google.com/mail/?view=cm&su=Check%20this%20out&body=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.548l8.073-6.055C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/></svg>
        </span>
        Gmail
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
