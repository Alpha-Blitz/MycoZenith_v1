import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { emailShell, ctaButton, card } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, resetLink } = await req.json()

    if (!email || !resetLink) {
      return NextResponse.json({ error: 'Missing email or resetLink' }, { status: 400 })
    }

    // Basic URL validation — must be a Supabase or site reset URL
    const allowed = ['supabase.co', 'mycozenith.com']
    const isAllowed = allowed.some(domain => resetLink.includes(domain))
    if (!isAllowed) {
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 })
    }

    const body = `
      <div style="text-align:center;margin-bottom:28px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:14px;margin-bottom:16px;font-size:24px">🔐</div>
        <h1 style="color:#ffffff;font-size:24px;font-weight:600;margin:0 0 10px">Reset your password</h1>
        <p style="color:#666;font-size:14px;line-height:1.7;margin:0">
          We received a request to reset the password for your MycoZenith account.<br>
          Click the button below — this link expires in <strong style="color:#e5e5e5">1 hour</strong>.
        </p>
      </div>

      <div style="text-align:center;margin-bottom:28px">
        ${ctaButton(resetLink, 'Reset Password')}
      </div>

      ${card(`
        <p style="color:#888;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px">Didn't request this?</p>
        <p style="color:#666;font-size:13px;line-height:1.6;margin:0">
          If you didn't ask to reset your password, you can safely ignore this email.
          Your password will remain unchanged and this link will expire automatically.
        </p>
      `)}

      <p style="text-align:center;color:#444;font-size:12px;margin-top:8px">
        For security, never share this link with anyone.
      </p>
    `

    const { error } = await resend.emails.send({
      from:    'MycoZenith <onboarding@resend.dev>',
      to:      email,
      subject: 'Reset your MycoZenith password',
      html:    emailShell({
        title:     'Reset your password',
        preheader: 'Click to reset your MycoZenith account password. Link expires in 1 hour.',
        body,
      }),
    })

    if (error) {
      console.error('Resend reset-password error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Reset password email error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
