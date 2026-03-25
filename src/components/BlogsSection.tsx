import Image from 'next/image'
import Link from 'next/link'

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
]

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function BlogsSection() {
  return (
    <section className="bg-[#0F0F0F] py-16 sm:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto border-t border-white/[0.07] pt-16 sm:pt-28">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-5 h-px bg-[#8B5CF6]" />
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">From the Lab</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
              The Science<br />Behind the Stack
            </h2>
          </div>
          <Link href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200 group shrink-0">
            All articles
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1"><ArrowRight /></span>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {POSTS.map(({ slug, image, category, title, excerpt, date, readTime }) => (
            <Link key={slug} href={`/blog/${slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#8B5CF6]/40 transition-all duration-300 bg-[#161616]">

              {/* Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={image} alt={title} fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/60 to-transparent" />
                {/* Category badge over image */}
                <div className="absolute bottom-3 left-4">
                  <span className="inline-block bg-[#8B5CF6]/20 border border-[#8B5CF6]/35 text-[#8B5CF6] text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                    {category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 className="text-white text-base font-semibold leading-snug group-hover:text-white/90 transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-white/58 text-sm leading-relaxed flex-1">{excerpt}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
                  <div className="flex items-center gap-3 text-white/40 text-xs">
                    <span>{date}</span>
                    <span>·</span>
                    <span>{readTime}</span>
                  </div>
                  <span className="text-[#8B5CF6]/55 group-hover:text-[#8B5CF6] transition-colors duration-200">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
