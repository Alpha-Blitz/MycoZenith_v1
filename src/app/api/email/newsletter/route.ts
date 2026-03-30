import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from:    'MycoZenith <onboarding@resend.dev>',
      to:      email,
      subject: 'Welcome to MycoZenith — Evidence-Based Mushroom Supplements',
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:40px 16px;text-align:center">
    <p style="color:#8B5CF6;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px">MycoZenith</p>
    <h1 style="color:#fff;font-size:26px;font-weight:600;margin:0 0 12px">You&apos;re in.</h1>
    <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 32px">
      Welcome to the MycoZenith community. You&apos;ll be the first to know about new products, research-backed articles, and exclusive offers.
    </p>
    <a href="https://mycozenith.com/products"
       style="display:inline-block;background:#8B5CF6;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 32px;border-radius:12px">
      Shop Now
    </a>
    <p style="color:#333;font-size:12px;margin-top:40px">© 2025 MycoZenith. You can unsubscribe at any time.</p>
  </div>
</body>
</html>`,
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
