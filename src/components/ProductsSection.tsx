'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const PRODUCTS = [
  {
    slug:        'lions-mane',
    image:       '/lm.jpeg',
    name:        "Lion's Mane",
    tag:         'Cognitive Focus',
    description: "Sharpen neural pathways and fuel deep focus. Lion's Mane stimulates NGF for long-term cognitive performance.",
    price:       '₹1,599',
  },
  {
    slug:        'reishi',
    image:       '/reishi.jpeg',
    name:        'Reishi',
    tag:         'Stress + Immunity',
    description: 'Adaptogenic support to regulate cortisol, fortify immunity, and promote restful recovery.',
    price:       '₹1,199',
  },
  {
    slug:        'cordyceps',
    image:       '/cordy.jpeg',
    name:        'Cordyceps',
    tag:         'Energy + Endurance',
    description: 'Unlock cellular energy at the mitochondrial level. Clinically studied for VO₂ max and sustained output.',
    price:       '₹2,599',
  },
]

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function CartPlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function ProductCard({ slug, image, name, tag, description, price }: typeof PRODUCTS[0]) {
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#8B5CF6]/40 bg-[#161616] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(139,92,246,0.12)]">

      {/* ── Image (entire top is a link) ─────────────────── */}
      <Link href={`/products/${slug}`} className="relative block aspect-square overflow-hidden">
        <Image src={image} alt={name} fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw" />
        {/* Bottom scrim */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#161616] via-[#161616]/50 to-transparent" />
        {/* Tag */}
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/12 border border-white/20 text-white text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full backdrop-blur-sm">
            {tag}
          </span>
        </div>
      </Link>

      {/* ── Card body ────────────────────────────────────── */}
      <div className="p-4 pt-3 flex flex-col gap-2">

        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${slug}`} className="group/title">
            <h3 className="text-white text-lg font-semibold tracking-tight group-hover/title:text-white/80 transition-colors duration-200">
              {name}
            </h3>
          </Link>
          <span className="text-[#F97316] text-sm font-bold tracking-tight shrink-0 tabular-nums">
            {price}
          </span>
        </div>

        {/* Description */}
        <p className="text-white/58 text-sm leading-relaxed">{description}</p>

        {/* ── Buttons ──────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5 mt-2">
          <Link
            href={`/products/${slug}`}
            className="group/btn inline-flex items-center justify-center gap-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.03]"
          >
            Shop Now
            <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1">
              <ArrowRight size={12} />
            </span>
          </Link>
          <button
            onClick={handleAddToCart}
            className={[
              'inline-flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer',
              added
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#8B5CF6]'
                : 'bg-white/[0.05] border-white/[0.12] text-white/80 hover:bg-white/[0.1] hover:border-white/[0.2] hover:text-white',
            ].join(' ')}
          >
            <CartPlusIcon />
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>

      </div>

      {/* Hover inset glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[inset_0_0_0_1px_rgba(139,92,246,0.28)]" />
    </div>
  )
}

export default function ProductsSection() {
  return (
    <section className="bg-[#0F0F0F] pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-5 h-px bg-[#8B5CF6]" />
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Our Range</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
              Formulated for<br />Peak Performance
            </h2>
          </div>
          <Link href="/products"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200 group shrink-0">
            View all products
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1"><ArrowRight /></span>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>

      </div>
    </section>
  )
}
