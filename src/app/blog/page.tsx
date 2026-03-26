'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'

/* ─── Data ────────────────────────────────────────────────────── */
const POSTS = [
  {
    slug:     'cordyceps-vo2-max',
    image:    '/vo2.webp',
    category: 'Performance Science',
    title:    'How Cordyceps Militaris Increases VO₂ Max and Aerobic Capacity',
    excerpt:  'A deep dive into the adenosine mechanisms that make cordyceps one of the most studied ergogenic fungi in sport science.',
    date:     'Mar 18, 2026',
    readTime: '7 min read',
  },
  {
    slug:     'lions-mane-ngf',
    image:    '/neuro.webp',
    category: 'Cognitive Health',
    title:    "Lion's Mane and NGF: The Neurotrophic Case for Daily Supplementation",
    excerpt:  "Nerve Growth Factor stimulation isn't just for recovery — it's the foundation of long-term cognitive resilience.",
    date:     'Mar 10, 2026',
    readTime: '5 min read',
  },
  {
    slug:     'mushroom-extraction',
    image:    '/fruiting.jpeg',
    category: 'Product Science',
    title:    'Fruiting Body vs. Mycelium: Why Extraction Method Defines Potency',
    excerpt:  "Most mushroom supplements are mycelium-on-grain with negligible beta-glucan content. Here's how to read a supplement panel.",
    date:     'Feb 28, 2026',
    readTime: '6 min read',
  },
  {
    slug:     'reishi-cortisol',
    image:    '/reishi.jpeg',
    category: 'Recovery',
    title:    'Reishi and the HPA Axis: A Clinical Look at Cortisol Modulation',
    excerpt:  'Chronic stress dysregulates the hypothalamic–pituitary–adrenal axis. Reishi triterpenes offer a targeted, adaptogenic response.',
    date:     'Feb 14, 2026',
    readTime: '8 min read',
  },
  {
    slug:     'lions-mane-sleep',
    image:    '/lm.jpeg',
    category: 'Recovery',
    title:    "Sleep Architecture and Neurogenesis: The Overnight Role of Lion's Mane",
    excerpt:  'Deep sleep is when the brain consolidates memory and clears metabolic waste. NGF support during this window may amplify the gains.',
    date:     'Jan 30, 2026',
    readTime: '6 min read',
  },
  {
    slug:     'cordyceps-atp',
    image:    '/cordy.jpeg',
    category: 'Performance Science',
    title:    'ATP Synthesis and Cordyceps: The Mitochondrial Connection',
    excerpt:  "Cordyceps sinensis increases cellular ATP production by upregulating key enzymes in the electron transport chain — here's the mechanism.",
    date:     'Jan 12, 2026',
    readTime: '9 min read',
  },
]

const CATEGORIES = ['All', 'Performance Science', 'Cognitive Health', 'Product Science', 'Recovery']

/* ─── Icons ───────────────────────────────────────────────────── */
function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

