'use client'

import type { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':  'Dashboard',
  '/admin/products':   'Products',
  '/admin/orders':     'Orders',
  '/admin/customers':  'Customers',
  '/admin/blog':       'Content',
  '/admin/analytics':  'Analytics',
  '/admin/settings':   'Settings',
}

function getTitle(pathname: string) {
  for (const [key, title] of Object.entries(PAGE_TITLES)) {
    if (pathname === key || pathname.startsWith(key + '/')) return title
  }
  return 'Admin'
}

export default function AdminLayout({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const [avatarOpen, setAvatarOpen] = useState(false)
  const title = getTitle(pathname)

  const initial = user.user_metadata?.full_name?.charAt(0)?.toUpperCase()
    ?? user.email?.charAt(0)?.toUpperCase()
    ?? 'A'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-[#0D0D0D] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden ml-[240px]">
        {/* Top bar */}
        <header className="h-16 bg-[#0A0A0A] border-b border-white/[0.07] flex items-center justify-between px-6 shrink-0">
          <h1 className="text-white font-semibold text-lg tracking-tight">{title}</h1>

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => setAvatarOpen(v => !v)}
              className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] text-sm font-semibold cursor-pointer hover:bg-[#8B5CF6]/30 transition-colors duration-150"
            >
              {initial}
            </button>

            {avatarOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#111111] border border-white/[0.1] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.07]">
                  <p className="text-white text-sm font-medium truncate">{user.user_metadata?.full_name ?? 'Admin'}</p>
                  <p className="text-white/40 text-xs truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors duration-150 cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
