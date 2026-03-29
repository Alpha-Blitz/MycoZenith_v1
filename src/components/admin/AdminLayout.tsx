'use client'

import type { User } from '@supabase/supabase-js'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/admin/dashboard':  { title: 'Dashboard',  description: 'Overview of your store' },
  '/admin/products':   { title: 'Products',   description: 'Manage your product catalogue' },
  '/admin/orders':     { title: 'Orders',     description: 'Track and fulfil customer orders' },
  '/admin/customers':  { title: 'Customers',  description: 'View registered users' },
  '/admin/blog':       { title: 'Blog Posts', description: 'Manage your content' },
  '/admin/analytics':  { title: 'Analytics',  description: 'Revenue and order trends' },
  '/admin/settings':   { title: 'Settings',   description: 'Site configuration' },
}

function getMeta(pathname: string) {
  for (const [key, meta] of Object.entries(PAGE_META)) {
    if (pathname === key || pathname.startsWith(key + '/')) return meta
  }
  return { title: 'Admin', description: '' }
}

export default function AdminLayout({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const { title, description } = getMeta(pathname)

  const initial = user.user_metadata?.full_name?.charAt(0)?.toUpperCase()
    ?? user.email?.charAt(0)?.toUpperCase()
    ?? 'A'

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const isNew  = pathname.endsWith('/new')
  const isEdit = !isNew && pathname.split('/').length > 3

  return (
    <div className="flex h-screen bg-[#1C1C1C] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden ml-[240px]">

        {/* Top bar */}
        <header className="h-16 bg-[#161616]/90 backdrop-blur border-b border-white/[0.06] flex items-center justify-between px-6 shrink-0 gap-4">

          {/* Left: title + breadcrumb */}
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white font-semibold tracking-tight">{title}</span>
              {(isNew || isEdit) && (
                <>
                  <span className="text-white/20">/</span>
                  <span className="text-white/40 text-xs">{isNew ? 'New' : 'Edit'}</span>
                </>
              )}
            </div>
            {description && !isNew && !isEdit && (
              <p className="text-white/45 text-xs mt-0.5 hidden sm:block">{description}</p>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3 shrink-0">

            {/* View site */}
            <Link href="/" target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors duration-150">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              View site
            </Link>

            <div className="w-px h-4 bg-white/[0.08] hidden sm:block" />

            {/* Avatar + dropdown */}
            <div ref={avatarRef} className="relative">
              <button onClick={() => setAvatarOpen(v => !v)}
                className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6]/30 to-[#7c3aed]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] text-sm font-semibold transition-colors duration-150 group-hover:border-[#8B5CF6]/50">
                  {initial}
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className={['text-white/25 transition-transform duration-150', avatarOpen ? 'rotate-180' : ''].join(' ')}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {avatarOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#0F0F0F] border border-white/[0.1] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.07]">
                    <p className="text-white text-sm font-medium truncate">{user.user_metadata?.full_name ?? 'Admin'}</p>
                    <p className="text-white/40 text-xs truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/admin/settings" onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-white/55 hover:text-white hover:bg-white/[0.05] transition-colors duration-150">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      Settings
                    </Link>
                    <button onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors duration-150 cursor-pointer">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#1C1C1C]">
          {children}
        </main>
      </div>
    </div>
  )
}
