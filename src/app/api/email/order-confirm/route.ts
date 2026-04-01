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
  return '&#8377;' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0 })
}

function buildHtml(d: OrderEmailPayload): string {
  const firstName = d.customerName.split(' ')[0] || d.customerName

  const itemRows = d.items.map(i => `
    <tr>
      <td style="padding:13px 0;border-bottom:1px solid #1e1e1e;color:#d8d8d8;font-size:15px;line-height:1.4">${i.name}</td>
      <td style="padding:13px 0;border-bottom:1px solid #1e1e1e;color:#707070;font-size:14px;text-align:center;white-space:nowrap">&times;&nbsp;${i.quantity}</td>
      <td style="padding:13px 0;border-bottom:1px solid #1e1e1e;color:#e8e8e8;font-size:15px;font-weight:600;text-align:right;white-space:nowrap">${fmt(i.lineTotal)}</td>
    </tr>`).join('')

  const body = `
    <!-- Hero -->
    <div style="text-align:center;padding-bottom:32px">
      <div style="display:inline-block;width:64px;height:64px;background:#0f2010;border:1.5px solid #1e4020;border-radius:18px;font-size:30px;line-height:64px;margin-bottom:18px">&#9989;</div>
      <h1 style="color:#ffffff;font-size:30px;font-weight:800;margin:0 0 10px;letter-spacing:-0.5px">Order Confirmed!</h1>
      <p style="color:#aaaaaa;font-size:16px;line-height:1.65;margin:0">
        Hey <strong style="color:#e8e8e8">${firstName}</strong> &mdash; your order is in. We&apos;ll get it packed and on its way soon.
      </p>
    </div>

    <!-- Order number + delivery -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:14px;margin-bottom:20px">
      <tr>
        <td style="padding:18px 22px;border-right:1px solid #2a2a2a" width="50%">
          <p style="color:#606060;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 6px">Order Number</p>
          <p style="color:#FF6523;font-size:18px;font-weight:800;font-family:monospace,monospace;margin:0;letter-spacing:0.04em">${d.orderNumber}</p>
        </td>
        <td style="padding:18px 22px" width="50%">
          <p style="color:#606060;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 6px">Est. Delivery</p>
          <p style="color:#e8e8e8;font-size:15px;font-weight:600;margin:0">3&ndash;5 business days</p>
        </td>
      </tr>
    </table>

    <!-- Items card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:16px;margin-bottom:16px">
      <tr><td style="padding:22px 24px">
        ${sectionLabel('Your Items')}
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tbody>${itemRows}</tbody>
        </table>
        <!-- Totals -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px">
          ${d.discount > 0 ? `<tr>
            <td style="padding:6px 0;color:#909090;font-size:14px">Discount</td>
            <td style="padding:6px 0;color:#4ade80;font-size:14px;font-weight:500;text-align:right">&minus; ${fmt(d.discount)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:6px 0;color:#909090;font-size:14px">Shipping</td>
            <td style="padding:6px 0;color:#909090;font-size:14px;text-align:right">${d.shipping === 0 ? 'Free' : fmt(d.shipping)}</td>
          </tr>
          <tr>
            <td style="padding:14px 0 0;color:#ffffff;font-size:17px;font-weight:700;border-top:1px solid #2a2a2a">Total <span style="color:#606060;font-size:12px;font-weight:400">(incl. 18% GST)</span></td>
            <td style="padding:14px 0 0;color:#FF6523;font-size:19px;font-weight:800;text-align:right;border-top:1px solid #2a2a2a">${fmt(d.total)}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Address + Payment -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td width="49%" valign="top">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background:#161616;border:1px solid #2a2a2a;border-radius:14px;padding:18px 20px">
              <p style="color:#606060;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 8px">Delivering to</p>
              <p style="color:#cccccc;font-size:14px;line-height:1.65;margin:0">${d.address}</p>
            </td></tr>
          </table>
        </td>
        <td width="2%">&nbsp;</td>
        <td width="49%" valign="top">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background:#161616;border:1px solid #2a2a2a;border-radius:14px;padding:18px 20px">
              <p style="color:#606060;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 8px">Payment</p>
              <p style="color:#d8d8d8;font-size:15px;font-weight:600;margin:0 0 4px">${d.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
              <p style="color:#707070;font-size:13px;margin:0">${d.paymentMethod === 'cod' ? 'Pay when your order arrives' : 'Payment received'}</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- What's next -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:16px;margin-bottom:28px">
      <tr><td style="padding:22px 24px">
        ${sectionLabel("What&apos;s Next", '#FF6523')}
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="28" valign="top" style="padding-right:12px;padding-top:1px">
              <div style="width:22px;height:22px;background:#FF652320;border:1.5px solid #FF652550;border-radius:6px;text-align:center;font-size:11px;font-weight:700;color:#FF6523;line-height:20px">&#10003;</div>
            </td>
            <td style="padding-bottom:12px;color:#d0d0d0;font-size:15px">Order confirmed &amp; received</td>
          </tr>
          <tr>
            <td width="28" valign="top" style="padding-right:12px;padding-top:1px">
              <div style="width:22px;height:22px;background:#1e1e1e;border:1.5px solid #303030;border-radius:6px;line-height:22px">&nbsp;</div>
            </td>
            <td style="padding-bottom:12px;color:#707070;font-size:15px">Packed within 24 hours</td>
          </tr>
          <tr>
            <td width="28" valign="top" style="padding-right:12px;padding-top:1px">
              <div style="width:22px;height:22px;background:#1e1e1e;border:1.5px solid #303030;border-radius:6px;line-height:22px">&nbsp;</div>
            </td>
            <td style="color:#707070;font-size:15px">Shipped with tracking link via email</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- CTAs -->
    <div style="text-align:center;margin-bottom:14px">
      ${ctaButton('https://mycozenith.com/account?tab=orders', 'Track Your Order')}
    </div>
    <div style="text-align:center;margin-top:14px">
      ${ghostButton('https://mycozenith.com/products', 'Continue Shopping')}
    </div>

    ${divider()}
    <p style="color:#555;font-size:13px;text-align:center;margin:0;line-height:1.7">
      Questions? Reply to this email or write to <a href="mailto:hello@mycozenith.com" style="color:#777;text-decoration:none">hello@mycozenith.com</a>
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
