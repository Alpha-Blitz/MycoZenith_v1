export const dynamic = 'force-dynamic'

import ProductsGrid from './ProductsGrid'
import { createClient } from '@/lib/supabase/server'
import { PRODUCTS, type Product } from '@/lib/products'

function mapDbRowToProduct(row: Record<string, unknown>): Product {
  return {
    slug:               row.slug as string,
    image:              row.image as string,
    images:             (row.images as string[]) ?? [],
    name:               row.name as string,
    tag:                row.tag as string,
    description:        row.description as string,
    price:              (row.price_display as string) ?? `₹${row.price}`,
    rating:             (row.rating as number) ?? 0,
    reviewCount:        (row.review_count as number) ?? 0,
    heroBullets:        (row.hero_bullets as Product['heroBullets']) ?? [],
    descriptionBullets: (row.description_bullets as string[]) ?? [],
    longDescription:    (row.long_description as string) ?? '',
    benefits:           (row.benefits as Product['benefits']) ?? [],
    howToUse:           (row.how_to_use as Product['howToUse']) ?? [],
    servingSize:        (row.serving_size as string) ?? '',
    extract:            row.extract as string,
    betaGlucan:         (row.beta_glucan as string) ?? '',
    testimonials:       (row.testimonials as Product['testimonials']) ?? [],
    faq:                (row.faq as Product['faq']) ?? [],
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  let products: Product[] = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      products = data.map(mapDbRowToProduct)
    }
  } catch { /* ignore */ }

  if (products.length === 0) {
    products = PRODUCTS
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] pt-20 sm:pt-28 pb-16 sm:pb-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-5 sm:mb-7">
          <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Our Range</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight mt-3">The Full Stack</h1>
          <p className="text-white/40 text-sm mt-2">Premium functional mushroom extracts — formulated for real results.</p>
        </div>

        <ProductsGrid products={products} initialQuery={q ?? ''} outOfStockSlugs={[]} />

      </div>
    </div>
  )
}
