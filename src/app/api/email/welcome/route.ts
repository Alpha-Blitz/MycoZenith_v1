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
      <div style="text-align:center;padding-bottom:32px">
        <div style="font-size:44px;line-height:1;margin-bottom:16px">&#129514;</div>
        <h1 style="color:#ffffff;font-size:30px;font-weight:800;margin:0 0 10px;letter-spacing:-0.5px">Welcome, ${firstName}!</h1>
        <p style="color:#aaaaaa;font-size:16px;line-height:1.7;margin:0 auto;max-width:400px">
          Your MycoZenith account is ready. We build supplements backed by peer-reviewed science &mdash; no fluff, just results.
        </p>
      </div>

      <!-- Features card -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:16px;margin-bottom:24px">
        <tr><td style="padding:24px">
          ${sectionLabel("What&apos;s waiting for you")}
          ${featureRow('&#127812;', 'Premium Mushroom Extracts', "Lion&apos;s Mane, Reishi, Cordyceps &mdash; full-spectrum, standardised, lab-tested.")}
          ${featureRow('&#128300;', 'Research-Backed Articles', 'Deep-dives into the science behind every ingredient we use.')}
          ${featureRow('&#128230;', 'Order Tracking', 'Place and track orders anytime from your account dashboard.')}
          ${featureRow('&#127873;', 'Member Offers', 'Subscriber-only discounts, early access, and bundle deals.')}
        </td></tr>
      </table>

      <!-- CTAs -->
      <div style="text-align:center;margin-bottom:20px">
        ${ctaButton('https://mycozenith.com/products', 'Explore Products')}
      </div>
      <p style="text-align:center;margin:0 0 0">
        <a href="https://mycozenith.com/blog" style="color:#8B5CF6;font-size:15px;text-decoration:none;font-weight:600">Read our research articles &rarr;</a>
      </p>

      ${divider()}
      <p style="color:#444;font-size:13px;text-align:center;margin:0;font-style:italic">&ldquo;Built on Evidence. Not on Hype.&rdquo;</p>
    `

    const { error } = await resend.emails.send({
      from:    'MycoZenith <hello@mycozenith.com>',
      to:      email,
      subject: `Welcome to MycoZenith, ${firstName}!`,
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
