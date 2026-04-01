export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POSTS, type Post } from '@/lib/blog'
import { createClient } from '@/lib/supabase/server'
import NewsletterForm from '@/components/NewsletterForm'
import ReadProgress    from './ReadProgress'
import BackToTop      from './BackToTop'
import TableOfContents from './TableOfContents'
import ArticleBody     from './ArticleBody'
import ArticleInteractions from './ArticleInteractions'
import CommentSection  from './CommentSection'

/* ─── DB row → Post mapper ───────────────────────────────────── */
function mapDbRowToPost(row: Record<string, unknown>): Post {
  return {
    slug:                row.slug as string,
    image:               row.image as string,
    category:            row.category as string,
    title:               row.title as string,
    excerpt:             row.excerpt as string,
    date:                row.published_at
      ? new Date(row.published_at as string).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
      : '',
    readTime:            row.read_time as string,
    author:              row.author as Post['author'],
    tags:                (row.tags as string[]) ?? [],
    likeCount:           (row.like_count as number) ?? 0,
    commentCount:        (row.comment_count as number) ?? 0,
    relatedProductSlugs: (row.related_product_slugs as string[]) ?? [],
    relatedPostSlugs:    (row.related_post_slugs as string[]) ?? [],
    references:          (row.post_references as Post['references']) ?? [],
    content:             (row.content as Post['content']) ?? [],
  }
}

/* ─── generateMetadata ───────────────────────────────────────── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post: Post | undefined

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (data) post = mapDbRowToPost(data)
  } catch { /* fallback */ }

  if (!post) post = POSTS.find((p) => p.slug === slug)
  if (!post) return {}

  const ogImage = `https://mycozenith.com${post.image}`
  return {
    title: `${post.title} — MycoZenith`,
    description: post.excerpt,
    openGraph: {
      type:        'article',
      title:       post.title,
      description: post.excerpt,
      url:         `https://mycozenith.com/blog/${slug}`,
      images:      [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.title,
      description: post.excerpt,
      images:      [ogImage],
    },
  }
}

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}


