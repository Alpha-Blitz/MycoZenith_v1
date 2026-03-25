import Link from 'next/link'

const PILLARS = [
  {
    label: 'Fruiting Body Only',
    body:  'Zero mycelium-on-grain filler. Every capsule is pure, extracted mushroom tissue.',
  },
  {
    label: 'Verified Potency',
    body:  'Third-party tested for beta-glucan content — the biomarker that actually matters.',
  },
  {
    label: 'Clinical Transparency',
    body:  'Full-spectrum COA on every product. No proprietary blends. No hidden fillers.',
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

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function OurStorySection() {
  return (
    <section className="bg-[#0F0F0F] py-16 sm:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto border-t border-white/[0.07] pt-16 sm:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-5 h-px bg-[#8B5CF6]" />
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Our Story</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight mb-6">
              Built on Evidence.<br />
              <span className="text-white/45">Not on Hype.</span>
            </h2>
            <p className="text-white/62 text-base leading-[1.8] mb-6 max-w-[480px]">
              MycoZenith was founded by a team of biohackers and biochemists frustrated
              by an industry that over-promises and under-delivers. We spent two years
              studying extraction methodologies, beta-glucan quantification, and
              bioavailability before putting a single product on the market.
            </p>
            <p className="text-white/50 text-base leading-[1.8] mb-10 max-w-[480px]">
              Every formula is rooted in peer-reviewed research and independently
              verified. Because you deserve to know exactly what you're putting
              in your body — and exactly what it does.
            </p>
            <Link href="/about"
              className="group/btn inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03]">
              Read Our Story
              <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1"><ArrowRight /></span>
            </Link>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-5">
            {PILLARS.map(({ label, body }) => (
              <div key={label}
                className="flex gap-4 sm:gap-5 bg-[#161616] border border-white/[0.08] rounded-2xl p-5 sm:p-7 hover:border-[#8B5CF6]/35 transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 flex items-center justify-center text-[#8B5CF6] shrink-0 mt-0.5">
                  <CheckIcon />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold mb-1.5">{label}</p>
                  <p className="text-white/58 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 mt-2">
              {[
                { value: '50K+', label: 'Customers'   },
                { value: '4.9★', label: 'Avg. Rating' },
                { value: '3rd',  label: 'Party Tested'},
              ].map(({ value, label }) => (
                <div key={label} className="bg-[#161616] border border-white/[0.08] rounded-xl p-5 text-center">
                  <p className="text-white text-xl font-semibold tracking-tight">{value}</p>
                  <p className="text-white/50 text-xs mt-1 tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
