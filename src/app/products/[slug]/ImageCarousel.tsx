'use client'

import { useState } from 'react'
import Image from 'next/image'

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export default function ImageCarousel({ images, name, tag }: { images: string[]; name: string; tag: string }) {
  const [active, setActive] = useState(0)

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const next = () => setActive((i) => (i + 1) % images.length)

  return (
    <div className="flex flex-col gap-3">

      {/* Main image */}
      <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.08]">
        <Image
          key={active}
          src={images[active]}
          alt={`${name} — view ${active + 1}`}
          fill
          priority={active === 0}
          className="object-cover object-center transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Tag badge */}
        <div className="absolute top-5 left-5">
          <span className="inline-block bg-white/12 border border-white/20 text-white text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full backdrop-blur-sm">
            {tag}
          </span>
        </div>

        {/* Arrow buttons — shown on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <ChevronRight />
            </button>

            {/* Slide counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 text-xs font-medium px-2.5 py-1 rounded-full">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={[
                'relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer',
                active === i
                  ? 'border-[#8B5CF6] opacity-100'
                  : 'border-white/[0.08] opacity-50 hover:opacity-75 hover:border-white/20',
              ].join(' ')}
            >
              <Image src={src} alt={`${name} thumbnail ${i + 1}`} fill
                className="object-cover object-center" sizes="15vw" />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators (mobile fallback) */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={[
                'rounded-full transition-all duration-200 cursor-pointer',
                active === i ? 'w-4 h-1.5 bg-[#8B5CF6]' : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/40',
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
