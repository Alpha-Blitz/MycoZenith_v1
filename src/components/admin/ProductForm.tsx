'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import ScrollToTop from './ScrollToTop'

type ListItem = Record<string, string>

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
      <h3 className="text-white font-semibold text-sm mb-4 pb-3 border-b border-white/[0.07]">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/50 text-xs font-semibold tracking-[0.12em] uppercase">{label}</label>
      {children}
    </div>
  )
}

const INPUT = "w-full bg-white/[0.04] border border-white/[0.1] focus:border-[#8B5CF6]/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors duration-150 placeholder-white/30"
const TEXTAREA = INPUT + " resize-none"
const NUMBER_INPUT = INPUT + " admin-number-input"

function DynamicList<T extends ListItem>({
  items, setItems, fields, addLabel,
}: {
  items: T[]
  setItems: (v: T[]) => void
  fields: { key: keyof T; label: string; multi?: boolean }[]
  addLabel: string
}) {
  const empty = Object.fromEntries(fields.map(f => [f.key, ''])) as T

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: fields.length > 1 ? `repeat(${fields.length}, 1fr)` : '1fr' }}>
            {fields.map(f => (
              f.multi
                ? <textarea key={String(f.key)} placeholder={f.label} value={String(item[f.key])}
                    onChange={e => { const n = [...items]; n[i] = { ...n[i], [f.key]: e.target.value }; setItems(n) }}
                    rows={2} className={TEXTAREA} />
                : <input key={String(f.key)} type="text" placeholder={f.label} value={String(item[f.key])}
                    onChange={e => { const n = [...items]; n[i] = { ...n[i], [f.key]: e.target.value }; setItems(n) }}
                    className={INPUT} />
            ))}
          </div>
          <button onClick={() => setItems(items.filter((_, j) => j !== i))}
            className="text-white/25 hover:text-red-400 mt-2.5 shrink-0 cursor-pointer transition-colors duration-150">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      ))}
      <button onClick={() => setItems([...items, empty])}
        className="self-start text-[#8B5CF6] text-xs font-medium hover:text-[#a78bfa] cursor-pointer transition-colors duration-150">
        + {addLabel}
      </button>
    </div>
  )
}

interface ProductData {
  name: string; slug: string; tag: string; description: string; long_description: string
  description_bullets: { text: string }[]
  price: string; compare_price: string; price_display: string
  image: string; images: string[]
  hero_bullets: { icon: string; label: string }[]
  benefits: { icon: string; title: string; body: string }[]
  how_to_use: { step: string; detail: string }[]
  testimonials: { rating: string; quote: string; author: string }[]
  faq: { q: string; a: string }[]
  stock: string; sku: string; serving_size: string; extract: string; beta_glucan: string
  meta_title: string; meta_description: string
  status: 'active' | 'draft' | 'out_of_stock'
}

const EMPTY: ProductData = {
  name: '', slug: '', tag: '', description: '', long_description: '', description_bullets: [],
  price: '', compare_price: '', price_display: '',
  image: '', images: [],
  hero_bullets: [], benefits: [], how_to_use: [], testimonials: [], faq: [],
  stock: '0', sku: '', serving_size: '', extract: '', beta_glucan: '',
  meta_title: '', meta_description: '',
  status: 'draft',
}

