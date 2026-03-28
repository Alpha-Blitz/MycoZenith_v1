'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'

/* ─── Data ────────────────────────────────────────────────────── */
const POSTS = [
  {
    slug:     'cordyceps-vo2-max',
    image:    '/vo2.webp',
    category: 'Performance',
    title:    'How Cordyceps Militaris Increases VO₂ Max and Aerobic Capacity',
    excerpt:  'A deep dive into the adenosine mechanisms that make cordyceps one of the most studied ergogenic fungi in sport science.',
    date:     'Mar 18, 2026',
    readTime: '7 min read',
  },
  {
    slug:     'lions-mane-ngf',
    image:    '/neuro.webp',
    category: 'Science',
    title:    "Lion's Mane and NGF: The Neurotrophic Case for Daily Supplementation",
    excerpt:  "Nerve Growth Factor stimulation isn't just for recovery — it's the foundation of long-term cognitive resilience.",
    date:     'Mar 10, 2026',
    readTime: '5 min read',
  },
  {
    slug:     'mushroom-extraction',
    image:    '/fruiting.jpeg',
    category: 'Guides',
    title:    'Fruiting Body vs. Mycelium: Why Extraction Method Defines Potency',
    excerpt:  "Most mushroom supplements are mycelium-on-grain with negligible beta-glucan content. Here's how to read a supplement panel.",
    date:     'Feb 28, 2026',
    readTime: '6 min read',
  },
  {
    slug:     'reishi-cortisol',
    image:    '/reishi.jpeg',
    category: 'Science',
    title:    'Reishi and the HPA Axis: A Clinical Look at Cortisol Modulation',
    excerpt:  'Chronic stress dysregulates the hypothalamic–pituitary–adrenal axis. Reishi triterpenes offer a targeted, adaptogenic response.',
    date:     'Feb 14, 2026',
    readTime: '8 min read',
  },
  {
    slug:     'lions-mane-sleep',
    image:    '/lm.jpeg',
    category: 'Performance',
    title:    "Sleep Architecture and Neurogenesis: The Overnight Role of Lion's Mane",
    excerpt:  'Deep sleep is when the brain consolidates memory and clears metabolic waste. NGF support during this window may amplify the gains.',
    date:     'Jan 30, 2026',
    readTime: '6 min read',
  },
  {
    slug:     'cordyceps-atp',
    image:    '/cordy.jpeg',
    category: 'Science',
    title:    'ATP Synthesis and Cordyceps: The Mitochondrial Connection',
    excerpt:  "Cordyceps sinensis increases cellular ATP production by upregulating key enzymes in the electron transport chain — here's the mechanism.",
    date:     'Jan 12, 2026',
    readTime: '9 min read',
  },
]

const CATEGORIES = ['All', 'Performance', 'Science', 'Guides', 'Lifestyle', 'Updates']
const PAGE_SIZE   = 3

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

