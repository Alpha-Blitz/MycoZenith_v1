'use client'

import { useState } from 'react'

const INPUT = "w-full bg-white/[0.04] border border-white/[0.1] focus:border-[#8B5CF6]/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors duration-150 placeholder-white/30"
const NUMBER_INPUT = INPUT + " admin-number-input"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
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

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={['relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer shrink-0',
          checked ? 'bg-[#8B5CF6]' : 'bg-white/[0.1]',
        ].join(' ')}
      >
        <span className={['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0',
        ].join(' ')} />
      </button>
      <span className="text-white/70 text-sm">{label}</span>
    </label>
  )
}

interface BrandSettings { siteName: string; tagline: string; supportEmail: string; phone: string }
interface ShippingSettings { freeShippingThreshold: number; flatRate: number; currency: string }
interface PaymentSettings { razorpayEnabled: boolean; codEnabled: boolean }

export default function SettingsForm({ initial }: {
  initial: {
    brand:    BrandSettings
    shipping: ShippingSettings
    payment:  PaymentSettings
  }
}) {
  const [brand, setBrand]       = useState<BrandSettings>(initial.brand)
  const [shipping, setShipping] = useState<ShippingSettings>(initial.shipping)
  const [payment, setPayment]   = useState<PaymentSettings>(initial.payment)
  const [saving, setSaving]     = useState<string | null>(null)
  const [saved, setSaved]       = useState<string | null>(null)
  const [error, setError]       = useState<string | null>(null)

  async function save(key: string, value: unknown) {
    setSaving(key)
    setError(null)
    setSaved(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Save failed') }
      setSaved(key)
      setTimeout(() => setSaved(null), 2000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(null)
    }
  }

  function SaveBtn({ k, value }: { k: string; value: unknown }) {
    return (
      <div className="flex items-center justify-end gap-3 pt-2">
        {error && saving === null && <p className="text-red-400 text-xs">{error}</p>}
        {saved === k && <p className="text-emerald-400 text-xs">Saved!</p>}
        <button onClick={() => save(k, value)} disabled={saving === k}
          className="bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-50">
          {saving === k ? 'Saving…' : 'Save'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">

      <Section title="Brand">
        <Field label="Site Name">
          <input type="text" value={brand.siteName} onChange={e => setBrand(b => ({ ...b, siteName: e.target.value }))} className={INPUT} />
        </Field>
        <Field label="Tagline">
          <input type="text" value={brand.tagline} onChange={e => setBrand(b => ({ ...b, tagline: e.target.value }))} className={INPUT} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Support Email">
            <input type="email" value={brand.supportEmail} onChange={e => setBrand(b => ({ ...b, supportEmail: e.target.value }))} className={INPUT} />
          </Field>
          <Field label="Phone">
            <input type="text" value={brand.phone} onChange={e => setBrand(b => ({ ...b, phone: e.target.value }))} className={INPUT} />
          </Field>
        </div>
        <SaveBtn k="brand" value={brand} />
      </Section>

      <Section title="Shipping">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Free Shipping Threshold (₹)">
            <input type="number" value={shipping.freeShippingThreshold}
              onChange={e => setShipping(s => ({ ...s, freeShippingThreshold: Number(e.target.value) }))} className={NUMBER_INPUT} />
          </Field>
          <Field label="Flat Rate (₹)">
            <input type="number" value={shipping.flatRate}
              onChange={e => setShipping(s => ({ ...s, flatRate: Number(e.target.value) }))} className={NUMBER_INPUT} />
          </Field>
        </div>
        <SaveBtn k="shipping" value={shipping} />
      </Section>

      <Section title="Payment Methods">
        <Toggle checked={payment.razorpayEnabled} onChange={v => setPayment(p => ({ ...p, razorpayEnabled: v }))} label="Razorpay" />
        <Toggle checked={payment.codEnabled} onChange={v => setPayment(p => ({ ...p, codEnabled: v }))} label="Cash on Delivery (COD)" />
        <SaveBtn k="payment" value={payment} />
      </Section>

    </div>
  )
}
