import Image from 'next/image'
import Link from 'next/link'

const STATS = [
  { value: '100%', label: 'Fruiting Body' },
  { value: '40%',  label: 'Beta-Glucans'  },
  { value: '0',    label: 'Fillers Added' },
]

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0A]">

      {/* Background */}
      <div className="absolute inset-0">
        <Image src="/hero1.PNG" alt="Mushroom backdrop"
          fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/88 to-[#0A0A0A]/25" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0A0A0A] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#171717] to-transparent" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/[0.07] blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="max-w-[560px]">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">
              Cordyceps Performance Complex
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[42px] sm:text-5xl md:text-6xl lg:text-[68px] font-semibold text-white leading-[1.04] tracking-[-0.02em] mb-5 sm:mb-6">
            Nature's Intelligence.
            <br />
            <span className="text-white/50">Engineered for</span>
            <br />
            Performance.
          </h1>

          {/* Subheadline */}
          <p className="text-white/62 text-[17px] leading-[1.75] mb-10 max-w-[440px]">
            Cordyceps-powered supplements designed to enhance energy,
            endurance, and mental clarity.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/products"
              className="group/btn inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03]">
              Shop Now
              <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1"><ArrowRight /></span>
            </Link>
            <Link href="/about"
              className="group inline-flex items-center gap-1.5 border border-[#F97316]/70 hover:border-[#F97316] text-[#F97316] hover:text-[#F97316] text-sm font-medium px-5 py-3.5 rounded-xl transition-all duration-200">
              Learn More
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1"><ArrowRight /></span>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-4 mt-10 sm:mt-16 pt-8 border-t border-white/[0.08]">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-white text-xl font-semibold tracking-tight">{value}</span>
                <span className="text-white/50 text-xs tracking-wider uppercase">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