export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  /* ── Fetch post ─────────────────────────────────────────────── */
  let post: Post | undefined

  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (data) post = mapDbRowToPost(data)
  } catch { /* fallback */ }

  if (!post) post = POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  /* ── Live comment count ─────────────────────────────────────── */
  const { count: commentCount } = await supabase
    .from('blog_comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_slug', slug)
  const liveCommentCount = commentCount ?? post.commentCount

  /* ── Related posts ──────────────────────────────────────────── */
  let relatedPosts: Post[] = []

  try {
    if (post.relatedPostSlugs.length > 0) {
      const { data: relatedData } = await supabase
        .from('blog_posts')
        .select('*')
        .in('slug', post.relatedPostSlugs)
        .eq('status', 'published')
      if (relatedData && relatedData.length > 0) {
        relatedPosts = relatedData.map(mapDbRowToPost)
      }
    }

    if (relatedPosts.length < 3) {
      // Pad with other posts
      const { data: otherData } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .neq('slug', slug)
        .limit(3 - relatedPosts.length)
      if (otherData && otherData.length > 0) {
        const usedSlugs = new Set([slug, ...relatedPosts.map((p) => p.slug)])
        const extras = otherData
          .filter((r) => !usedSlugs.has(r.slug as string))
          .map(mapDbRowToPost)
        relatedPosts = [...relatedPosts, ...extras].slice(0, 3)
      }
    }
  } catch { /* fallback to static */ }

  if (relatedPosts.length === 0) {
    const explicit = post.relatedPostSlugs
      .map((s) => POSTS.find((p) => p.slug === s))
      .filter(Boolean) as Post[]
    if (explicit.length >= 3) {
      relatedPosts = explicit.slice(0, 3)
    } else {
      const used = new Set([slug, ...post.relatedPostSlugs])
      const extras = POSTS.filter((p) => !used.has(p.slug))
      relatedPosts = [...explicit, ...extras].slice(0, 3)
    }
  }

  return (
    <div className="min-h-screen bg-[#171717]">
      <ReadProgress />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-24 sm:pt-28 pb-20 sm:pb-28">

        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm font-medium text-[#8B5CF6]/60 mb-10">
          <Link href="/"     className="hover:text-[#8B5CF6] transition-colors duration-200">Home</Link>
          <span className="text-[#8B5CF6]/35 font-normal">›</span>
          <Link href="/blog" className="hover:text-[#8B5CF6] transition-colors duration-200">Blog</Link>
          <span className="text-[#FF6523]/60 font-normal">›</span>
          <span className="text-[#FF6523] line-clamp-1">{post.title}</span>
        </nav>

        {/* ── Main grid: article + sidebar ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">

          {/* ── Article column ──────────────────────────────────── */}
          <div className="min-w-0">

            {/* Mobile ToC (collapsible, hidden on lg+) */}
            <TableOfContents blocks={post.content} variant="mobile" />

            {/* Category + tags */}
            <div className="flex items-center flex-wrap gap-2 mb-5">
              <span className="bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full">
                {post.category}
              </span>
              {post.tags.map((tag) => (
                <span key={tag} className="bg-white/[0.05] border border-white/[0.08] text-white/40 text-[10px] font-medium px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight mb-5">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-3 text-white/40 text-sm mb-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full overflow-hidden">
                  <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" sizes="28px" />
                </div>
                <span className="text-white/60">{post.author.name}</span>
              </div>
              <span>·</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>

            {/* Hero image */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            </div>

            {/* Article body */}
            <ArticleBody blocks={post.content} />

            {/* References */}
            {post.references.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/[0.07]">
                <p className="text-white/35 text-[10px] font-semibold tracking-[0.18em] uppercase mb-4">
                  References
                </p>
                <ol className="flex flex-col gap-3">
                  {post.references.map((ref, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/45 leading-relaxed">
                      <span className="text-white/25 shrink-0 tabular-nums">[{i + 1}]</span>
                      <span>
                        <span className="text-white/60 font-medium">{ref.label}</span>
                        {' — '}
                        {ref.url ? (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#8B5CF6] transition-colors duration-150 underline underline-offset-2 decoration-white/20 hover:decoration-[#8B5CF6]/50"
                          >
                            {ref.title}
                          </a>
                        ) : (
                          ref.title
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Interactions */}
            <ArticleInteractions
              slug={post.slug}
              likeCount={post.likeCount}
              commentCount={liveCommentCount}
            />

            {/* ── About the Author ──────────────────────────────── */}
            <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6 flex gap-4 items-start mb-10">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="text-white font-semibold">{post.author.name}</p>
                <p className="text-[#8B5CF6] text-xs mb-2">{post.author.role}</p>
                <p className="text-white/55 text-sm leading-relaxed">{post.author.bio}</p>
              </div>
            </div>

            {/* ── Comments ─────────────────────────────────────── */}
            <CommentSection slug={post.slug} />

          </div>

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <aside className="hidden lg:block">
            {/* Single sticky wrapper — ToC + Products mentioned scroll together */}
            <div className="sticky top-28">

              {/* Desktop ToC */}
              <TableOfContents blocks={post.content} variant="desktop" />

              {/* Divider */}
              {post.relatedProductSlugs.length > 0 && (
                <div className="border-t border-white/[0.07] my-8" />
              )}

              {/* Products mentioned */}
              {post.relatedProductSlugs.length > 0 && (
                <div>
                  <p className="text-white/35 text-[10px] font-semibold tracking-[0.18em] uppercase mb-4">
                    Products mentioned
                  </p>
                  <div className="flex flex-col gap-2">
                    {post.relatedProductSlugs.map((s) => (
                      <Link
                        key={s}
                        href={`/products/${s}`}
                        className="flex items-center gap-2 text-white/55 hover:text-white text-sm bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-[#8B5CF6]/30 px-3 py-2 rounded-xl transition-all duration-150"
                      >
                        <ArrowRight size={11} />
                        <span className="capitalize">{s.replace(/-/g, ' ')}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>
        </div>

        {/* ── Related Posts ──────────────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <section className="mt-20">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Keep reading</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-8">More articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] hover:border-[#8B5CF6]/30 bg-[#0F0F0F] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(139,92,246,0.10)]"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <span className="text-[#8B5CF6] text-[10px] font-semibold tracking-[0.16em] uppercase">{p.category}</span>
                    <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-white/80 transition-colors duration-200">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/30 text-xs mt-auto pt-2">
                      <span>{p.date}</span>
                      <span>·</span>
                      <span>{p.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Newsletter CTA ─────────────────────────────────────── */}
        <div className="mt-20 bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[#8B5CF6] text-[10px] font-semibold tracking-[0.22em] uppercase">Newsletter</span>
            </div>
            <h3 className="text-white text-xl sm:text-2xl font-semibold tracking-tight mb-2">
              Stay ahead of performance science
            </h3>
            <p className="text-white/45 text-sm leading-relaxed max-w-sm">
              New research, product launches, and optimisation guides — straight to your inbox.
            </p>
          </div>
          <div className="w-full sm:w-72 shrink-0">
            <NewsletterForm />
          </div>
        </div>

      </div>

      <BackToTop />
    </div>
  )
}
