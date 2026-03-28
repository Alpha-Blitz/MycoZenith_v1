'use client'

import { useState } from 'react'
import type { Testimonial } from '@/lib/products'

/* ─── Types ───────────────────────────────────────────────── */
type Review = Testimonial & { title?: string; date: string }

/* ─── Star components ─────────────────────────────────────── */
function StarFilled({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F97316" stroke="#F97316" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
function StarEmpty({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= rating
          ? <StarFilled key={i} size={size} />
          : <StarEmpty key={i} size={size} />
      )}
    </div>
  )
}

/* ─── Interactive Star Picker ─────────────────────────────── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer transition-transform duration-100 hover:scale-110"
          aria-label={`${i} star`}
        >
          {i <= (hover || value)
            ? <StarFilled size={24} />
            : <StarEmpty size={24} />}
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-white/45 text-xs">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}</span>
      )}
    </div>
  )
}

/* ─── Average bar ─────────────────────────────────────────── */
function RatingBar({ count, total, label }: { count: number; total: number; label: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-white/40 text-xs w-3 text-right">{label}</span>
      <StarFilled size={10} />
      <div className="flex-1 h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
        <div className="h-full bg-[#F97316] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-white/30 text-xs w-4">{count}</span>
    </div>
  )
}

/* ─── Component ───────────────────────────────────────────── */
export default function ReviewSection({ initial }: { initial: Testimonial[] }) {
  const seeded: Review[] = initial.map((t, i) => ({
    ...t,
    title: ['Genuinely works', 'Highly recommend', 'Better than expected'][i] ?? 'Great product',
    date: ['Mar 2026', 'Feb 2026', 'Jan 2026'][i] ?? 'Jan 2026',
  }))

  const [reviews, setReviews] = useState<Review[]>(seeded)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ rating: 0, name: '', title: '', body: '' })
  const [error, setError] = useState('')

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)
  const dist = [5, 4, 3, 2, 1].map((n) => ({ label: n, count: reviews.filter((r) => r.rating === n).length }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.rating === 0) { setError('Please select a star rating.'); return }
    if (!form.name.trim()) { setError('Please enter your name.'); return }
    if (!form.body.trim()) { setError('Please write your review.'); return }
    setError('')
    const newReview: Review = {
      rating: form.rating,
      quote:  form.body.trim(),
      author: form.name.trim(),
      title:  form.title.trim() || undefined,
      date:   'Just now',
    }
    setReviews((prev) => [newReview, ...prev])
    setForm({ rating: 0, name: '', title: '', body: '' })
    setSubmitted(true)
    setShowForm(false)
  }

  return (
    <section>
      <div className="inline-flex items-center gap-2 mb-3">
        <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Reviews</span>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Customer Reviews</h2>
        <button
          onClick={() => { setShowForm((v) => !v); setSubmitted(false) }}
          className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ Write a Review'}
        </button>
      </div>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 bg-[#111111] border border-white/[0.07] rounded-2xl p-6 mb-6">
        <div className="flex flex-col items-center justify-center gap-1 sm:pr-8 sm:border-r sm:border-white/[0.07]">
          <span className="text-5xl font-bold text-white tabular-nums">{avg.toFixed(1)}</span>
          <Stars rating={Math.round(avg)} size={16} />
          <span className="text-white/35 text-xs mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex flex-col justify-center gap-2 flex-1">
          {dist.map(({ label, count }) => (
            <RatingBar key={label} label={label} count={count} total={reviews.length} />
          ))}
        </div>
      </div>

      {/* Write a Review form */}
      {showForm && (
        <div className="bg-[#111111] border border-[#F97316]/20 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-5">Your Review</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <p className="text-white/45 text-xs mb-2 font-medium uppercase tracking-[0.12em]">Rating *</p>
              <StarPicker value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white/45 text-xs mb-1.5 block font-medium uppercase tracking-[0.12em]">Your Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Arjun M."
                  className="w-full bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#F97316]/50 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="text-white/45 text-xs mb-1.5 block font-medium uppercase tracking-[0.12em]">Review Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Genuinely works"
                  className="w-full bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#F97316]/50 transition-colors duration-200"
                />
              </div>
            </div>
            <div>
              <label className="text-white/45 text-xs mb-1.5 block font-medium uppercase tracking-[0.12em]">Review *</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                placeholder="Share your experience..."
                rows={4}
                className="w-full bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#F97316]/50 transition-colors duration-200 resize-none"
              />
            </div>
            {error && <p className="text-[#F97316] text-xs">{error}</p>}
            <button
              type="submit"
              className="self-start bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-xl px-5 py-4 mb-6 text-[#a78bfa] text-sm">
          Thanks for your review! It's been added below.
        </div>
      )}

      {/* Review list */}
      <div className="flex flex-col gap-4">
        {reviews.map((r, i) => (
          <div key={i} className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <Stars rating={r.rating} />
                {r.title && <p className="text-white font-semibold mt-1.5">{r.title}</p>}
              </div>
              <span className="text-white/25 text-xs shrink-0">{r.date}</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-3">"{r.quote}"</p>
            <p className="text-white/35 text-xs font-medium">— {r.author}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
