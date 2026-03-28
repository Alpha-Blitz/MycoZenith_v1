const TESTIMONIALS = [
  {
    stars:    5,
    quote:    "I've tried every mushroom supplement on the market. MycoZenith's Cordyceps is the only one that actually moved the needle on my morning runs. 12% improvement in my average pace within 3 weeks.",
    name:     'Marcus T.',
    role:     'Ultra-marathon runner',
    initials: 'MT',
  },
  {
    stars:    5,
    quote:    "The Lion's Mane blend is a legitimate game-changer for deep work sessions. I stack it with my morning coffee and the clarity and focus I get are unlike anything synthetic.",
    name:     'Priya S.',
    role:     'Software engineer & biohacker',
    initials: 'PS',
  },
  {
    stars:    5,
    quote:    "As a functional medicine doctor I'm skeptical of most supplement brands. MycoZenith's transparency around beta-glucan content and extraction method is exactly what the industry needs.",
    name:     'Dr. Elliot R.',
    role:     'Functional Medicine Physician',
    initials: 'ER',
  },
]

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#F97316" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="bg-[#171717] py-16 sm:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto border-t border-white/[0.07] pt-16 sm:pt-28">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-[#8B5CF6]" />
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Testimonials</span>
            <span className="w-5 h-px bg-[#8B5CF6]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">Trusted by Performers</h2>
          <p className="text-white/58 mt-4 text-base max-w-md mx-auto leading-relaxed">
            Athletes, engineers, and clinicians who demand more from their supplements.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map(({ stars, quote, name, role, initials }) => (
            <div key={name}
              className="flex flex-col gap-5 bg-[#161616] border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:border-white/[0.14] transition-colors duration-300">
              <div className="flex items-center gap-1">
                {Array.from({ length: stars }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="text-white/65 text-sm leading-[1.8] flex-1">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.07]">
                <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#8B5CF6] text-xs font-semibold">{initials}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
