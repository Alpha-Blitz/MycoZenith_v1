import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { emailShell, ctaButton, ghostButton, sectionLabel, divider } from '@/lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem { name: string; quantity: number; price: number; lineTotal: number }
interface OrderEmailPayload {
  orderNumber:   string
  customerName:  string
  customerEmail: string
  items:         OrderItem[]
  subtotal:      number
  discount:      number
  shipping:      number
  total:         number
  paymentMethod: string
  address:       string
}

function fmt(n: number) {
  return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0 })
}

function buildHtml(d: OrderEmailPayload): string {
  const firstName = d.customerName.split(' ')[0] || d.customerName

  const itemRows = d.items.map(i => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;color:#d8d8d8;font-size:14px;line-height:1.4">${i.name}</td>
      <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;color:#555;font-size:13px;text-align:center;white-space:nowrap">× ${i.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;color:#e5e5e5;font-size:14px;font-weight:600;text-align:right;white-space:nowrap">${fmt(i.lineTotal)}</td>
    </tr>`).join('')

  const body = `
    <!-- Hero -->
    <div style="text-align:center;margin-bottom:32px">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;background:#1a2a1a;border:1.5px solid #2d5a2d;border-radius:18px;margin-bottom:16px;font-size:26px;line-height:60px">✅</div>
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 8px;letter-spacing:-0.3px">Order Confirmed!</h1>
      <p style="color:#888;font-size:15px;line-height:1.6;margin:0">
        Hey <strong style="color:#e0e0e0">${firstName}</strong> — your order is in. We'll get it packed and shipped soon.
      </p>
    </div>

    <!-- Order number + status -->
    <div style="background:#141414;border:1px solid #252525;border-radius:14px;padding:18px 22px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <p style="color:#555;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 4px">Order Number</p>
        <p style="color:#FF6523;font-size:17px;font-weight:800;font-family:monospace;margin:0">${d.orderNumber}</p>
      </div>
      <div style="text-align:right">
        <p style="color:#555;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 4px">Est. Delivery</p>
        <p style="color:#e5e5e5;font-size:14px;font-weight:600;margin:0">3–5 business days</p>
      </div>
    </div>

    <!-- Items -->
    <div style="background:#141414;border:1px solid #252525;border-radius:16px;padding:22px 24px;margin-bottom:16px">
      ${sectionLabel('Your Items')}
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Totals -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px">
        <tbody>
          ${d.discount > 0 ? `<tr>
            <td style="padding:5px 0;color:#606060;font-size:13px">Discount</td>
            <td style="padding:5px 0;color:#4ade80;font-size:13px;text-align:right;font-weight:500">− ${fmt(d.discount)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:5px 0;color:#606060;font-size:13px">Shipping</td>
            <td style="padding:5px 0;color:#606060;font-size:13px;text-align:right">${d.shipping === 0 ? 'Free' : fmt(d.shipping)}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;color:#ffffff;font-size:16px;font-weight:700;border-top:1px solid #252525">Total <span style="color:#555;font-size:11px;font-weight:400">(incl. 18% GST)</span></td>
            <td style="padding:12px 0 0;color:#FF6523;font-size:18px;font-weight:800;text-align:right;border-top:1px solid #252525">${fmt(d.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Address + Payment row -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td width="49%" valign="top">
          <div style="background:#141414;border:1px solid #252525;border-radius:14px;padding:18px 20px;height:100%">
            <p style="color:#555;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 8px">📦 Delivering to</p>
            <p style="color:#cccccc;font-size:13px;line-height:1.65;margin:0">${d.address}</p>
          </div>
        </td>
        <td width="2%"></td>
        <td width="49%" valign="top">
          <div style="background:#141414;border:1px solid #252525;border-radius:14px;padding:18px 20px;height:100%">
            <p style="color:#555;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 8px">💳 Payment</p>
            <p style="color:#cccccc;font-size:14px;font-weight:600;margin:0 0 4px">${d.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p style="color:#555;font-size:12px;margin:0">${d.paymentMethod === 'cod' ? 'Pay when your order arrives' : 'Payment received'}</p>
          </div>
        </td>
      </tr>
    </table>

    <!-- What's next -->
    <div style="background:#141414;border:1px solid #252525;border-radius:16px;padding:22px 24px;margin-bottom:28px">
      ${sectionLabel("What's Next", '#FF6523')}
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px">
        <div style="width:22px;height:22px;background:#FF652320;border:1.5px solid #FF652350;border-radius:6px;text-align:center;line-height:20px;font-size:11px;color:#FF6523;flex-shrink:0">✓</div>
        <span style="color:#d0d0d0;font-size:14px;padding-top:2px">Order confirmed &amp; received</span>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px">
        <div style="width:22px;height:22px;background:#1e1e1e;border:1.5px solid #303030;border-radius:6px;flex-shrink:0"></div>
        <span style="color:#606060;font-size:14px;padding-top:2px">Packed within 24 hours</span>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="width:22px;height:22px;background:#1e1e1e;border:1.5px solid #303030;border-radius:6px;flex-shrink:0"></div>
        <span style="color:#606060;font-size:14px;padding-top:2px">Shipped with tracking link via email</span>
      </div>
    </div>

    <!-- CTAs -->
    <div style="text-align:center;margin-bottom:12px">
      ${ctaButton('https://mycozenith.com/account?tab=orders', 'Track Your Order')}
    </div>
    <div style="text-align:center;margin-top:12px">
      ${ghostButton('https://mycozenith.com/products', 'Continue Shopping')}
    </div>

    ${divider()}
    <p style="color:#444;font-size:12px;text-align:center;margin:0;line-height:1.7">
      Questions? Reply to this email or write to <a href="mailto:hello@mycozenith.com" style="color:#606060;text-decoration:none">hello@mycozenith.com</a>
    </p>
  `

  return emailShell({
    title:     `Order Confirmed — ${d.orderNumber}`,
    preheader: `Your order ${d.orderNumber} is confirmed. Estimated delivery in 3–5 business days.`,
    body,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderEmailPayload = await req.json()
    if (!body.customerEmail || !body.orderNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const { error } = await resend.emails.send({
      from:    'MycoZenith <hello@mycozenith.com>',
      to:      body.customerEmail,
      subject: `Order Confirmed — ${body.orderNumber} ✓`,
      html:    buildHtml(body),
    })
    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Order confirm email error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
