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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#171717]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 sm:pb-28">

        {/* Header */}
        <div className="mb-10 pb-10 border-b border-white/[0.07]">
          <nav className="flex items-center gap-2 text-sm text-white/35 mb-8">
            <Link href="/" className="hover:text-white/60 transition-colors duration-200">Home</Link>
            <span className="text-white/20">›</span>
            <span className="text-white/50">Privacy Policy</span>
          </nav>
          <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Legal</span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mt-3 mb-3">Privacy Policy</h1>
          <p className="text-white/35 text-sm">Last updated: {UPDATED}</p>
        </div>

        <p className="text-white/55 text-sm leading-relaxed mb-10">
          MycoZenith ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights in relation to it. By using our website or purchasing our products, you agree to this policy.
        </p>

        <Section title="1. Information We Collect">
          <p><strong className="text-white/80">Personal Information:</strong> When you place an order or create an account, we collect your name, email address, shipping address, phone number, and payment information (processed securely via our payment partner — we do not store card details).</p>
          <p><strong className="text-white/80">Usage Data:</strong> We collect information about how you interact with our website, including pages visited, time spent, browser type, and IP address.</p>
          <p><strong className="text-white/80">Communications:</strong> If you subscribe to our newsletter or contact us, we retain those communications to respond and improve our service.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your information to process and fulfill orders, send order confirmations and shipping updates, respond to customer service inquiries, send marketing emails (only with your consent), improve our website and products, and comply with legal obligations.</p>
          <p>We do not sell, rent, or trade your personal information to any third parties for their marketing purposes.</p>
        </Section>

        <Section title="3. Sharing of Information">
          <p>We share your data only as necessary with trusted service providers who help us operate our business — including payment processors, shipping partners, and email service providers — under strict confidentiality agreements. We may also disclose data when required by law.</p>
        </Section>

        <Section title="4. Cookies">
          <p>We use cookies and similar technologies to enhance your browsing experience, remember your preferences, analyse traffic, and serve relevant content. You may control cookies through your browser settings. See our <Link href="/cookies" className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors">Cookie Policy</Link> for full details.</p>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Order records are retained for 7 years as required under Indian tax law. Marketing data is retained until you unsubscribe or request deletion.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data (subject to legal retention requirements), opt out of marketing communications at any time, and lodge a complaint with the relevant data protection authority.</p>
          <p>To exercise any of these rights, contact us at <a href="mailto:mycozenith@gmail.com" className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors">mycozenith@gmail.com</a>.</p>
        </Section>

        <Section title="7. Security">
          <p>We implement industry-standard technical and organisational measures to protect your data. All payment transactions are encrypted via SSL. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
        </Section>

        <Section title="8. Third-Party Links">
          <p>Our website may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review the privacy policies of any external sites you visit.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. Continued use of our website after changes constitutes your acceptance of the updated policy.</p>
        </Section>

        <Section title="10. Contact">
          <p>For any privacy-related questions or requests, please contact us at <a href="mailto:mycozenith@gmail.com" className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors">mycozenith@gmail.com</a> or call +91 80952 55685.</p>
        </Section>

      </div>
    </div>
  )
}
