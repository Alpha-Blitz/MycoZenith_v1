import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/lib/products'
import NewsletterForm from '@/components/NewsletterForm'
import ProductActions from './ProductActions'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

/* ─── Icons ───────────────────────────────────────────────── */
function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

/* ─── Related Product Mini-Card ──────────────────────────── */
function RelatedCard({ slug, image, name, tag, price }: { slug: string; image: string; name: string; tag: string; price: string }) {
  return (
    <Link href={`/products/${slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#8B5CF6]/40 bg-[#161616] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(139,92,246,0.10)]">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image src={image} alt={name} fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 50vw, 33vw" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#161616] via-[#161616]/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/12 border border-white/20 text-white text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full backdrop-blur-sm">
            {tag}
          </span>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between gap-2">
        <div>
          <h4 className="text-white font-semibold text-base tracking-tight group-hover:text-white/80 transition-colors duration-200">{name}</h4>
          <span className="text-[#F97316] text-sm font-bold tabular-nums">{price}</span>
        </div>
        <span className="text-white/30 group-hover:text-[#8B5CF6] transition-colors duration-200 shrink-0">
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

/* ─── Page ────────────────────────────────────────────────── */
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) notFound()

  const related = PRODUCTS.filter((p) => p.slug !== slug)

  return (
    <div className="min-h-screen bg-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 sm:pb-28">

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm text-white/35 mb-10">
          <Link href="/products" className="hover:text-white/70 transition-colors duration-200">Products</Link>
          <span>/</span>
          <span className="text-white/60">{product.name}</span>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20 sm:mb-24">

          {/* Image */}
          <div className="lg:col-span-5">
            <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.08]">
              <Image src={product.image} alt={product.name} fill priority
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 42vw" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="inline-block bg-white/12 border border-white/20 text-white text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                  {product.tag}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:pt-2">

            {/* Name + price */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-tight mb-3">
                {product.name}
              </h1>
              <span className="text-[#F97316] text-2xl font-bold tabular-nums">{product.price}</span>
            </div>

            {/* Description */}
            <p className="text-white/60 text-base leading-relaxed max-w-xl">
              {product.longDescription}
            </p>

            {/* Specs chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Serving',      value: product.servingSize },
                { label: 'Extract',      value: product.extract },
                { label: 'Beta-glucans', value: product.betaGlucan },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2">
                  <p className="text-white/35 text-[10px] font-semibold tracking-[0.14em] uppercase">{label}</p>
                  <p className="text-white text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>

            {/* Quantity + cart (client island) */}
            <ProductActions />

          </div>
        </div>

        {/* ── Key Benefits ───────────────────────────────────────── */}
        <section className="mb-20 sm:mb-24">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-[#8B5CF6]" />
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Science-backed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-8">What it does</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.benefits.map((b) => (
              <div key={b.title} className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/15 flex items-center justify-center text-xl">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1.5">{b.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How to Use ─────────────────────────────────────────── */}
        <section className="mb-20 sm:mb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-[#8B5CF6]" />
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">How to Use</h2>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              Follow the protocol below for optimal results. Consistency is key — adaptogens build effect over time.
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-5">
            {product.howToUse.map((s, i) => (
              <div key={s.step} className="flex gap-5 bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#8B5CF6] text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{s.step}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ── Related Products ───────────────────────────────────── */}
        <section className="mb-20 sm:mb-24">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-[#8B5CF6]" />
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">The Stack</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-8">Also in the stack</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
            {related.map((r) => (
              <RelatedCard key={r.slug} slug={r.slug} image={r.image} name={r.name} tag={r.tag} price={r.price} />
            ))}
          </div>
        </section>

        {/* ── Newsletter CTA ─────────────────────────────────────── */}
        <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-4 h-px bg-[#8B5CF6]" />
              <span className="text-[#8B5CF6] text-[10px] font-semibold tracking-[0.22em] uppercase">Newsletter</span>
            </div>
            <h3 className="text-white text-xl sm:text-2xl font-semibold tracking-tight mb-2">
              Stay ahead of performance science
            </h3>
            <p className="text-white/45 text-sm leading-relaxed max-w-sm">
              New research, product launches, and optimization guides — straight to your inbox.
            </p>
          </div>
          <div className="w-full sm:w-72 shrink-0">
            <NewsletterForm />
          </div>
        </div>

      </div>
    </div>
  )
}
