import { getAllSettings } from '@/lib/admin/settings'
import SettingsForm from './SettingsForm'

const DEFAULT_BRAND    = { siteName: 'MycoZenith', tagline: 'Built on Evidence. Not on Hype.', supportEmail: '', phone: '' }
const DEFAULT_SHIPPING = { freeShippingThreshold: 999, flatRate: 99, currency: 'INR' }
const DEFAULT_PAYMENT  = { razorpayEnabled: false, codEnabled: true }

export default async function SettingsPage() {
  const settings = await getAllSettings()

  const initial = {
    brand:    (settings.brand    as typeof DEFAULT_BRAND)    ?? DEFAULT_BRAND,
    shipping: (settings.shipping as typeof DEFAULT_SHIPPING) ?? DEFAULT_SHIPPING,
    payment:  (settings.payment  as typeof DEFAULT_PAYMENT)  ?? DEFAULT_PAYMENT,
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-white/40 text-sm">Site configuration</p>
      </div>
      <SettingsForm initial={initial} />
    </div>
  )
}
