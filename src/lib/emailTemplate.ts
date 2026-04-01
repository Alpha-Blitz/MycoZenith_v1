/**
 * Shared brand shell + helpers for all MycoZenith transactional emails.
 * Uses table-based layout throughout — no flex/gap (breaks Outlook + many clients).
 */

const SITE   = 'https://mycozenith.com'
const ORANGE = '#FF6523'
const PURPLE = '#8B5CF6'
const BG     = '#0D0D0D'
const CARD   = '#161616'
const BORDER = '#2a2a2a'
const TEXT   = '#e8e8e8'
const MUTED  = '#909090'
const DIM    = '#606060'

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
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808">
    <tr><td style="padding:32px 16px 48px" align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">

        <!-- Gradient accent bar -->
        <tr><td style="height:4px;background:linear-gradient(90deg,${PURPLE},${ORANGE});border-radius:4px 4px 0 0;font-size:0;line-height:0">&nbsp;</td></tr>

        <!-- Main card -->
        <tr><td style="background:${BG};border:1px solid ${BORDER};border-top:none;border-radius:0 0 20px 20px">

          <!-- Logo bar -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:28px 32px 22px;border-bottom:1px solid ${BORDER};text-align:center">
              <a href="${SITE}" style="text-decoration:none">
                <span style="font-size:15px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#ffffff">MYCO<span style="color:${ORANGE}">ZENITH</span></span><br>
                <span style="font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:${DIM}">Evidence-Based Functional Supplements</span>
              </a>
            </td></tr>
          </table>

          <!-- Body -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:36px 32px">
              ${body}
            </td></tr>
          </table>

          <!-- Footer -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background:#0a0a0a;border-top:1px solid ${BORDER};border-radius:0 0 20px 20px;padding:22px 32px;text-align:center">
              ${footerNote ? `<p style="color:${MUTED};font-size:13px;line-height:1.6;margin:0 0 14px">${footerNote}</p>` : ''}
              <p style="color:#484848;font-size:12px;line-height:1.6;margin:0 0 8px">
                &copy; ${new Date().getFullYear()} MycoZenith Biologics &nbsp;&middot;&nbsp; GSTIN: 29BHJPH3246Q1ZP
              </p>
              <p style="margin:0 0 14px">
                <a href="${SITE}/privacy" style="color:#555;font-size:12px;text-decoration:none">Privacy</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE}/terms" style="color:#555;font-size:12px;text-decoration:none">Terms</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE}/products" style="color:#555;font-size:12px;text-decoration:none">Shop</a>
              </p>
              <p style="margin:0">
                <a href="https://instagram.com/mycozenith" style="display:inline-block;background:#1e1e1e;border-radius:8px;padding:5px 10px;color:#666;text-decoration:none;font-size:11px;font-weight:600;margin:0 3px">Instagram</a>
                <a href="mailto:hello@mycozenith.com" style="display:inline-block;background:#1e1e1e;border-radius:8px;padding:5px 10px;color:#666;text-decoration:none;font-size:11px;font-weight:600;margin:0 3px">Email Us</a>
              </p>
            </td></tr>
          </table>

        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/* ─── Helpers ────────────────────────────────────────────────────── */

/** Primary CTA button */
export function ctaButton(href: string, label: string, color = ORANGE): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
    <tr><td style="border-radius:12px;background:${color}">
      <a href="${href}" style="display:block;color:#fff;text-decoration:none;font-size:16px;font-weight:700;padding:15px 44px;border-radius:12px;letter-spacing:0.01em;white-space:nowrap">${label}</a>
    </td></tr>
  </table>`
}

/** Ghost/outline secondary button */
export function ghostButton(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
    <tr><td style="border-radius:12px;border:1.5px solid #383838">
      <a href="${href}" style="display:block;color:#bbb;text-decoration:none;font-size:15px;font-weight:600;padding:13px 36px;border-radius:12px;white-space:nowrap">${label}</a>
    </td></tr>
  </table>`
}

/** Dark card container */
export function card(content: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
    <tr><td style="background:${CARD};border:1px solid ${BORDER};border-radius:16px;padding:22px 24px">
      ${content}
    </td></tr>
  </table>`
}

/** Section heading pill */
export function sectionLabel(text: string, color = PURPLE): string {
  return `<p style="margin:0 0 16px"><span style="color:${color};font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;background:${color}1a;padding:4px 12px;border-radius:20px;border:1px solid ${color}33">${text}</span></p>`
}

/** Feature row — table-based for Outlook compatibility */
export function featureRow(icon: string, heading: string, desc: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
    <tr>
      <td width="48" valign="top" style="padding-right:14px;padding-top:1px">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr><td style="width:40px;height:40px;background:#1c1c1c;border:1px solid ${BORDER};border-radius:11px;text-align:center;vertical-align:middle;font-size:19px;padding:9px 0" align="center">${icon}</td></tr>
        </table>
      </td>
      <td valign="top">
        <p style="color:${TEXT};font-size:15px;font-weight:700;margin:0 0 4px;line-height:1.3">${heading}</p>
        <p style="color:${MUTED};font-size:14px;line-height:1.6;margin:0">${desc}</p>
      </td>
    </tr>
  </table>`
}

/** Label + value row */
export function kvRow(label: string, value: string, valueColor = TEXT): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid #1e1e1e">
    <tr>
      <td style="padding:7px 0;color:${MUTED};font-size:14px">${label}</td>
      <td style="padding:7px 0;color:${valueColor};font-size:14px;font-weight:500;text-align:right">${value}</td>
    </tr>
  </table>`
}

/** Divider */
export function divider(): string {
  return `<div style="border-top:1px solid ${BORDER};margin:28px 0"></div>`
}
