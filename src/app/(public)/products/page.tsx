import ProductsGrid from './ProductsGrid'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  return (
    <div className="min-h-screen bg-[#1E1E1E] pt-20 sm:pt-28 pb-16 sm:pb-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-5 sm:mb-7">
          <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Our Range</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight mt-3">The Full Stack</h1>
          <p className="text-white/40 text-sm mt-2">Premium functional mushroom extracts — formulated for real results.</p>
        </div>

        <ProductsGrid initialQuery={q ?? ''} />

      </div>
    </div>
  )
}
