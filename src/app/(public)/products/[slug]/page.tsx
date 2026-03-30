import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/lib/products'
import NewsletterForm from '@/components/NewsletterForm'
import ProductActions from './ProductActions'
import FAQAccordion from './FAQAccordion'
import ImageCarousel from './ImageCarousel'
import ReviewSection from './ReviewSection'

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

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill={filled ? '#FF6523' : 'none'} stroke="#FF6523" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ─── Stars renderer ─────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} filled={i <= Math.round(rating)} />
      ))}
    </div>
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
          <span className="text-[#FF6523] text-sm font-bold tabular-nums">{price}</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-16 sm:pb-28">

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm text-[#8B5CF6]/60 mb-10">
          <Link href="/" className="hover:text-[#8B5CF6] transition-colors duration-200">Shop</Link>
          <span className="text-[#8B5CF6]/35 text-base">›</span>
          <Link href="/products" className="hover:text-[#8B5CF6] transition-colors duration-200">Products</Link>
          <span className="text-[#FF6523]/60 text-base">›</span>
          <span className="text-[#FF6523]">{product.name}</span>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 mb-12 sm:mb-16">

          {/* Image carousel */}
          <div>
            <ImageCarousel images={product.images} name={product.name} tag={product.tag} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">

            {/* Name */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-tight mb-3">
                {product.name}
              </h1>
              {/* Rating */}
              <div className="flex items-center gap-2.5">
                <Stars rating={product.rating} />
                <span className="text-[#FF6523] text-sm font-semibold">{product.rating}/5</span>
                <span className="text-white/30 text-sm">·</span>
                <span className="text-white/45 text-sm">{product.reviewCount}+ reviews</span>
              </div>
            </div>

            {/* Hero bullets */}
            <ul className="flex flex-col gap-2.5">
              {product.heroBullets.map((b) => (
                <li key={b.label} className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="text-base leading-none">{b.icon}</span>
                  {b.label}
                </li>
              ))}
            </ul>

            {/* Price */}
            <div>
              <span className="text-[#FF6523] text-3xl font-bold tabular-nums">{product.price}</span>
              <span className="text-white/30 text-sm ml-2">/ 60 capsules</span>
            </div>

            {/* Quantity + CTAs (client island) */}
            <ProductActions
              slug={product.slug}
              name={product.name}
              image={product.image}
              price={product.price}
              tag={product.tag}
            />

          </div>
        </div>

        {/* ── Trust Bar ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] bg-[#0F0F0F] border border-white/[0.08] rounded-2xl px-4 sm:px-0 py-4 sm:py-0 mb-14 sm:mb-16">
          {[
            { icon: <ShieldIcon />, label: 'Lab Tested' },
            { icon: <ShieldIcon />, label: '3rd Party Verified' },
            { icon: <ShieldIcon />, label: '100% Pure Extract' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 sm:flex-1 sm:justify-center sm:py-4 text-white/55 text-sm">
              <span className="text-[#8B5CF6]">{icon}</span>
              {label}
            </div>
          ))}
          <div className="sm:flex-1 sm:py-4 sm:text-center">
            <a href="#" className="flex items-center gap-1.5 text-[#FF6523] text-sm font-medium hover:text-[#FB923C] transition-colors duration-200 sm:justify-center">
              View Lab Report <ArrowRight size={11} />
            </a>
          </div>
        </div>

        {/* ── Product Description ────────────────────────────────── */}
        <section className="mb-14 sm:mb-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">Product Description</h2>
            <p className="text-white/50 text-sm leading-relaxed">{product.longDescription}</p>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <ul className="flex flex-col gap-3">
              {product.descriptionBullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 flex items-center justify-center shrink-0 text-[#8B5CF6]">
                    <CheckIcon />
                  </span>
                  <span className="text-white/70 text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            {/* Specs chips */}
            <div className="flex flex-wrap gap-2 mt-6">
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
          </div>
        </section>

        {/* ── Key Benefits ───────────────────────────────────────── */}
        <section className="mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Science-backed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-8">What it does</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.benefits.map((b) => (
              <div key={b.title} className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-4">
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

        {/* ── Why MycoZenith? ────────────────────────────────────── */}
        <section className="mb-14 sm:mb-16 bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5 sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Customer Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">Why MycoZenith?</h2>
          <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-lg">
            Not all {product.name} is equal. We use high-potency {product.extract} — not raw powder — to deliver real, measurable performance benefits.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {product.testimonials.map((t, i) => (
              <div key={i} className="bg-[#171717] border border-white/[0.07] rounded-xl p-5 flex flex-col gap-3">
                <Stars rating={t.rating} />
                <p className="text-white/75 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <p className="text-white/35 text-xs font-medium">— {t.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How to Use ─────────────────────────────────────────── */}
        <section className="mb-14 sm:mb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">How to Use</h2>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              Adaptogens build effect over time. Follow the protocol below for optimal, compounding results.
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            {product.howToUse.map((s, i) => (
              <div key={s.step} className="flex gap-5 bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
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

        {/* ── FAQs ───────────────────────────────────────────────── */}
        <section className="mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-8">Common Questions</h2>
          <FAQAccordion faqs={product.faq} />
        </section>

        {/* ── Customer Reviews ───────────────────────────────────── */}
        <section className="mb-14 sm:mb-16">
          <ReviewSection initial={product.testimonials} />
        </section>

        {/* ── Related Products ───────────────────────────────────── */}
        <section className="mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">The Stack</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-8">Also in the stack</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((r) => (
              <RelatedCard key={r.slug} slug={r.slug} image={r.image} name={r.name} tag={r.tag} price={r.price} />
            ))}
          </div>
        </section>

        {/* ── Newsletter CTA ─────────────────────────────────────── */}
        <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-3">
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
