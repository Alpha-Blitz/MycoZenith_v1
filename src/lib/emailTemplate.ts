/**
 * Shared brand shell for all MycoZenith transactional emails.
 * Usage: emailShell({ title, preheader, body })
 */

const SITE = 'https://mycozenith.com'
const PURPLE = '#8B5CF6'
const BG = '#0a0a0a'
const CARD = '#111111'
const BORDER = '#2a2a2a'

export function emailShell({
  title,
  preheader,
  body,
}: {
  title: string
  preheader: string
  body: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>${title}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <!-- preheader text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <div style="max-width:560px;margin:0 auto;padding:40px 16px 32px">

    <!-- Logo / brand -->
    <div style="text-align:center;margin-bottom:36px">
      <a href="${SITE}" style="text-decoration:none">
        <p style="color:${PURPLE};font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;margin:0">MycoZenith</p>
      </a>
    </div>

    <!-- Dynamic body -->
    ${body}

    <!-- Footer -->
    <div style="border-top:1px solid #1e1e1e;margin-top:40px;padding-top:24px;text-align:center">
      <p style="color:#444;font-size:12px;line-height:1.6;margin:0 0 6px">
        © ${new Date().getFullYear()} MycoZenith · Mushroom supplements backed by science
      </p>
      <p style="color:#333;font-size:11px;margin:0">
        <a href="${SITE}/privacy" style="color:#555;text-decoration:none">Privacy</a>
        &nbsp;·&nbsp;
        <a href="${SITE}/terms" style="color:#555;text-decoration:none">Terms</a>
        &nbsp;·&nbsp;
        <a href="${SITE}/products" style="color:#555;text-decoration:none">Shop</a>
      </p>
    </div>

  </div>
</body>
</html>`
}

/** Reusable styled CTA button */
export function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${PURPLE};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 36px;border-radius:12px;letter-spacing:0.01em">${label}</a>`
}

/** Card container */
export function card(content: string): string {
  return `<div style="background:${CARD};border:1px solid ${BORDER};border-radius:14px;padding:22px 24px;margin-bottom:16px">${content}</div>`
}

/** Label + value row */
export function kvRow(label: string, value: string): string {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0">
    <span style="color:#666;font-size:13px">${label}</span>
    <span style="color:#e5e5e5;font-size:13px;font-weight:500">${value}</span>
  </div>`
}
