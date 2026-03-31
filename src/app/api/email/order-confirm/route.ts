import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

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
  return `₹${n.toLocaleString('en-IN')}`
}

function buildHtml(d: OrderEmailPayload): string {
  const rows = d.items.map(i =>
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#e5e5e5;font-size:14px">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#999;font-size:14px;text-align:center">×${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#e5e5e5;font-size:14px;text-align:right">${fmt(i.lineTotal)}</td>
    </tr>`
  ).join('')

  const discountRow = d.discount > 0
    ? `<tr><td style="padding:4px 0;color:#999;font-size:13px">Discount</td><td></td><td style="padding:4px 0;color:#22c55e;font-size:13px;text-align:right">−${fmt(d.discount)}</td></tr>`
    : ''

  const shippingRow = `<tr><td style="padding:4px 0;color:#999;font-size:13px">Shipping</td><td></td><td style="padding:4px 0;color:#999;font-size:13px;text-align:right">${d.shipping === 0 ? 'Free' : fmt(d.shipping)}</td></tr>`

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px">
      <p style="color:#8B5CF6;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px">MycoZenith</p>
      <h1 style="color:#ffffff;font-size:24px;font-weight:600;margin:0 0 8px">Order Confirmed!</h1>
      <p style="color:#666;font-size:14px;margin:0">Thank you, ${d.customerName}. Your order is on its way.</p>
    </div>

    <!-- Order number chip -->
    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center">
      <span style="color:#666;font-size:13px">Order number</span>
      <span style="color:#8B5CF6;font-size:14px;font-weight:600">#${d.orderNumber}</span>
    </div>

    <!-- Items -->
    <div style="background:#111;border:1px solid #2a2a2a;border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="color:#888;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px">Your Items</p>
      <table style="width:100%;border-collapse:collapse">
        <tbody>${rows}</tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
        <tbody>
          ${discountRow}
          ${shippingRow}
          <tr>
            <td style="padding:8px 0 0;color:#fff;font-size:15px;font-weight:600">Total</td>
            <td></td>
            <td style="padding:8px 0 0;color:#8B5CF6;font-size:15px;font-weight:700;text-align:right">${fmt(d.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delivery -->
    <div style="background:#111;border:1px solid #2a2a2a;border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="color:#888;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px">Delivery Address</p>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0">${d.address}</p>
    </div>

    <!-- Payment -->
    <div style="background:#111;border:1px solid #2a2a2a;border-radius:12px;padding:16px 20px;margin-bottom:32px;display:flex;justify-content:space-between;align-items:center">
      <span style="color:#666;font-size:13px">Payment</span>
      <span style="color:#e5e5e5;font-size:13px;font-weight:500">${d.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
    </div>

    <!-- Footer -->
    <p style="color:#444;font-size:12px;text-align:center;margin:0">
      Questions? Reply to this email or visit mycozenith.com<br>
      <span style="color:#333">© 2025 MycoZenith. All rights reserved.</span>
    </p>
  </div>
</body>
</html>`
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
      subject: `Order Confirmed — #${body.orderNumber}`,
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
