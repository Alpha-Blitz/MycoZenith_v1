import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { emailShell, ctaButton, sectionLabel, divider } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const body = `
      <!-- Hero -->
      <div style="text-align:center;margin-bottom:36px">
        <div style="font-size:42px;margin-bottom:14px;line-height:1">🍄</div>
        <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 10px;letter-spacing:-0.3px">You're in.</h1>
        <p style="color:#888;font-size:15px;line-height:1.7;margin:0 auto;max-width:400px">
          Welcome to the MycoZenith community. You'll be the first to know about new research, product drops, and exclusive offers.
        </p>
      </div>

      <!-- What to expect card -->
      <div style="background:#141414;border:1px solid #252525;border-radius:16px;padding:24px;margin-bottom:24px">
        ${sectionLabel('What to expect')}

        <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:14px">
          <div style="width:36px;height:36px;background:#1a1a2e;border:1px solid #2a2a4a;border-radius:10px;text-align:center;line-height:36px;font-size:17px;flex-shrink:0">🔬</div>
          <div>
            <p style="color:#e8e8e8;font-size:14px;font-weight:600;margin:0 0 3px">Research Updates</p>
            <p style="color:#606060;font-size:13px;line-height:1.55;margin:0">Deep-dives into the science of functional mushrooms — delivered clearly.</p>
          </div>
        </div>

        <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:14px">
          <div style="width:36px;height:36px;background:#1a1a1a;border:1px solid #252525;border-radius:10px;text-align:center;line-height:36px;font-size:17px;flex-shrink:0">🆕</div>
          <div>
            <p style="color:#e8e8e8;font-size:14px;font-weight:600;margin:0 0 3px">Early Product Access</p>
            <p style="color:#606060;font-size:13px;line-height:1.55;margin:0">New launches announced to subscribers first — before anyone else.</p>
          </div>
        </div>

        <div style="display:flex;gap:14px;align-items:flex-start">
          <div style="width:36px;height:36px;background:#1f1a14;border:1px solid #3a2a1a;border-radius:10px;text-align:center;line-height:36px;font-size:17px;flex-shrink:0">🎁</div>
          <div>
            <p style="color:#e8e8e8;font-size:14px;font-weight:600;margin:0 0 3px">Exclusive Offers</p>
            <p style="color:#606060;font-size:13px;line-height:1.55;margin:0">Subscriber-only discounts, bundles, and limited-time deals.</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:14px">
        ${ctaButton('https://mycozenith.com/products', 'Shop Now')}
      </div>
      <div style="text-align:center">
        <a href="https://mycozenith.com/blog" style="color:#8B5CF6;font-size:14px;text-decoration:none;font-weight:500">Browse research articles →</a>
      </div>

      ${divider()}
      <p style="color:#333;font-size:12px;text-align:center;margin:0;line-height:1.7">
        You subscribed with ${email}. Don't want updates?
        <a href="https://mycozenith.com/unsubscribe" style="color:#484848;text-decoration:underline">Unsubscribe here</a>.
      </p>
    `

    const { error } = await resend.emails.send({
      from:    'MycoZenith <hello@mycozenith.com>',
      to:      email,
      subject: "Welcome to MycoZenith — You're in 🍄",
      html:    emailShell({
        title:     'Welcome to MycoZenith',
        preheader: "You're subscribed. First access to new articles, products, and exclusive offers.",
        body,
        footerNote: "You're receiving this because you subscribed to MycoZenith updates.",
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
