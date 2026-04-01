import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/service'
import { emailShell, ctaButton, divider } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const supabase = createServiceClient()
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: 'https://mycozenith.com/auth/callback' },
    })

    if (error || !data?.properties?.action_link) {
      console.error('generateLink error:', error)
      return NextResponse.json({ error: 'No account found for that email.' }, { status: 400 })
    }

    const resetLink = data.properties.action_link

    const body = `
      <!-- Hero -->
      <div style="text-align:center;padding-bottom:32px">
        <div style="display:inline-block;width:64px;height:64px;background:#0e0e1e;border:1.5px solid #1e1e3a;border-radius:18px;font-size:30px;line-height:64px;margin-bottom:18px">&#128272;</div>
        <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 10px;letter-spacing:-0.5px">Reset your password</h1>
        <p style="color:#aaaaaa;font-size:16px;line-height:1.7;margin:0 auto;max-width:380px">
          We received a request to reset the password for your MycoZenith account. This link expires in <strong style="color:#e8e8e8">1 hour</strong>.
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:32px">
        ${ctaButton(resetLink, 'Reset My Password', '#8B5CF6')}
      </div>

      <!-- Security notice -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
        <tr><td style="background:#161616;border:1px solid #2a2a2a;border-left:3px solid #FF6523;border-radius:0 14px 14px 0;padding:18px 22px">
          <p style="color:#FF6523;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 8px">Security Notice</p>
          <p style="color:#999999;font-size:14px;line-height:1.65;margin:0">
            If you didn&apos;t request a password reset, you can safely ignore this email &mdash; your password will remain unchanged and this link will expire automatically.
          </p>
        </td></tr>
      </table>

      <!-- Password tips -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:14px;margin-bottom:24px">
        <tr><td style="padding:18px 22px">
          <p style="color:#606060;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 14px">Tips for a strong password</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="16" valign="top" style="color:#FF6523;font-size:13px;padding-right:10px;padding-bottom:10px">&rarr;</td>
              <td style="color:#909090;font-size:14px;line-height:1.55;padding-bottom:10px">Use at least 12 characters with a mix of letters, numbers &amp; symbols</td>
            </tr>
            <tr>
              <td width="16" valign="top" style="color:#FF6523;font-size:13px;padding-right:10px;padding-bottom:10px">&rarr;</td>
              <td style="color:#909090;font-size:14px;line-height:1.55;padding-bottom:10px">Never reuse passwords across multiple sites</td>
            </tr>
            <tr>
              <td width="16" valign="top" style="color:#FF6523;font-size:13px;padding-right:10px">&rarr;</td>
              <td style="color:#909090;font-size:14px;line-height:1.55">Never share this reset link with anyone</td>
            </tr>
          </table>
        </td></tr>
      </table>

      ${divider()}
      <p style="color:#505050;font-size:13px;text-align:center;margin:0;line-height:1.7">
        Trouble clicking the button? Copy and paste this URL into your browser:<br>
        <span style="color:#444;font-size:12px;word-break:break-all">${resetLink}</span>
      </p>
    `

    const { error: emailError } = await resend.emails.send({
      from:    'MycoZenith <hello@mycozenith.com>',
      to:      email,
      subject: 'Reset your MycoZenith password',
      html:    emailShell({
        title:      'Reset your password',
        preheader:  'Click to reset your MycoZenith account password. Link expires in 1 hour.',
        body,
        footerNote: 'You received this because a password reset was requested for this email address.',
      }),
    })

    if (emailError) {
      console.error('Resend reset-password error:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Reset password route error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
