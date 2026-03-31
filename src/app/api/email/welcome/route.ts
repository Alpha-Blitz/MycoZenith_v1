import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { emailShell, ctaButton } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const firstName = name?.split(' ')[0] ?? 'there'

    const body = `
      <div style="text-align:center;margin-bottom:32px">
        <h1 style="color:#ffffff;font-size:26px;font-weight:600;margin:0 0 10px">Welcome, ${firstName}!</h1>
        <p style="color:#666;font-size:15px;line-height:1.7;margin:0">
          Your MycoZenith account is all set. We create functional mushroom supplements
          backed by peer-reviewed research — no fluff, just results.
        </p>
      </div>

      <div style="background:#111;border:1px solid #2a2a2a;border-radius:14px;padding:24px;margin-bottom:28px">
        <p style="color:#888;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 16px">What's waiting for you</p>
        ${[
          ['🍄', 'Premium Extracts', 'Lion\'s Mane, Reishi, Cordyceps — full-spectrum, lab tested.'],
          ['📖', 'Research Articles', 'Deep-dives into the science behind every ingredient.'],
          ['🛒', 'Order Tracking', 'View and manage your orders anytime from your account.'],
        ].map(([icon, heading, desc]) => `
          <div style="display:flex;gap:14px;margin-bottom:16px;align-items:flex-start">
            <span style="font-size:20px;line-height:1">${icon}</span>
            <div>
              <p style="color:#e5e5e5;font-size:14px;font-weight:600;margin:0 0 3px">${heading}</p>
              <p style="color:#666;font-size:13px;line-height:1.5;margin:0">${desc}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="text-align:center;margin-bottom:8px">
        ${ctaButton('https://mycozenith.com/products', 'Explore Products')}
      </div>
      <p style="text-align:center;margin:16px 0 0">
        <a href="https://mycozenith.com/blog" style="color:#8B5CF6;font-size:13px;text-decoration:none">Read our research articles →</a>
      </p>
    `

    const { error } = await resend.emails.send({
      from:    'MycoZenith <hello@mycozenith.com>',
      to:      email,
      subject: `Welcome to MycoZenith, ${firstName}!`,
      html:    emailShell({
        title:      `Welcome to MycoZenith`,
        preheader:  'Your account is ready. Explore evidence-based mushroom supplements.',
        body,
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
