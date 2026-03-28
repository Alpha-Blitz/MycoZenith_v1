'use client'

import { useState } from 'react'
import type { FAQ } from '@/lib/products'

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-white/[0.07] border border-white/[0.07] rounded-2xl overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.03] transition-colors duration-200 cursor-pointer"
          >
            <span className="text-white font-medium text-sm sm:text-base">{faq.q}</span>
            <span className={`${openIdx === i ? 'text-[#8B5CF6]' : 'text-white/40'} transition-colors duration-200`}>
              <ChevronDown open={openIdx === i} />
            </span>
          </button>
          {openIdx === i && (
            <div className="px-6 pb-5">
              <p className="text-white/55 text-sm leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