export default function ProductForm({ initialData, id }: { initialData?: Partial<ProductData> & { id?: string }; id?: string }) {
  const router = useRouter()
  const [data, setData] = useState<ProductData>({ ...EMPTY, ...initialData })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: keyof ProductData, val: unknown) {
    setData(d => ({ ...d, [key]: val }))
  }

  function autoSlug(name: string) {
    setData(d => ({ ...d, name, slug: d.slug || slugify(name) }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price) || 0,
        compare_price: data.compare_price ? parseFloat(data.compare_price) : null,
        stock: parseInt(data.stock) || 0,
        description_bullets: data.description_bullets.map(b => b.text),
      }
      const url    = id ? `/api/admin/products/${id}` : '/api/admin/products'
      const method = id ? 'PATCH' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Save failed') }
      router.push('/admin/products')
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* Status bar */}
      <div className="flex items-center justify-between bg-[#0F0F0F] border border-white/[0.07] rounded-2xl px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-sm">Status:</span>
          <div className="flex items-center gap-2">
            {([
              { val: 'draft',         label: 'Draft',        activeClass: 'bg-white/[0.06] border-white/[0.15] text-white/60' },
              { val: 'active',        label: 'Active',       activeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
              { val: 'out_of_stock',  label: 'Out of Stock', activeClass: 'bg-orange-500/15 border-orange-500/30 text-orange-400' },
            ] as const).map(({ val, label, activeClass }) => (
              <button key={val} type="button" onClick={() => set('status', val)}
                className={['px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer',
                  data.status === val ? activeClass : 'bg-transparent border-white/[0.08] text-white/30 hover:text-white/60',
                ].join(' ')}>{label}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={() => router.back()} className="text-white/40 text-sm hover:text-white/70 cursor-pointer transition-colors duration-150">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <Section title="Basic Info">
        <Field label="Product Name">
          <input type="text" value={data.name} onChange={e => autoSlug(e.target.value)} placeholder="Lion's Mane" className={INPUT} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug">
            <input type="text" value={data.slug} onChange={e => set('slug', slugify(e.target.value))} placeholder="lions-mane" className={INPUT} />
          </Field>
          <Field label="Tag / Category">
            <input type="text" value={data.tag} onChange={e => set('tag', e.target.value)} placeholder="Cognitive Focus" className={INPUT} />
          </Field>
        </div>
        <Field label="Short Description">
          <textarea value={data.description} onChange={e => set('description', e.target.value)} rows={2} className={TEXTAREA} />
        </Field>
        <Field label="Long Description">
          <textarea value={data.long_description} onChange={e => set('long_description', e.target.value)} rows={4} className={TEXTAREA} />
        </Field>
        <Field label="Description Bullets">
          <DynamicList
            items={data.description_bullets}
            setItems={v => set('description_bullets', v)}
            fields={[{ key: 'text', label: 'Bullet point' }]}
            addLabel="Add bullet"
          />
        </Field>
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Price (₹)">
            <input type="number" value={data.price} onChange={e => set('price', e.target.value)} placeholder="1599" className={NUMBER_INPUT} />
          </Field>
          <Field label="Compare Price (₹)">
            <input type="number" value={data.compare_price} onChange={e => set('compare_price', e.target.value)} placeholder="1999" className={NUMBER_INPUT} />
          </Field>
          <Field label="Display Price">
            <input type="text" value={data.price_display} onChange={e => set('price_display', e.target.value)} placeholder="₹1,599" className={INPUT} />
          </Field>
        </div>
      </Section>

      {/* Media */}
      <Section title="Media">
        <div className="grid grid-cols-2 gap-3">
          {/* Primary image — larger */}
          <div className="col-span-2">
            <ImageUpload label="Primary Image" value={data.image} onChange={v => set('image', v)} />
          </div>
          {/* Additional images grid */}
          {[0, 1, 2].map(idx => (
            <ImageUpload
              key={idx}
              label={`Additional Image ${idx + 1}`}
              value={(data.images || [])[idx] ?? ''}
              onChange={v => {
                const imgs = [...(data.images || []), '', '', ''].slice(0, 3)
                imgs[idx] = v
                set('images', imgs.filter((u, i) => u || i < idx))
              }}
              compact
            />
          ))}
        </div>
      </Section>

      {/* Hero Bullets */}
      <Section title="Hero Bullets">
        <DynamicList
          items={data.hero_bullets}
          setItems={v => set('hero_bullets', v)}
          fields={[{ key: 'icon', label: 'Emoji' }, { key: 'label', label: 'Label' }]}
          addLabel="Add bullet"
        />
      </Section>

      {/* Benefits */}
      <Section title="Benefits">
        <DynamicList
          items={data.benefits}
          setItems={v => set('benefits', v)}
          fields={[{ key: 'icon', label: 'Emoji' }, { key: 'title', label: 'Title' }, { key: 'body', label: 'Description', multi: true }]}
          addLabel="Add benefit"
        />
      </Section>

      {/* How To Use */}
      <Section title="How To Use">
        <DynamicList
          items={data.how_to_use}
          setItems={v => set('how_to_use', v)}
          fields={[{ key: 'step', label: 'Step' }, { key: 'detail', label: 'Detail', multi: true }]}
          addLabel="Add step"
        />
      </Section>

      {/* Testimonials */}
      <Section title="Testimonials">
        <DynamicList
          items={data.testimonials}
          setItems={v => set('testimonials', v)}
          fields={[{ key: 'rating', label: 'Rating (1-5)' }, { key: 'author', label: 'Author' }, { key: 'quote', label: 'Quote', multi: true }]}
          addLabel="Add testimonial"
        />
      </Section>

      {/* FAQ */}
      <Section title="FAQ">
        <DynamicList
          items={data.faq}
          setItems={v => set('faq', v)}
          fields={[{ key: 'q', label: 'Question' }, { key: 'a', label: 'Answer', multi: true }]}
          addLabel="Add FAQ"
        />
      </Section>

      {/* Inventory */}
      <Section title="Inventory">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Stock">
            <input type="number" value={data.stock} onChange={e => set('stock', e.target.value)} className={NUMBER_INPUT} />
          </Field>
          <Field label="SKU">
            <input type="text" value={data.sku} onChange={e => set('sku', e.target.value)} className={INPUT} />
          </Field>
          <Field label="Serving Size">
            <input type="text" value={data.serving_size} onChange={e => set('serving_size', e.target.value)} placeholder="2 capsules" className={INPUT} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Extract Ratio">
            <input type="text" value={data.extract} onChange={e => set('extract', e.target.value)} placeholder="10:1" className={INPUT} />
          </Field>
          <Field label="Beta-Glucan %">
            <input type="text" value={data.beta_glucan} onChange={e => set('beta_glucan', e.target.value)} placeholder="≥30%" className={INPUT} />
          </Field>
        </div>
      </Section>

      {/* SEO */}
      <Section title="SEO">
        <Field label="Meta Title">
          <input type="text" value={data.meta_title} onChange={e => set('meta_title', e.target.value)} className={INPUT} />
        </Field>
        <Field label="Meta Description">
          <textarea value={data.meta_description} onChange={e => set('meta_description', e.target.value)} rows={2} className={TEXTAREA} />
        </Field>
      </Section>
      <ScrollToTop />
    </div>
  )
}