/* ─── Blog Card ───────────────────────────────────────────────── */
function BlogCard({ post }: { post: typeof POSTS[0] }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#8B5CF6]/40 transition-all duration-300 bg-[#111111] hover:shadow-[0_8px_40px_rgba(139,92,246,0.10)] h-full">

      {/* Thumbnail — fixed 16:9 */}
      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
        <Image src={post.image} alt={post.title} fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/50 to-transparent" />
        {/* Category tag — white */}
        <div className="absolute top-3 left-4">
          <span className="inline-block bg-white/10 border border-white/20 text-white text-[10px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="text-white text-base font-semibold leading-snug line-clamp-2 group-hover:text-white/85 transition-colors duration-200">
          {post.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.07] mt-auto">
          <div className="flex items-center gap-2 text-white/35 text-xs">
            <span>{post.readTime}</span>
            <span>·</span>
            <span>{post.date}</span>
          </div>
          <span className="text-[#8B5CF6]/50 group-hover:text-[#8B5CF6] transition-colors duration-200">
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search,         setSearch]         = useState('')
  const [visible,        setVisible]        = useState(PAGE_SIZE)

  useEffect(() => { setVisible(PAGE_SIZE) }, [activeCategory, search])

  const filteredPosts = useMemo(() => {
    const q = search.toLowerCase()
    return POSTS.filter((p) => {
      const matchCat    = activeCategory === 'All' || p.category === activeCategory
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  const showFeatured = activeCategory === 'All' && search === ''
  const featuredPost = showFeatured ? POSTS[0] : null
  // Featured post also appears in the grid — no slice
  const visibleGrid  = filteredPosts.slice(0, visible)
  const hasMore      = visible < filteredPosts.length

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Full-Width Hero ───────────────────────────────────────── */}
      <div className="relative h-[58vh] sm:h-[65vh] overflow-hidden flex items-center">
        <Image src="/neuro.webp" alt="Blog hero" fill priority
          className="object-cover object-center scale-105"
          sizes="100vw" />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/75 to-[#0A0A0A]/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0A0A0A] to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-5 h-px bg-[#8B5CF6]" />
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">From the Lab</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-[60px] font-semibold text-white tracking-tight leading-[1.04] mb-4">
            Insights &amp; Knowledge
          </h1>
          <p className="text-white/55 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
            Science-backed deep dives on adaptogens, performance optimization, and the biology of peak human output.
          </p>
          <a href="#articles"
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03]">
            Explore Articles
            <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-16 pb-20 sm:pb-28">

        {/* ── Featured Post Highlight ───────────────────────────── */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`}
            className="group relative block w-full rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#8B5CF6]/40 transition-all duration-300 mb-10 sm:mb-12 hover:shadow-[0_16px_60px_rgba(139,92,246,0.12)]">
            <div className="relative aspect-[4/3] sm:aspect-[21/8] w-full overflow-hidden">
              <Image src={featuredPost.image} alt={featuredPost.title} fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/65 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A]/70 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:p-10 max-w-[580px]">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block bg-[#F97316]/15 border border-[#F97316]/35 text-[#F97316] text-[10px] font-semibold tracking-[0.18em] uppercase px-3 py-1 rounded-full">
                  Featured
                </span>
                <span className="inline-block bg-white/10 border border-white/20 text-white text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full">
                  {featuredPost.category}
                </span>
              </div>
              <h2 className="text-white text-xl sm:text-2xl md:text-[28px] font-semibold leading-tight tracking-tight mb-3 line-clamp-2 group-hover:text-white/90 transition-colors duration-200">
                {featuredPost.title}
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-5 hidden sm:line-clamp-2">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-5">
                <span className="text-white/35 text-xs">{featuredPost.readTime} · {featuredPost.date}</span>
                <span className="inline-flex items-center gap-1.5 text-[#F97316] text-xs font-semibold group-hover:gap-2.5 transition-all duration-200">
                  Read Article <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* ── Category Filter Bar ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={[
                  'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0',
                  activeCategory === cat
                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/50 text-[#8B5CF6]'
                    : 'bg-transparent border-white/[0.1] text-white/50 hover:text-white hover:border-white/20',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-[210px] shrink-0">
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

        <p className="text-white/30 text-xs tracking-wide mb-8">
          {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' && ` in ${activeCategory}`}
        </p>

        {/* ── Blog Grid ─────────────────────────────────────────── */}
        {visibleGrid.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {visibleGrid.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 text-sm font-medium px-7 py-3 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Load More
                  <ArrowRight size={12} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mb-4 text-white/30">
              <SearchIcon />
            </div>
            <p className="text-white text-base font-medium mb-1">No articles found</p>
            <p className="text-white/40 text-sm">
              Try a different keyword or{' '}
              <button onClick={() => { setActiveCategory('All'); setSearch('') }}
                className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors duration-200 cursor-pointer">
                clear filters
              </button>
            </p>
          </div>
        )}

        {/* ── Newsletter CTA ────────────────────────────────────── */}
        <div className="mt-16 sm:mt-20 bg-[#111111] border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-8">
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
