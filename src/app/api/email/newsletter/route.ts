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
      <div style="text-align:center;padding-bottom:32px">
        <div style="font-size:44px;line-height:1;margin-bottom:16px">&#127812;</div>
        <h1 style="color:#ffffff;font-size:30px;font-weight:800;margin:0 0 10px;letter-spacing:-0.5px">You&apos;re in.</h1>
        <p style="color:#aaaaaa;font-size:16px;line-height:1.7;margin:0 auto;max-width:400px">
          Welcome to the MycoZenith community. You&apos;ll be the first to know about new research, product drops, and exclusive offers.
        </p>
      </div>

      <!-- What to expect -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:16px;margin-bottom:24px">
        <tr><td style="padding:24px">
          ${sectionLabel('What to expect')}

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
            <tr>
              <td width="48" valign="top" style="padding-right:14px;padding-top:1px">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="width:40px;height:40px;background:#0e0e1e;border:1px solid #1e1e3a;border-radius:11px;text-align:center;vertical-align:middle;font-size:19px;padding:9px 0" align="center">&#128300;</td></tr>
                </table>
              </td>
              <td valign="top">
                <p style="color:#e8e8e8;font-size:15px;font-weight:700;margin:0 0 4px">Research Updates</p>
                <p style="color:#909090;font-size:14px;line-height:1.6;margin:0">Deep-dives into the science of functional mushrooms &mdash; delivered clearly.</p>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
            <tr>
              <td width="48" valign="top" style="padding-right:14px;padding-top:1px">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="width:40px;height:40px;background:#161616;border:1px solid #2a2a2a;border-radius:11px;text-align:center;vertical-align:middle;font-size:19px;padding:9px 0" align="center">&#128226;</td></tr>
                </table>
              </td>
              <td valign="top">
                <p style="color:#e8e8e8;font-size:15px;font-weight:700;margin:0 0 4px">Early Product Access</p>
                <p style="color:#909090;font-size:14px;line-height:1.6;margin:0">New launches announced to subscribers first &mdash; before anyone else.</p>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="48" valign="top" style="padding-right:14px;padding-top:1px">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="width:40px;height:40px;background:#1a1208;border:1px solid #302010;border-radius:11px;text-align:center;vertical-align:middle;font-size:19px;padding:9px 0" align="center">&#127873;</td></tr>
                </table>
              </td>
              <td valign="top">
                <p style="color:#e8e8e8;font-size:15px;font-weight:700;margin:0 0 4px">Exclusive Offers</p>
                <p style="color:#909090;font-size:14px;line-height:1.6;margin:0">Subscriber-only discounts, bundles, and limited-time deals.</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <!-- CTAs -->
      <div style="text-align:center;margin-bottom:16px">
        ${ctaButton('https://mycozenith.com/products', 'Shop Now')}
      </div>
      <p style="text-align:center;margin:0">
        <a href="https://mycozenith.com/blog" style="color:#8B5CF6;font-size:15px;text-decoration:none;font-weight:600">Browse research articles &rarr;</a>
      </p>

      ${divider()}
      <p style="color:#444;font-size:13px;text-align:center;margin:0;line-height:1.7">
        You subscribed with ${email}. Don&apos;t want updates?
        <a href="https://mycozenith.com/unsubscribe" style="color:#606060;text-decoration:underline">Unsubscribe here</a>.
      </p>
    `

    const { error } = await resend.emails.send({
      from:    'MycoZenith <hello@mycozenith.com>',
      to:      email,
      subject: "Welcome to MycoZenith — You're in",
      html:    emailShell({
        title:      'Welcome to MycoZenith',
        preheader:  "You're subscribed. First access to new articles, products, and exclusive offers.",
        body,
        footerNote: "You&apos;re receiving this because you subscribed to MycoZenith updates.",
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