/* ─── Article Card ────────────────────────────────────────────── */
function ArticleCard({ post, featured = false }: { post: typeof POSTS[0]; featured?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#8B5CF6]/40 transition-all duration-300 bg-[#161616] hover:shadow-[0_8px_40px_rgba(139,92,246,0.10)] h-full">

      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/8]' : 'aspect-[16/9]'}`}>
        <Image src={post.image} alt={post.title} fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/60 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="inline-block bg-[#8B5CF6]/20 border border-[#8B5CF6]/35 text-[#8B5CF6] text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full backdrop-blur-sm">
            {post.category}
          </span>
        </div>
      </div>

      <div className={`flex flex-col gap-3 flex-1 ${featured ? 'p-7' : 'p-6'}`}>
        <h3 className={`text-white font-semibold leading-snug group-hover:text-white/90 transition-colors duration-200 ${featured ? 'text-lg sm:text-xl' : 'text-base'}`}>
          {post.title}
        </h3>
        <p className="text-white/55 text-sm leading-relaxed flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <span className="text-[#8B5CF6]/55 group-hover:text-[#8B5CF6] transition-colors duration-200">
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filteredPosts = useMemo(() => {
    const q = search.toLowerCase()
    return POSTS.filter((p) => {
      const matchCat    = activeCategory === 'All' || p.category === activeCategory
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  const showHero  = activeCategory === 'All' && search === ''
  const heroPost  = showHero ? POSTS[0] : null
  const gridPosts = showHero ? filteredPosts.slice(1) : filteredPosts

  const countLabel = (() => {
    const n      = filteredPosts.length
    const suffix = `${n} article${n !== 1 ? 's' : ''}`
    return activeCategory !== 'All' ? `${suffix} in ${activeCategory}` : suffix
  })()

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 sm:pb-28">

        {/* ── Page Header ──────────────────────────────────────── */}
        <div className="mb-12 sm:mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-5 h-px bg-[#8B5CF6]" />
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">From the Lab</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-semibold text-white tracking-tight leading-[1.05] mb-4">
            The Science<br />Behind the Stack
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed">
            Evidence-based insights on mushroom adaptogens, cognitive performance, and human optimization.
          </p>
        </div>

        {/* ── Controls ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={[
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap',
                  activeCategory === cat
                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/50 text-[#8B5CF6]'
                    : 'bg-transparent border-white/[0.1] text-white/50 hover:text-white hover:border-white/20',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[220px] shrink-0">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full bg-white/[0.04] border border-white/[0.1] text-white text-sm placeholder-white/25 pl-9 pr-4 py-2 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200"
            />
          </div>
        </div>

        {/* Article count */}
        <p className="text-white/35 text-xs tracking-wide mb-8 sm:mb-10">{countLabel}</p>

        {/* ── Featured Hero Post ────────────────────────────────── */}
        {heroPost && (
          <Link href={`/blog/${heroPost.slug}`}
            className="group relative block w-full rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#8B5CF6]/40 transition-all duration-300 mb-6 sm:mb-8 hover:shadow-[0_16px_60px_rgba(139,92,246,0.12)]">

            <div className="relative aspect-[4/3] sm:aspect-[21/9] w-full overflow-hidden">
              <Image src={heroPost.image} alt={heroPost.title} fill priority
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/65 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
            </div>

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:p-10 max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block bg-[#F97316]/15 border border-[#F97316]/35 text-[#F97316] text-[10px] font-semibold tracking-[0.18em] uppercase px-3 py-1 rounded-full">
                  Featured
                </span>
                <span className="inline-block bg-[#8B5CF6]/20 border border-[#8B5CF6]/35 text-[#8B5CF6] text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                  {heroPost.category}
                </span>
              </div>
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold leading-tight tracking-tight mb-3 group-hover:text-white/90 transition-colors duration-200">
                {heroPost.title}
              </h2>
              <p className="text-white/55 text-sm leading-relaxed mb-5 hidden sm:block">{heroPost.excerpt}</p>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3 text-white/40 text-xs">
                  <span>{heroPost.date}</span>
                  <span>·</span>
                  <span>{heroPost.readTime}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[#F97316] text-xs font-semibold group-hover:gap-2.5 transition-all duration-200">
                  Read Article <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* ── Article Grid ──────────────────────────────────────── */}
        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {gridPosts.map((post, idx) => (
              <div key={post.slug} className={idx === 0 ? 'sm:col-span-2' : ''}>
                <ArticleCard post={post} featured={idx === 0} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mb-4 text-white/30">
              <SearchIcon />
            </div>
            <p className="text-white text-base font-medium mb-1">No articles found</p>
            <p className="text-white/40 text-sm">
              Try a different keyword or{' '}
              <button
                onClick={() => { setActiveCategory('All'); setSearch('') }}
                className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors duration-200 cursor-pointer"
              >
                clear filters
              </button>
            </p>
          </div>
        )}

        {/* ── Newsletter CTA ────────────────────────────────────── */}
        <div className="mt-16 sm:mt-20 bg-[#161616] border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-4 h-px bg-[#8B5CF6]" />
              <span className="text-[#8B5CF6] text-[10px] font-semibold tracking-[0.22em] uppercase">Stay Updated</span>
            </div>
            <h3 className="text-white text-xl sm:text-2xl font-semibold tracking-tight mb-2">
              Science in your inbox
            </h3>
            <p className="text-white/45 text-sm leading-relaxed max-w-sm">
              Performance insights and new product launches — no spam, ever.
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
