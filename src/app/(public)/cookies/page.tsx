import Link from 'next/link'

const UPDATED = 'March 28, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="text-white/55 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

const COOKIE_TYPES = [
  {
    name: 'Strictly Necessary',
    purpose: 'Essential for the website to function. Includes session management, security tokens, and shopping cart state.',
    examples: 'Session ID, CSRF token, cart data',
    canDisable: false,
  },
  {
    name: 'Analytics',
    purpose: 'Help us understand how visitors interact with our site so we can improve performance and content.',
    examples: 'Google Analytics (_ga, _gid), page view tracking',
    canDisable: true,
  },
  {
    name: 'Functional',
    purpose: 'Remember your preferences to provide a personalised experience.',
    examples: 'Language preference, popup dismiss state, recently viewed products',
    canDisable: true,
  },
  {
    name: 'Marketing',
    purpose: 'Used to deliver relevant advertising and track campaign effectiveness. Only enabled with your consent.',
    examples: 'Meta Pixel, Google Ads conversion tag',
    canDisable: true,
  },
]

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#171717]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 sm:pb-28">

        {/* Header */}
        <div className="mb-10 pb-10 border-b border-white/[0.07]">
          <nav className="flex items-center gap-2 text-sm text-[#8B5CF6]/60 mb-8">
            <Link href="/" className="hover:text-[#8B5CF6] transition-colors duration-200">Home</Link>
            <span className="text-[#F97316]/60">›</span>
            <span className="text-[#F97316]">Cookie Policy</span>
          </nav>
          <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Legal</span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mt-3 mb-3">Cookie Policy</h1>
          <p className="text-white/35 text-sm">Last updated: {UPDATED}</p>
        </div>

        <p className="text-white/55 text-sm leading-relaxed mb-10">
          This Cookie Policy explains what cookies are, how MycoZenith uses them, and how you can manage your preferences. By continuing to use our website, you consent to our use of cookies as described in this policy.
        </p>

        <Section title="1. What Are Cookies?">
          <p>Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently and to provide information to site owners. Cookies can be "session" cookies (deleted when you close your browser) or "persistent" cookies (remain on your device for a set period).</p>
          <p>Similar technologies like web beacons, pixels, and local storage serve related purposes and are also covered by this policy.</p>
        </Section>

        <Section title="2. How We Use Cookies">
          <p>We use cookies for four broad purposes: site functionality, analytics, personalisation, and marketing. The table below describes each category.</p>
        </Section>

        {/* Cookie type table */}
        <div className="mb-10 flex flex-col gap-3">
          {COOKIE_TYPES.map((type) => (
            <div key={type.name} className="bg-[#0F0F0F] border border-white/[0.07] rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-white font-semibold text-sm">{type.name}</h3>
                <span className={`text-[10px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border ${
                  type.canDisable
                    ? 'bg-white/[0.05] border-white/[0.1] text-white/40'
                    : 'bg-[#8B5CF6]/10 border-[#8B5CF6]/25 text-[#8B5CF6]'
                }`}>
                  {type.canDisable ? 'Optional' : 'Required'}
                </span>
              </div>
              <p className="text-white/50 text-xs leading-relaxed mb-2">{type.purpose}</p>
              <p className="text-white/30 text-xs"><span className="text-white/45">Examples:</span> {type.examples}</p>
            </div>
          ))}
        </div>

        <Section title="3. Third-Party Cookies">
          <p>Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. Third parties include Google Analytics, Meta (Facebook), and our payment processors. Please refer to their respective privacy and cookie policies for more information.</p>
        </Section>

        <Section title="4. Managing Your Preferences">
          <p>You can manage or disable cookies through your browser settings. Most browsers allow you to refuse all cookies, accept only certain cookies, or receive a notification before a cookie is set. Note that disabling certain cookies may impact the functionality of our website.</p>
          <p>Browser-specific instructions:</p>
          <ul className="list-disc list-inside space-y-1 text-white/45">
            <li><strong className="text-white/60">Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
            <li><strong className="text-white/60">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong className="text-white/60">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong className="text-white/60">Edge:</strong> Settings → Cookies and site permissions</li>
          </ul>
        </Section>

        <Section title="5. Cookie Retention">
          <p>Session cookies are deleted when you close your browser. Persistent cookies remain on your device for varying durations — typically between 30 days and 2 years — depending on their purpose. You can delete all cookies at any time through your browser settings.</p>
        </Section>

        <Section title="6. Changes to This Policy">
          <p>We may update this Cookie Policy as our website or the law changes. The "Last updated" date at the top of this page indicates the most recent revision. Continued use of our website after changes constitutes your acceptance.</p>
        </Section>

        <Section title="7. Contact">
          <p>If you have questions about our use of cookies, contact us at <a href="mailto:mycozenith@gmail.com" className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors">mycozenith@gmail.com</a>.</p>
          <p>For more information about how we handle your personal data, see our <Link href="/privacy" className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors">Privacy Policy</Link>.</p>
        </Section>

      </div>
    </div>
  )
}
