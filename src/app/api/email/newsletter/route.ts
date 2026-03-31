import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { emailShell, ctaButton } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const body = `
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:36px;margin-bottom:12px">🍄</div>
        <h1 style="color:#ffffff;font-size:24px;font-weight:600;margin:0 0 10px">You&apos;re in.</h1>
        <p style="color:#666;font-size:15px;line-height:1.7;margin:0">
          Welcome to the MycoZenith community. You&apos;ll be the first to know about
          new research articles, product drops, and exclusive offers.
        </p>
      </div>

      <div style="background:#111;border:1px solid #2a2a2a;border-radius:14px;padding:22px 24px;margin-bottom:28px">
        <p style="color:#888;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 14px">What to expect</p>
        ${[
          ['🔬', 'Research updates — deep-dives into the science of functional mushrooms'],
          ['🆕', 'New product launches — first access before anyone else'],
          ['🎁', 'Exclusive offers — subscriber-only discounts and bundles'],
        ].map(([icon, text]) => `
          <div style="display:flex;gap:12px;margin-bottom:10px;align-items:flex-start">
            <span style="font-size:16px;line-height:1.4">${icon}</span>
            <span style="color:#999;font-size:13px;line-height:1.6">${text}</span>
          </div>
        `).join('')}
      </div>

      <div style="text-align:center;margin-bottom:8px">
        ${ctaButton('https://mycozenith.com/products', 'Shop Now')}
      </div>
      <p style="text-align:center;margin:14px 0 0">
        <a href="https://mycozenith.com/blog" style="color:#8B5CF6;font-size:13px;text-decoration:none">Read our research articles →</a>
      </p>
    `

    const { error } = await resend.emails.send({
      from:    'MycoZenith <onboarding@resend.dev>',
      to:      email,
      subject: 'Welcome to MycoZenith — You\'re in',
      html:    emailShell({
        title:     'Welcome to MycoZenith',
        preheader: 'You\'re subscribed. First access to new articles, products, and offers.',
        body,
      }),
    })

    if (error) {
      console.error('Resend newsletter error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Newsletter email error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
