'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import BlockEditor from './BlockEditor'
import type { Block } from '@/lib/blog'

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

const INPUT    = "w-full bg-white/[0.04] border border-white/[0.1] focus:border-[#8B5CF6]/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors duration-150 placeholder-white/20"
const TEXTAREA = INPUT + " resize-none"

interface PostData {
  title: string; slug: string; excerpt: string; image: string
  category: string; tags: string; read_time: string
  status: 'published' | 'draft'; published_at: string
  author_name: string; author_role: string; author_bio: string; author_avatar: string
  content: Block[]
  related_product_slugs: string; related_post_slugs: string
  references: { label: string; title: string; url: string }[]
  meta_title: string; meta_description: string
}

const EMPTY: PostData = {
  title: '', slug: '', excerpt: '', image: '',
  category: '', tags: '', read_time: '',
  status: 'draft', published_at: '',
  author_name: 'Dr. Ravi Sharma', author_role: 'Head of Research, MycoZenith',
  author_bio: '', author_avatar: '',
  content: [],
  related_product_slugs: '', related_post_slugs: '',
  references: [],
  meta_title: '', meta_description: '',
}

function toPayload(data: PostData) {
  return {
    title:       data.title,
    slug:        data.slug,
    excerpt:     data.excerpt,
    image:       data.image,
    category:    data.category,
    tags:        data.tags.split(',').map(t => t.trim()).filter(Boolean),
    read_time:   data.read_time,
    status:      data.status,
    published_at: data.status === 'published' ? (data.published_at || new Date().toISOString()) : null,
    author: {
      name:   data.author_name,
      role:   data.author_role,
      bio:    data.author_bio,
      avatar: data.author_avatar,
    },
    content:              data.content,
    related_product_slugs: data.related_product_slugs.split(',').map(s => s.trim()).filter(Boolean),
    related_post_slugs:    data.related_post_slugs.split(',').map(s => s.trim()).filter(Boolean),
    post_references:       data.references,
    meta_title:            data.meta_title,
    meta_description:      data.meta_description,
  }
}

export default function BlogPostForm({ initialData, id }: { initialData?: Partial<PostData>; id?: string }) {
  const router = useRouter()
  const [data, setData] = useState<PostData>({ ...EMPTY, ...initialData })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: keyof PostData, val: unknown) {
    setData(d => ({ ...d, [key]: val }))
  }

  function autoSlug(title: string) {
    setData(d => ({ ...d, title, slug: d.slug || slugify(title) }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const payload = toPayload(data)
      const url    = id ? `/api/admin/blog/${id}` : '/api/admin/blog'
      const method = id ? 'PATCH' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Save failed') }
      router.push('/admin/blog')
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
            {(['draft', 'published'] as const).map(s => (
              <button key={s} onClick={() => set('status', s)}
                className={['px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer capitalize',
                  data.status === s
                    ? s === 'published' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.06] border-white/[0.15] text-white/60'
                    : 'bg-transparent border-white/[0.08] text-white/30 hover:text-white/60',
                ].join(' ')}>{s}</button>
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
        <Field label="Title">
          <input type="text" value={data.title} onChange={e => autoSlug(e.target.value)} placeholder="Article title" className={INPUT} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug">
            <input type="text" value={data.slug} onChange={e => set('slug', slugify(e.target.value))} placeholder="article-slug" className={INPUT} />
          </Field>
          <Field label="Category">
            <input type="text" value={data.category} onChange={e => set('category', e.target.value)} placeholder="Performance" className={INPUT} />
          </Field>
        </div>
        <Field label="Excerpt">
          <textarea value={data.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} className={TEXTAREA} placeholder="Short description shown in blog listing…" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tags (comma-separated)">
            <input type="text" value={data.tags} onChange={e => set('tags', e.target.value)} placeholder="Lion's Mane, Cognition, NGF" className={INPUT} />
          </Field>
          <Field label="Read Time">
            <input type="text" value={data.read_time} onChange={e => set('read_time', e.target.value)} placeholder="7 min read" className={INPUT} />
          </Field>
        </div>
        <Field label="Published At (leave blank to use now when publishing)">
          <input type="datetime-local" value={data.published_at} onChange={e => set('published_at', e.target.value)} className={INPUT} />
        </Field>
      </Section>

      {/* Cover Image */}
      <Section title="Cover Image">
        <ImageUpload label="Cover Image" value={data.image} onChange={v => set('image', v)} />
      </Section>

      {/* Author */}
      <Section title="Author">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name">
            <input type="text" value={data.author_name} onChange={e => set('author_name', e.target.value)} className={INPUT} />
          </Field>
          <Field label="Role">
            <input type="text" value={data.author_role} onChange={e => set('author_role', e.target.value)} className={INPUT} />
          </Field>
        </div>
        <Field label="Bio">
          <textarea value={data.author_bio} onChange={e => set('author_bio', e.target.value)} rows={2} className={TEXTAREA} />
        </Field>
        <ImageUpload label="Avatar" value={data.author_avatar} onChange={v => set('author_avatar', v)} />
      </Section>

      {/* Content */}
      <Section title="Content">
        <BlockEditor value={data.content} onChange={v => set('content', v)} />
      </Section>

      {/* Related */}
      <Section title="Related Content">
        <Field label="Related Product Slugs (comma-separated)">
          <input type="text" value={data.related_product_slugs} onChange={e => set('related_product_slugs', e.target.value)} placeholder="lions-mane, cordyceps" className={INPUT} />
        </Field>
        <Field label="Related Post Slugs (comma-separated)">
          <input type="text" value={data.related_post_slugs} onChange={e => set('related_post_slugs', e.target.value)} placeholder="cordyceps-atp, reishi-cortisol" className={INPUT} />
        </Field>
      </Section>

      {/* References */}
      <Section title="References">
        {data.references.map((ref, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <input type="text" placeholder="Label (e.g. Chen et al., 2022)" value={ref.label}
                onChange={e => { const r = [...data.references]; r[i] = { ...r[i], label: e.target.value }; set('references', r) }}
                className={INPUT} />
              <input type="text" placeholder="Full title" value={ref.title}
                onChange={e => { const r = [...data.references]; r[i] = { ...r[i], title: e.target.value }; set('references', r) }}
                className={INPUT} />
              <input type="text" placeholder="URL (optional)" value={ref.url}
                onChange={e => { const r = [...data.references]; r[i] = { ...r[i], url: e.target.value }; set('references', r) }}
                className={INPUT} />
            </div>
            <button onClick={() => set('references', data.references.filter((_, j) => j !== i))}
              className="text-white/25 hover:text-red-400 mt-2.5 shrink-0 cursor-pointer transition-colors duration-150">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
        <button onClick={() => set('references', [...data.references, { label: '', title: '', url: '' }])}
          className="self-start text-[#8B5CF6] text-xs font-medium hover:text-[#a78bfa] cursor-pointer transition-colors duration-150">
          + Add reference
        </button>
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
    </div>
  )
}
