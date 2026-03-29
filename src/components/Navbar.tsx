'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
  { href: '/',         label: 'Home'     },
  { href: '/products', label: 'Products' },
  { href: '/blog',     label: 'Blog'     },
  { href: '/about',    label: 'About'    },
]

/* ─── Icons ───────────────────────────────────────────────────── */
function SearchIcon({ size = 22 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function CloseSmIcon({ size = 17 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  )
}

function CartIcon({ size = 22 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function UserIcon({ size = 22 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="7"  x2="20" y2="7"  />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  )
}

/* ─── Navbar ──────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false)
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [searchOpen,    setSearchOpen]    = useState(false)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [avatarOpen,    setAvatarOpen]    = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const avatarRef      = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router   = useRouter()
  const { user, openModal, signOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 60)
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    if (avatarOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [avatarOpen])

  const closeSearch = () => { setSearchOpen(false); setSearchQuery('') }

  const userInitial = user?.user_metadata?.full_name?.charAt(0)?.toUpperCase()
    ?? user?.email?.charAt(0)?.toUpperCase()
    ?? '?'

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) { router.push(`/products?q=${encodeURIComponent(q)}`); closeSearch() }
  }

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]',
          'transition-all duration-300',
          scrolled ? 'border-b border-white/[0.07] shadow-[0_2px_24px_rgba(0,0,0,0.7)]' : '',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[66px] flex items-center justify-between gap-4">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link
            href={pathname === '/about' ? '/admin' : '/'}
            className="flex items-center shrink-0 group"
          >
            <span
              style={{ fontFamily: 'var(--font-playfair)' }}
              className="font-semibold text-[20px] tracking-wide text-slate-100 group-hover:text-white transition-colors duration-200"
            >
              MycoZenith
            </span>
          </Link>

          {/* ── Center nav ───────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'relative text-sm tracking-wide transition-colors duration-200',
                    active ? 'text-[#8B5CF6]' : 'text-white/70 hover:text-[#8B5CF6]',
                  ].join(' ')}
                >
                  {label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#8B5CF6] rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── Right icons ──────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-5">

            {/* Expandable search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div
                style={{ maxWidth: searchOpen ? '200px' : '0px' }}
                className="overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out"
                aria-hidden={!searchOpen}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                  placeholder="Search products…"
                  tabIndex={searchOpen ? 0 : -1}
                  className="w-[200px] bg-white/[0.06] border border-white/[0.1] text-white text-sm placeholder-white/30 px-3 py-1.5 rounded-md outline-none focus:border-[#8B5CF6] transition-colors duration-200"
                />
              </div>
              {searchOpen ? (
                <button type="button" onClick={closeSearch} aria-label="Close search"
                  className="cursor-pointer text-white/55 hover:text-[#8B5CF6] hover:scale-110 transition-all duration-200">
                  <CloseSmIcon />
                </button>
              ) : (
                <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search"
                  className="cursor-pointer text-white/55 hover:text-[#8B5CF6] hover:scale-110 transition-all duration-200">
                  <SearchIcon />
                </button>
              )}
            </form>

            <button aria-label="Cart"
              className="cursor-pointer text-white/55 hover:text-[#8B5CF6] hover:scale-110 transition-all duration-200">
              <CartIcon />
            </button>
            {user && (
              <Link href="/admin" aria-label="Admin panel"
                className="cursor-pointer text-white/30 hover:text-[#8B5CF6] hover:scale-110 transition-all duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </Link>
            )}
            {user ? (
              <div ref={avatarRef} className="relative">
                <button
                  onClick={() => setAvatarOpen((v) => !v)}
                  aria-label="Account menu"
                  className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] text-sm font-semibold cursor-pointer hover:bg-[#8B5CF6]/30 transition-colors duration-200"
                >
                  {userInitial}
                </button>
                {avatarOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-[#161616] border border-white/[0.1] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                    <p className="px-4 pt-3 pb-2 text-white/40 text-xs truncate">{user.email}</p>
                    <div className="border-t border-white/[0.07]" />
                    <button
                      onClick={() => { setAvatarOpen(false); signOut() }}
                      className="w-full text-left px-4 py-3 text-sm text-white/75 hover:text-white hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                aria-label="Login"
                onClick={openModal}
                className="cursor-pointer text-white/55 hover:text-[#8B5CF6] hover:scale-110 transition-all duration-200"
              >
                <UserIcon />
              </button>
            )}

          </div>

          {/* ── Mobile hamburger ─────────────────────────────── */}
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu"
            className="md:hidden text-white/70 hover:text-white transition-colors duration-200">
            <MenuIcon />
          </button>

        </div>
      </header>

      {/* ── Mobile overlay ───────────────────────────────────── */}
      <div
        role="dialog" aria-modal="true" aria-label="Navigation menu"
        className={[
          'fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col',
          'transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 h-[66px] border-b border-white/[0.06]">
          <Link href="/" className="flex items-center">
            <span style={{ fontFamily: 'var(--font-playfair)' }} className="font-semibold text-[20px] tracking-wide text-slate-100">MycoZenith</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
            className="text-white/55 hover:text-white transition-colors duration-200">
            <CloseIcon />
          </button>
        </div>

        {/* Mobile search */}
        <div className="px-4 sm:px-6 pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const q = searchQuery.trim()
              if (q) { router.push(`/products?q=${encodeURIComponent(q)}`); setMobileOpen(false); setSearchQuery('') }
            }}
            className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5"
          >
            <SearchIcon size={16} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none" />
          </form>
        </div>

        <nav className="flex-1 flex flex-col items-center justify-center gap-7">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={['text-2xl font-medium tracking-wide transition-colors duration-200',
                  active ? 'text-[#8B5CF6]' : 'text-white hover:text-[#8B5CF6]'].join(' ')}>
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center justify-center gap-10 px-6 pb-12 border-t border-white/[0.05] pt-8">
          <button className="flex flex-col items-center gap-2 text-white/45 hover:text-[#8B5CF6] transition-colors duration-200">
            <CartIcon /><span className="text-xs tracking-wide">Cart</span>
          </button>
          {user ? (
            <button
              onClick={() => { setMobileOpen(false); signOut() }}
              className="flex flex-col items-center gap-2 text-white/45 hover:text-[#8B5CF6] transition-colors duration-200"
            >
              <div className="w-[22px] h-[22px] rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] text-[10px] font-semibold">
                {userInitial}
              </div>
              <span className="text-xs tracking-wide">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => { setMobileOpen(false); openModal() }}
              className="flex flex-col items-center gap-2 text-white/45 hover:text-[#8B5CF6] transition-colors duration-200"
            >
              <UserIcon /><span className="text-xs tracking-wide">Login</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}
