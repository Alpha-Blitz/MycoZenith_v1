import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { emailShell, ctaButton, divider } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, resetLink } = await req.json()
    if (!email || !resetLink) {
      return NextResponse.json({ error: 'Missing email or resetLink' }, { status: 400 })
    }

    const allowed = ['supabase.co', 'mycozenith.com']
    if (!allowed.some(domain => resetLink.includes(domain))) {
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 })
    }

    const body = `
      <!-- Hero -->
      <div style="text-align:center;margin-bottom:32px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:#1a1a2e;border:1.5px solid #2a2a5a;border-radius:18px;margin-bottom:16px;font-size:28px;line-height:64px">🔐</div>
        <h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:0 0 10px;letter-spacing:-0.3px">Reset your password</h1>
        <p style="color:#888;font-size:15px;line-height:1.7;margin:0 auto;max-width:380px">
          We received a request to reset the password for your MycoZenith account. This link expires in <strong style="color:#e5e5e5">1 hour</strong>.
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:32px">
        ${ctaButton(resetLink, 'Reset My Password', '#8B5CF6')}
      </div>

      <!-- Security note card -->
      <div style="background:#141414;border:1px solid #252525;border-radius:14px;padding:20px 22px;margin-bottom:16px">
        <p style="color:#FF6523;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 10px;display:inline-block;background:#FF652318;padding:3px 10px;border-radius:20px;border:1px solid #FF652330">Security Notice</p>
        <p style="color:#888;font-size:13px;line-height:1.65;margin:0">
          If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged and this link will expire automatically.
        </p>
      </div>

      <!-- Tips -->
      <div style="background:#141414;border:1px solid #252525;border-radius:14px;padding:20px 22px;margin-bottom:24px">
        <p style="color:#555;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 12px">Password Tips</p>
        <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px">
          <span style="color:#FF6523;font-size:12px;padding-top:1px;flex-shrink:0">→</span>
          <span style="color:#606060;font-size:13px;line-height:1.5">Use at least 12 characters with a mix of letters, numbers, and symbols</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px">
          <span style="color:#FF6523;font-size:12px;padding-top:1px;flex-shrink:0">→</span>
          <span style="color:#606060;font-size:13px;line-height:1.5">Never reuse passwords across multiple sites</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:#FF6523;font-size:12px;padding-top:1px;flex-shrink:0">→</span>
          <span style="color:#606060;font-size:13px;line-height:1.5">Never share this link with anyone</span>
        </div>
      </div>

      ${divider()}
      <p style="color:#404040;font-size:12px;text-align:center;margin:0;line-height:1.7">
        Trouble clicking the button? Copy and paste this URL into your browser:<br>
        <span style="color:#383838;font-size:11px;word-break:break-all">${resetLink}</span>
      </p>
    `

    const { error } = await resend.emails.send({
      from:    'MycoZenith <hello@mycozenith.com>',
      to:      email,
      subject: 'Reset your MycoZenith password 🔐',
      html:    emailShell({
        title:     'Reset your password',
        preheader: 'Click to reset your MycoZenith account password. Link expires in 1 hour.',
        body,
        footerNote: 'You received this because a password reset was requested for this email address.',
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
