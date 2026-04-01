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
      ? `<div style="border-radius:14px;overflow:hidden;margin-bottom:24px">
           <img src="${d.coverImage}" alt="${d.postTitle}" width="100%"
             style="display:block;width:100%;height:200px;object-fit:cover;border-radius:14px" />
         </div>`
      : ''

    const body = `
      <!-- New article badge -->
      <div style="margin-bottom:16px">
        <span style="background:#8B5CF618;border:1px solid #8B5CF630;color:#8B5CF6;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;padding:4px 12px;border-radius:20px">
          New Article
        </span>
      </div>

      ${coverBlock}

      <!-- Meta -->
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px">
        <span style="background:#1e1e1e;border:1px solid #2a2a2a;color:#8B5CF6;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px">${d.category}</span>
        <span style="color:#404040;font-size:12px">${d.readTime}</span>
        <span style="color:#333;font-size:12px">·</span>
        <span style="color:#404040;font-size:12px">By ${d.authorName}</span>
      </div>

      <!-- Title -->
      <h1 style="color:#ffffff;font-size:24px;font-weight:800;line-height:1.35;margin:0 0 14px;letter-spacing:-0.2px">
        <a href="${postUrl}" style="color:#ffffff;text-decoration:none">${d.postTitle}</a>
      </h1>

      <!-- Excerpt -->
      <p style="color:#888;font-size:15px;line-height:1.75;margin:0 0 28px">${d.postExcerpt}</p>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:32px">
        ${ctaButton(postUrl, 'Read the Full Article')}
      </div>

      <!-- Separator -->
      <div style="background:#141414;border:1px solid #252525;border-radius:12px;padding:16px 20px;margin-bottom:8px;text-align:center">
        <p style="color:#555;font-size:13px;line-height:1.6;margin:0">
          📚 <strong style="color:#888">More on our blog</strong> — evidence-based deep-dives on functional mushrooms, cognitive performance, and longevity.
        </p>
        <div style="margin-top:12px">
          <a href="https://mycozenith.com/blog" style="color:#8B5CF6;font-size:13px;font-weight:600;text-decoration:none">Browse all articles →</a>
        </div>
      </div>

      ${divider()}
      <p style="color:#333;font-size:12px;text-align:center;margin:0;line-height:1.7">
        You're receiving this because you subscribed to MycoZenith research updates.
        <a href="https://mycozenith.com/unsubscribe" style="color:#484848;text-decoration:underline">Unsubscribe</a>
      </p>
    `

    const html = emailShell({
      title:     d.postTitle,
      preheader: `New article: ${d.postTitle} — ${d.postExcerpt.slice(0, 80)}…`,
      body,
      footerNote: "You're receiving this because you subscribed to MycoZenith research updates.",
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
