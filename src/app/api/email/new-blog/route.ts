import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { emailShell, ctaButton } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

interface NewBlogPayload {
  recipientEmails: string[]   // list of subscriber emails
  postTitle:       string
  postSlug:        string
  postExcerpt:     string
  coverImage?:     string     // absolute URL
  authorName:      string
  readTime:        string     // e.g. "6 min read"
  category:        string
}

export async function POST(req: NextRequest) {
  try {
    // Require internal secret so only your admin can trigger this
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
      ? `<div style="border-radius:12px;overflow:hidden;margin-bottom:20px">
           <img src="${d.coverImage}" alt="${d.postTitle}" width="100%"
             style="display:block;width:100%;height:auto;max-height:240px;object-fit:cover;border-radius:12px" />
         </div>`
      : ''

    const body = `
      <div style="margin-bottom:8px">
        <span style="background:#1a1a1a;border:1px solid #2a2a2a;color:#8B5CF6;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:4px 10px;border-radius:20px">
          New Article
        </span>
      </div>

      ${coverBlock}

      <p style="color:#666;font-size:12px;margin:0 0 8px">
        ${d.category} · ${d.readTime} · By ${d.authorName}
      </p>

      <h1 style="color:#ffffff;font-size:22px;font-weight:600;line-height:1.35;margin:0 0 12px">
        <a href="${postUrl}" style="color:#ffffff;text-decoration:none">${d.postTitle}</a>
      </h1>

      <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 28px">${d.postExcerpt}</p>

      <div style="text-align:center;margin-bottom:32px">
        ${ctaButton(postUrl, 'Read Article')}
      </div>

      <div style="background:#111;border:1px solid #2a2a2a;border-radius:12px;padding:16px 20px">
        <p style="color:#555;font-size:12px;line-height:1.6;margin:0">
          You're receiving this because you subscribed to MycoZenith research updates.
          <a href="https://mycozenith.com/unsubscribe" style="color:#555;text-decoration:underline">Unsubscribe</a>
        </p>
      </div>
    `

    const html = emailShell({
      title:     d.postTitle,
      preheader: `New article: ${d.postTitle} — ${d.postExcerpt.slice(0, 80)}…`,
      body,
    })

    // Resend supports batch — send one email per recipient to avoid spam issues
    const results = await Promise.allSettled(
      d.recipientEmails.map(to =>
        resend.emails.send({
          from:    'MycoZenith Research <research@mycozenith.com>',
          to,
          subject: `New Article: ${d.postTitle}`,
          html,
        })
      )
    )

    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({
      success: true,
      sent: results.length - failed,
      failed,
    })
  } catch (e) {
    console.error('New blog email error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
