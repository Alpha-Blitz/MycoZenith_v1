'use client'

import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function ProductsSection() {
  return (
    <section className="bg-[#171717] pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Our Range</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {PRODUCTS.slice(0, 3).map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>

      </div>
    </section>
  )
}
