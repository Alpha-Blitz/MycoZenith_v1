'use client'

import { useState, useEffect } from 'react'
import { headingId } from '@/lib/blog'
import type { Block } from '@/lib/blog'

type Heading = { level: 2 | 3; text: string; id: string }

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function TableOfContents({ blocks, variant = 'both' }: { blocks: Block[]; variant?: 'mobile' | 'desktop' | 'both' }) {
  const headings: Heading[] = blocks
    .filter((b): b is Extract<Block, { type: 'heading' }> => b.type === 'heading')
    .map((b) => ({ level: b.level, text: b.text, id: headingId(b.text) }))

  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '')
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    if (headings.length === 0) return
    const observers: IntersectionObserver[] = []
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-20% 0px -70% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (headings.length === 0) return null

  const tocLinks = (
    <ul className="flex flex-col gap-0.5">
      {headings.map(({ id, level, text }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            onClick={() => setOpen(false)}
            className={[
              'block text-sm py-1 transition-colors duration-150',
              level === 3 ? 'pl-4' : 'pl-0',
              activeId === id
                ? 'text-[#8B5CF6] font-medium'
                : 'text-white/40 hover:text-white/70',
            ].join(' ')}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* Desktop: non-sticky — parent aside handles sticky positioning */}
      {variant !== 'mobile' && (
      <div className="hidden lg:block">
        <p className="text-white/35 text-[10px] font-semibold tracking-[0.18em] uppercase mb-4">
          On this page
        </p>
        {tocLinks}
      </div>
      )}

      {/* Mobile: collapsible */}
      {variant !== 'desktop' && (
      <div className="lg:hidden bg-[#111111] border border-white/[0.08] rounded-xl mb-6">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-white/60 text-sm font-medium cursor-pointer"
        >
          On this page
          <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <ChevronDown />
          </span>
        </button>
        {open && <div className="px-4 pb-4">{tocLinks}</div>}
      </div>
      )}
    </>
  )
}
