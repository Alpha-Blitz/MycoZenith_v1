'use client'

export default function NewsletterForm() {
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="your@email.com"
        autoComplete="email"
        className="bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/30 px-4 py-3 rounded-lg outline-none focus:border-[#8B5CF6] transition-colors duration-200"
      />
      <button
        type="submit"
        className="bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
      >
        Subscribe
      </button>
    </form>
  )
}
