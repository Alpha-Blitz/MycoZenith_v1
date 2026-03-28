import Link from 'next/link'
import Image from 'next/image'
import NewsletterForm from '@/components/NewsletterForm'

/* ─── Data ────────────────────────────────────────────────── */
const VALUES = [
  {
    icon: '🔬',
    title: 'Science First',
    body:  'Every formula is rooted in peer-reviewed research. We cite our sources. We publish our COAs. We never hide behind proprietary blends.',
  },
  {
    icon: '🌿',
    title: 'Fruiting Body Only',
    body:  'Zero mycelium-on-grain. Our extracts come exclusively from mature fruiting bodies — the only part of the mushroom with meaningful beta-glucan density.',
  },
  {
    icon: '⚗️',
    title: 'Dual Extraction',
    body:  'Water and alcohol extraction in sequence. This captures both water-soluble polysaccharides and alcohol-soluble triterpenes — the full bioactive spectrum.',
  },
  {
    icon: '🛡️',
    title: 'Third-Party Verified',
    body:  'Every batch is independently tested for potency, purity, and heavy metals. You get the actual certificate — not a marketing claim.',
  },
]

const MILESTONES = [
  { year: '2022', label: 'Founded', detail: 'Started in a biochemistry lab in Bangalore, frustrated by an industry built on underdosed powders.' },
  { year: '2023', label: 'First Formula', detail: 'Launched Cordyceps after 14 months of extraction R&D and three rounds of independent testing.' },
  { year: '2024', label: 'Full Stack', detail: "Expanded to Lion's Mane and Reishi, completing the performance-cognition-recovery triad." },
  { year: '2026', label: 'Now', detail: '50,000+ customers across India. Still founder-run. Still uncompromising on the science.' },
]

const STATS = [
  { value: '50K+',  label: 'Customers Served'  },
  { value: '4.8★',  label: 'Average Rating'     },
  { value: '100%',  label: 'Fruiting Body'       },
  { value: '3rd',   label: 'Party Lab Tested'    },
]

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

/* ─── Page ────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#171717]">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0A] pt-32 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6">
        {/* Glow */}
        <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#8B5CF6]/[0.06] blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Our Story</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end">
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-[68px] font-semibold text-white tracking-tight leading-[1.04] mb-6">
                Built on Evidence.<br />
                <span className="text-white/40">Not on Hype.</span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg">
                MycoZenith was founded by a team of biohackers and biochemists who got tired of paying premium prices for underdosed mushroom powders with no real science behind them.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
                  <p className="text-white text-3xl font-semibold tracking-tight mb-1">{value}</p>
                  <p className="text-white/45 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-10">

        {/* ── Mission ────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 border-b border-white/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.08]">
              <Image src="/neuro.webp" alt="Cordyceps mushroom" fill
                className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
            </div>

            <div>
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Mission</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mt-3 mb-5">
                Performance supplements that actually perform.
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-5">
                We spent two years studying extraction methodologies, beta-glucan quantification, and bioavailability before putting a single product on the market. We interviewed sports scientists, read every clinical trial we could find, and ran dozens of extraction experiments in our own lab.
              </p>
              <p className="text-white/50 text-base leading-relaxed mb-8">
                The result is a small, focused range of mushroom supplements with verifiable potency, transparent sourcing, and dosages calibrated to what the research actually supports — not what sounds impressive on a label.
              </p>
              <Link href="/products"
                className="group inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02]">
                Shop the Range
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1"><ArrowRight /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Values ─────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 border-b border-white/[0.06]">
          <div className="mb-12">
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">What We Stand For</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mt-3">
              Four principles. Zero compromises.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-[#111111] border border-white/[0.07] rounded-2xl p-7 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/15 flex items-center justify-center text-2xl">
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-2">{v.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Timeline ───────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 border-b border-white/[0.06]">
          <div className="mb-12">
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Journey</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mt-3">
              How we got here.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="relative flex flex-col gap-3">
                {/* Connector line */}
                {i < MILESTONES.length - 1 && (
                  <div className="hidden lg:block absolute top-4 left-full w-full h-px bg-white/[0.07] -translate-x-1/2 z-0" />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  </div>
                  <span className="text-[#8B5CF6] text-sm font-bold tracking-wide">{m.year}</span>
                </div>
                <h3 className="text-white font-semibold">{m.label}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Philosophy ─────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 border-b border-white/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Philosophy</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mt-3 mb-6">
                The supplement industry has a transparency problem.
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-5">
                Most brands race to the bottom on cost, using mycelium grown on grain — a product that is majority starch, with negligible beta-glucan content. They rely on consumers not knowing the difference. We think that's wrong.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-5">
                At MycoZenith, every capsule contains exclusively fruiting body extract, independently verified for beta-glucan percentage. When we say ≥30% beta-glucans, we mean a third-party lab confirmed it — not a sales team estimated it.
              </p>
              <p className="text-white/50 text-base leading-relaxed">
                We publish Certificates of Analysis. We use real extract ratios (8:1, 10:1, 15:1) that reflect actual concentration. We dose at levels the clinical literature supports. That is not a marketing differentiator — it is the baseline we hold ourselves to.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.08]">
              <Image src="/fruiting.jpeg" alt="Mushroom fruiting body" fill
                className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent" />
            </div>
          </div>
        </section>

        {/* ── Newsletter CTA ─────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center gap-8">
            <div className="flex-1">
              <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Stay in the Loop</span>
              <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mt-3 mb-3">
                Science in your inbox.
              </h3>
              <p className="text-white/45 text-sm leading-relaxed max-w-sm">
                New research, product launches, and performance guides — no spam. Unsubscribe anytime.
              </p>
            </div>
            <div className="w-full sm:w-72 shrink-0">
              <NewsletterForm />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
