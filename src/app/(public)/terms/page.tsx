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

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#171717]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 sm:pb-28">

        {/* Header */}
        <div className="mb-10 pb-10 border-b border-white/[0.07]">
          <nav className="flex items-center gap-2 text-sm text-[#8B5CF6]/60 mb-8">
            <Link href="/" className="hover:text-[#8B5CF6] transition-colors duration-200">Home</Link>
            <span className="text-[#FF6523]/60">›</span>
            <span className="text-[#FF6523]">Terms of Service</span>
          </nav>
          <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase">Legal</span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mt-3 mb-3">Terms of Service</h1>
          <p className="text-white/35 text-sm">Last updated: {UPDATED}</p>
        </div>

        <p className="text-white/55 text-sm leading-relaxed mb-10">
          These Terms of Service ("Terms") govern your use of the MycoZenith website and the purchase of products from us. By accessing our website or placing an order, you agree to be bound by these Terms. Please read them carefully.
        </p>

        <Section title="1. Eligibility">
          <p>You must be at least 18 years of age to purchase products from MycoZenith. By placing an order, you represent that you meet this age requirement and that you are legally capable of entering into a binding contract.</p>
        </Section>

        <Section title="2. Products and Descriptions">
          <p>We take care to ensure all product descriptions, images, and specifications are accurate. However, we do not warrant that descriptions are error-free or complete. If a product received materially differs from its description, you may return it under our Returns Policy.</p>
          <p>Our products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. Please consult a healthcare professional before use if you are pregnant, nursing, have a medical condition, or are on medication.</p>
        </Section>

        <Section title="3. Pricing and Payment">
          <p>All prices are listed in Indian Rupees (₹) and are inclusive of applicable GST. We reserve the right to change prices at any time. The price charged will be the price displayed at the time of order placement.</p>
          <p>Payment is due in full at the time of purchase. We accept major debit/credit cards and UPI through our secure payment processor. We do not store payment card details.</p>
        </Section>

        <Section title="4. Orders and Cancellations">
          <p>Once an order is placed, you will receive a confirmation email. We reserve the right to refuse or cancel any order at our discretion — for example, if a product is out of stock or if we suspect fraudulent activity. You will be notified and fully refunded in such cases.</p>
          <p>Orders may be cancelled before dispatch. Once shipped, cancellations are not possible, but you may initiate a return upon receipt.</p>
        </Section>

        <Section title="5. Shipping and Delivery">
          <p>We ship across India. Delivery times are estimates and may vary due to carrier delays, public holidays, or unforeseen circumstances. MycoZenith is not liable for delays caused by third-party carriers.</p>
          <p>Risk of loss and title for products pass to you upon delivery. Free shipping is available on orders above ₹999.</p>
        </Section>

        <Section title="6. Returns and Refunds">
          <p>If you receive a damaged, defective, or incorrect product, contact us within 7 days of delivery at <a href="mailto:mycozenith@gmail.com" className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors">mycozenith@gmail.com</a> with photographic evidence. We will arrange a replacement or full refund at our discretion.</p>
          <p>Opened or used products cannot be returned unless defective. We do not accept returns based on change of mind.</p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>All content on this website — including text, images, logos, and product formulations — is the exclusive property of MycoZenith and is protected under applicable intellectual property laws. You may not reproduce, distribute, or use our content without prior written permission.</p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>To the fullest extent permitted by law, MycoZenith shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our products or website. Our total liability shall not exceed the purchase price of the product in question.</p>
        </Section>

        <Section title="9. Governing Law">
          <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.</p>
        </Section>

        <Section title="10. Changes to Terms">
          <p>We may update these Terms from time to time. Continued use of our website after changes constitutes acceptance of the updated Terms. The "Last updated" date at the top of this page indicates when the Terms were last revised.</p>
        </Section>

        <Section title="11. Contact">
          <p>For questions about these Terms, contact us at <a href="mailto:mycozenith@gmail.com" className="text-[#8B5CF6] hover:text-[#a78bfa] transition-colors">mycozenith@gmail.com</a> or +91 80952 55685.</p>
        </Section>

      </div>
    </div>
  )
}
