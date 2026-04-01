import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { emailShell, ctaButton, divider } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

interface NewBlogPayload {
  recipientEmails: string[]
  postTitle:       string
  postSlug:        string
  postExcerpt:     string
  coverImage?:     string
  authorName:      string
  readTime:        string
  category:        string
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.INTERNAL_API_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const d: NewBlogPayload = await req.json()
    if (!d.recipientEmails?.length || !d.postTitle || !d.postSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const postUrl = `https://mycozenith.com/blog/${d.postSlug}`

    const coverBlock = d.coverImage
      ? `<div style="border-radius:14px;overflow:hidden;margin-bottom:24px;line-height:0">
           <img src="${d.coverImage}" alt="${d.postTitle}" width="100%" style="display:block;width:100%;height:auto;max-height:220px;object-fit:cover;border-radius:14px">
         </div>`
      : ''

    const body = `
      <!-- Badge -->
      <p style="margin:0 0 18px">
        <span style="background:#8B5CF61a;border:1px solid #8B5CF633;color:#8B5CF6;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:5px 14px;border-radius:20px">New Article</span>
      </p>

      ${coverBlock}

      <!-- Meta row -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px">
        <tr>
          <td style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:20px;padding:4px 12px;color:#8B5CF6;font-size:12px;font-weight:600">${d.category}</td>
          <td style="padding:0 8px;color:#3a3a3a;font-size:14px">&middot;</td>
          <td style="color:#666666;font-size:13px">${d.readTime}</td>
          <td style="padding:0 8px;color:#3a3a3a;font-size:14px">&middot;</td>
          <td style="color:#666666;font-size:13px">By ${d.authorName}</td>
        </tr>
      </table>

      <!-- Title -->
      <h1 style="color:#ffffff;font-size:26px;font-weight:800;line-height:1.35;margin:0 0 14px;letter-spacing:-0.3px">
        <a href="${postUrl}" style="color:#ffffff;text-decoration:none">${d.postTitle}</a>
      </h1>

      <!-- Excerpt -->
      <p style="color:#aaaaaa;font-size:16px;line-height:1.75;margin:0 0 28px">${d.postExcerpt}</p>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:32px">
        ${ctaButton(postUrl, 'Read the Full Article')}
      </div>

      <!-- Browse more -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:14px;margin-bottom:8px">
        <tr><td style="padding:18px 22px;text-align:center">
          <p style="color:#888888;font-size:14px;line-height:1.6;margin:0 0 12px">
            &#128218; <strong style="color:#bbbbbb">More on our blog</strong> &mdash; evidence-based deep-dives on functional mushrooms, cognitive performance, and longevity.
          </p>
          <a href="https://mycozenith.com/blog" style="color:#8B5CF6;font-size:14px;font-weight:700;text-decoration:none">Browse all articles &rarr;</a>
        </td></tr>
      </table>

      ${divider()}
      <p style="color:#444;font-size:13px;text-align:center;margin:0;line-height:1.7">
        You&apos;re receiving this because you subscribed to MycoZenith research updates.
        <a href="https://mycozenith.com/unsubscribe" style="color:#606060;text-decoration:underline">Unsubscribe</a>
      </p>
    `

    const html = emailShell({
      title:      d.postTitle,
      preheader:  `New article: ${d.postTitle} — ${d.postExcerpt.slice(0, 80)}…`,
      body,
    })

    const results = await Promise.allSettled(
      d.recipientEmails.map(to =>
        resend.emails.send({
          from:    'MycoZenith Research <hello@mycozenith.com>',
          to,
          subject: `New Article: ${d.postTitle}`,
          html,
        })
      )
    )

    const failed = results.filter(r => r.status === 'rejected').length
    return NextResponse.json({ success: true, sent: results.length - failed, failed })
  } catch (e) {
    console.error('New blog email error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
