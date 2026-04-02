import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/service'
import { emailShell, ctaButton, divider } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

interface BlogPost {
  title?: unknown
  slug?: unknown
  excerpt?: unknown
  image?: unknown
  author?: { name?: string } | null
  read_time?: unknown
  category?: unknown
  [key: string]: unknown
}

export async function sendNewBlogEmails(post: BlogPost) {
  try {
    const svc = createServiceClient()
    const { data: subscribers } = await svc.from('newsletter_subscribers').select('email')
    if (!subscribers?.length) return

    const postTitle  = String(post.title ?? '')
    const postSlug   = String(post.slug ?? '')
    const postExcerpt = String(post.excerpt ?? '')
    const coverImage = post.image ? String(post.image) : undefined
    const authorName = post.author?.name ?? 'MycoZenith Research'
    const readTime   = String(post.read_time ?? '')
    const category   = String(post.category ?? '')
    const postUrl    = `https://mycozenith.com/blog/${postSlug}`

    const coverBlock = coverImage
      ? `<div style="border-radius:14px;overflow:hidden;margin-bottom:24px;line-height:0">
           <img src="${coverImage.startsWith('/') ? `https://mycozenith.com${coverImage}` : coverImage}" alt="${postTitle}" width="100%" style="display:block;width:100%;height:auto;max-height:220px;object-fit:cover;border-radius:14px">
         </div>`
      : ''

    const body = `
      <p style="margin:0 0 18px">
        <span style="background:#8B5CF61a;border:1px solid #8B5CF633;color:#8B5CF6;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:5px 14px;border-radius:20px">New Article</span>
      </p>

      ${coverBlock}

      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px">
        <tr>
          <td style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:20px;padding:4px 12px;color:#8B5CF6;font-size:12px;font-weight:600">${category}</td>
          <td style="padding:0 8px;color:#3a3a3a;font-size:14px">&middot;</td>
          <td style="color:#666666;font-size:13px">${readTime}</td>
          <td style="padding:0 8px;color:#3a3a3a;font-size:14px">&middot;</td>
          <td style="color:#666666;font-size:13px">By ${authorName}</td>
        </tr>
      </table>

      <h1 style="color:#ffffff;font-size:26px;font-weight:800;line-height:1.35;margin:0 0 14px;letter-spacing:-0.3px">
        <a href="${postUrl}" style="color:#ffffff;text-decoration:none">${postTitle}</a>
      </h1>

      <p style="color:#aaaaaa;font-size:16px;line-height:1.75;margin:0 0 28px">${postExcerpt}</p>

      <div style="text-align:center;margin-bottom:32px">
        ${ctaButton(postUrl, 'Read the Full Article')}
      </div>

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
      title:     postTitle,
      preheader: `New article: ${postTitle} — ${postExcerpt.slice(0, 80)}…`,
      body,
    })

    // Send in batches of 50 to stay within Resend rate limits
    const BATCH = 50
    for (let i = 0; i < subscribers.length; i += BATCH) {
      const batch = subscribers.slice(i, i + BATCH)
      await Promise.allSettled(
        batch.map(({ email }) =>
          resend.emails.send({
            from:    'MycoZenith Research <hello@mycozenith.com>',
            to:      email,
            subject: `New Article: ${postTitle}`,
            html,
          })
        )
      )
    }

    console.log(`New blog emails sent to ${subscribers.length} subscribers for: ${postTitle}`)
  } catch (e) {
    console.error('sendNewBlogEmails error:', e)
  }
}
