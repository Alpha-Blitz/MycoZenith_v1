/**
 * Shared brand shell + helpers for all MycoZenith transactional emails.
 */

const SITE   = 'https://mycozenith.com'
const ORANGE = '#FF6523'
const PURPLE = '#8B5CF6'
const BG     = '#0D0D0D'
const CARD   = '#141414'
const BORDER = '#252525'
const MUTED  = '#606060'

/* ─── Shell ──────────────────────────────────────────────────────── */
export function emailShell({
  title,
  preheader,
  body,
  footerNote,
}: {
  title:       string
  preheader:   string
  body:        string
  footerNote?: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;padding:32px 0 48px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin:0 auto">

        <!-- Top accent bar -->
        <tr><td style="padding:0 16px">
          <div style="height:3px;background:linear-gradient(90deg,${PURPLE},${ORANGE});border-radius:3px 3px 0 0"></div>
        </td></tr>

        <!-- Main card -->
        <tr><td style="padding:0 16px">
          <div style="background:${BG};border:1px solid ${BORDER};border-top:none;border-radius:0 0 20px 20px;overflow:hidden">

            <!-- Logo bar -->
            <div style="padding:28px 32px 24px;border-bottom:1px solid ${BORDER};text-align:center">
              <a href="${SITE}" style="text-decoration:none;display:inline-block">
                <span style="font-size:13px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#ffffff">MYCO<span style="color:${ORANGE}">ZENITH</span></span>
                <span style="display:block;color:${MUTED};font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;margin-top:3px">Evidence-Based Functional Supplements</span>
              </a>
            </div>

            <!-- Body -->
            <div style="padding:36px 32px">
              ${body}
            </div>

            <!-- Footer -->
            <div style="background:#0a0a0a;border-top:1px solid ${BORDER};padding:20px 32px;text-align:center">
              ${footerNote ? `<p style="color:${MUTED};font-size:12px;line-height:1.6;margin:0 0 12px">${footerNote}</p>` : ''}
              <p style="color:#444;font-size:12px;line-height:1.6;margin:0 0 8px">
                © ${new Date().getFullYear()} MycoZenith Biologics · GSTIN: 29BHJPH3246Q1ZP
              </p>
              <p style="margin:0 0 12px">
                <a href="${SITE}/privacy" style="color:#484848;font-size:11px;text-decoration:none;margin:0 8px">Privacy</a>
                <span style="color:#333">·</span>
                <a href="${SITE}/terms" style="color:#484848;font-size:11px;text-decoration:none;margin:0 8px">Terms</a>
                <span style="color:#333">·</span>
                <a href="${SITE}/products" style="color:#484848;font-size:11px;text-decoration:none;margin:0 8px">Shop</a>
              </p>
              <!-- Social -->
              <p style="margin:0">
                <a href="https://instagram.com/mycozenith" style="display:inline-block;width:28px;height:28px;background:#1e1e1e;border-radius:8px;text-align:center;line-height:28px;color:#555;text-decoration:none;margin:0 3px;font-size:12px">IG</a>
                <a href="mailto:hello@mycozenith.com" style="display:inline-block;width:28px;height:28px;background:#1e1e1e;border-radius:8px;text-align:center;line-height:28px;color:#555;text-decoration:none;margin:0 3px;font-size:12px">✉</a>
              </p>
            </div>

          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/* ─── Helpers ────────────────────────────────────────────────────── */

/** Primary CTA button (orange) */
export function ctaButton(href: string, label: string, color = ORANGE): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
    <tr><td style="border-radius:12px;background:${color}">
      <a href="${href}" style="display:block;color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 40px;border-radius:12px;letter-spacing:0.01em;white-space:nowrap">${label}</a>
    </td></tr>
  </table>`
}

/** Ghost/outline secondary button */
export function ghostButton(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
    <tr><td style="border-radius:12px;border:1.5px solid ${BORDER}">
      <a href="${href}" style="display:block;color:#aaa;text-decoration:none;font-size:14px;font-weight:600;padding:12px 32px;border-radius:12px;white-space:nowrap">${label}</a>
    </td></tr>
  </table>`
}

/** Dark card container */
export function card(content: string): string {
  return `<div style="background:${CARD};border:1px solid ${BORDER};border-radius:16px;padding:22px 24px;margin-bottom:16px">${content}</div>`
}

/** Section heading pill */
export function sectionLabel(text: string, color = PURPLE): string {
  return `<p style="color:${color};font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 14px;display:inline-block;background:${color}18;padding:3px 10px;border-radius:20px;border:1px solid ${color}30">${text}</p>`
}

/** Label + value row for summaries */
export function kvRow(label: string, value: string, valueColor = '#e5e5e5'): string {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1e1e1e">
    <span style="color:${MUTED};font-size:13px">${label}</span>
    <span style="color:${valueColor};font-size:13px;font-weight:500">${value}</span>
  </div>`
}

/** Feature row with emoji + heading + desc */
export function featureRow(icon: string, heading: string, desc: string): string {
  return `<div style="display:flex;gap:14px;margin-bottom:18px;align-items:flex-start">
    <div style="width:36px;height:36px;background:#1a1a1a;border:1px solid ${BORDER};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;text-align:center;line-height:36px">${icon}</div>
    <div>
      <p style="color:#e8e8e8;font-size:14px;font-weight:600;margin:0 0 3px">${heading}</p>
      <p style="color:${MUTED};font-size:13px;line-height:1.55;margin:0">${desc}</p>
    </div>
  </div>`
}

/** Divider */
export function divider(): string {
  return `<div style="border-top:1px solid ${BORDER};margin:24px 0"></div>`
}
