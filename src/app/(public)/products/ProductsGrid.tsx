'use client'

import { useState, useRef, useEffect } from 'react'
import { PRODUCTS } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

const TAGS = ['Cognitive Focus', 'Stress + Immunity', 'Energy + Endurance', 'Immunity + Recovery', 'Antioxidant + Longevity']
const SORTS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Highest Rated' },
] as const
const ITEMS_PER_PAGE = 12

type SortKey = typeof SORTS[number]['value']

function parsePrice(price: string): number {
  return parseInt(price.replace(/[₹,]/g, ''), 10)
}

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function ArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
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

/* ── Custom sort dropdown ──────────────────────────────── */
function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = SORTS.find((s) => s.value === value)!

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full inline-flex items-center justify-between gap-2 bg-[#0F0F0F] border border-white/[0.1] text-white/70 hover:text-white text-sm px-3.5 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
      >
        <span className="truncate">{current.label}</span>
        <span className="text-white/35 shrink-0"><ChevronDown /></span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 min-w-[11rem] w-max bg-[#0F0F0F] border border-white/[0.1] rounded-xl overflow-hidden z-50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {SORTS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => { onChange(s.value); setOpen(false) }}
              className={[
                'w-full text-left text-sm px-4 py-2.5 transition-colors duration-100 cursor-pointer whitespace-nowrap',
                s.value === value
                  ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]',
              ].join(' ')}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductsGrid({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery]         = useState(initialQuery)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort]           = useState<SortKey>('featured')
  const [page, setPage]           = useState(1)

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1) }, [query, activeTag, sort])

  const filtered = PRODUCTS
    .filter((p) => {
      const q = query.trim().toLowerCase()
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false
      if (activeTag && p.tag !== activeTag) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return parsePrice(a.price) - parsePrice(b.price)
      if (sort === 'price-desc') return parsePrice(b.price) - parsePrice(a.price)
      if (sort === 'rating')     return b.rating - a.rating
      return 0
    })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const hasFilters = query.trim() !== '' || activeTag !== null || sort !== 'featured'

  const clearFilters = () => {
    setQuery('')
    setActiveTag(null)
    setSort('featured')
  }

  return (
    <div>
      {/* ── Controls ─────────────────────────────────────── */}
      {/*
        8-col grid shares the same gap-4 as the 4-col product grid:
          col-span-2 of 8  =  col-span-1 of 4  (= 1 card width)
          col-span-1 of 8  =  half a card width
      */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-stretch gap-2 sm:gap-3">

          {/* Search — fills remaining space */}
          <div className="flex-1 flex items-stretch bg-[#0F0F0F] border border-white/[0.1] rounded-xl overflow-hidden focus-within:border-[#8B5CF6]/50 transition-colors duration-200 min-w-0">
            <span className="pl-3 pr-2 text-white/30 pointer-events-none shrink-0 flex items-center">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="flex-1 min-w-0 bg-transparent text-white text-sm placeholder-white/25 py-2.5 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="px-2 text-white/30 hover:text-white/60 transition-colors duration-150 cursor-pointer shrink-0 flex items-center"
                aria-label="Clear search"
              >
                <XIcon />
              </button>
            )}
            <button
              type="button"
              className="bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs font-semibold px-3 sm:px-4 py-2 m-1 rounded-lg transition-colors duration-150 cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <SearchIcon />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Sort — fixed width */}
          <div className="w-[130px] sm:w-[160px] shrink-0">
            <SortDropdown value={sort} onChange={setSort} />
          </div>

        </div>

        {/* Tag chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTag(null)}
            className={[
              'text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer',
              activeTag === null
                ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#8B5CF6]'
                : 'bg-white/[0.05] border-white/[0.1] text-white/55 hover:text-white/80',
            ].join(' ')}
          >
            All
          </button>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={[
                'text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer',
                activeTag === tag
                  ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#8B5CF6]'
                  : 'bg-white/[0.05] border-white/[0.1] text-white/55 hover:text-white/80',
              ].join(' ')}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Result count ─────────────────────────────────── */}
      <p className="text-white/35 text-sm mb-6">
        {filtered.length === PRODUCTS.length
          ? `Showing all ${PRODUCTS.length} products`
          : `${filtered.length} of ${PRODUCTS.length} products`}
        {totalPages > 1 && ` — page ${page} of ${totalPages}`}
      </p>

      {/* ── Grid or empty state ───────────────────────────── */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {paginated.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-white/40 text-base">No products match your search.</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-[#8B5CF6] hover:text-[#a78bfa] transition-colors duration-200 cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-3 sm:px-4 py-2.5 rounded-xl border border-white/[0.1] text-white/50 hover:text-white hover:border-white/[0.2] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
          >
            <ArrowLeft /> <span className="hidden sm:inline">Prev</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={[
                'w-9 h-9 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer',
                page === i + 1
                  ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#8B5CF6]'
                  : 'border-white/[0.1] text-white/50 hover:text-white hover:border-white/[0.2]',
              ].join(' ')}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-3 sm:px-4 py-2.5 rounded-xl border border-white/[0.1] text-white/50 hover:text-white hover:border-white/[0.2] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span> <ArrowRight />
          </button>
        </div>
      )}
    </div>
  )
}
