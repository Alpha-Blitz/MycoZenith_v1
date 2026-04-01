import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { emailShell, ctaButton, sectionLabel, featureRow, divider } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const firstName = name?.split(' ')[0] ?? 'there'

    const body = `
      <!-- Hero -->
      <div style="text-align:center;margin-bottom:36px">
        <div style="font-size:42px;margin-bottom:14px;line-height:1">🧬</div>
        <h1 style="color:#ffffff;font-size:30px;font-weight:800;margin:0 0 10px;letter-spacing:-0.3px">Welcome, ${firstName}!</h1>
        <p style="color:#888;font-size:15px;line-height:1.7;margin:0 auto;max-width:400px">
          Your MycoZenith account is ready. We build supplements backed by peer-reviewed science — no fluff, just results.
        </p>
      </div>

      <!-- Features card -->
      <div style="background:#141414;border:1px solid #252525;border-radius:16px;padding:24px;margin-bottom:24px">
        ${sectionLabel("What's waiting for you")}
        ${featureRow('🍄', 'Premium Mushroom Extracts', "Lion's Mane, Reishi, Cordyceps — full-spectrum, standardised, lab-tested.")}
        ${featureRow('🔬', 'Research-Backed Articles', 'Deep-dives into the science behind every ingredient we use.')}
        ${featureRow('📦', 'Order Tracking', 'Place orders and track them anytime from your account dashboard.')}
        ${featureRow('🎁', 'Member Offers', 'Subscriber-only discounts, early access, and bundle deals.')}
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:28px">
        ${ctaButton('https://mycozenith.com/products', 'Explore Products')}
      </div>
      <div style="text-align:center">
        <a href="https://mycozenith.com/blog" style="color:#8B5CF6;font-size:14px;text-decoration:none;font-weight:500">Read our research articles →</a>
      </div>

      ${divider()}

      <!-- Brand promise -->
      <div style="text-align:center">
        <p style="color:#383838;font-size:12px;line-height:1.7;margin:0;font-style:italic">
          "Built on Evidence. Not on Hype."
        </p>
      </div>
    `

    const { error } = await resend.emails.send({
      from:    'MycoZenith <hello@mycozenith.com>',
      to:      email,
      subject: `Welcome to MycoZenith, ${firstName}! 🧬`,
      html:    emailShell({
        title:      'Welcome to MycoZenith',
        preheader:  'Your account is ready. Explore evidence-based mushroom supplements backed by science.',
        body,
        footerNote: 'You received this because you created a MycoZenith account.',
      }),
    })

    if (error) {
      console.error('Resend welcome error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Welcome email error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
