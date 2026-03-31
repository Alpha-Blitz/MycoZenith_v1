'use client'

function fmt(n: number) {
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

interface OrderItem { product_name: string; unit_price: number; quantity: number; line_total: number }
interface InvoiceOrder {
  order_number: string
  created_at: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pincode: string
  country: string
  subtotal: number
  discount: number
  shipping: number
  total: number
  payment_method?: string
  order_items: OrderItem[]
}

export default function InvoiceButton({ order }: { order: InvoiceOrder }) {
  function printInvoice() {
    const GST_RATE = 0.18
    const taxable = Math.round(order.total / (1 + GST_RATE))
    const gst     = order.total - taxable
    const cgst    = Math.round(gst / 2)
    const sgst    = gst - cgst
    const date    = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    const rows = order.order_items.map(i => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px">${i.product_name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;text-align:center">${i.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;text-align:right">${fmt(i.unit_price)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;text-align:right;font-weight:600">${fmt(i.line_total)}</td>
      </tr>`).join('')

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${order.order_number}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; padding: 48px; font-size: 14px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #111; }
    .brand { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .brand-sub { font-size: 12px; color: #666; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-meta .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; }
    .invoice-meta .value { font-size: 16px; font-weight: 700; margin-top: 2px; }
    .invoice-meta .date { font-size: 12px; color: #666; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 36px; }
    .section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #888; margin-bottom: 8px; font-weight: 600; }
    .section-value { font-size: 13px; line-height: 1.6; color: #333; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #f5f5f5; }
    thead th { padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; font-weight: 600; text-align: left; }
    thead th:not(:first-child) { text-align: center; }
    thead th:last-child { text-align: right; }
    .totals { margin-left: auto; width: 260px; }
    .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; color: #555; }
    .totals-row.total { font-size: 15px; font-weight: 700; color: #111; padding-top: 10px; margin-top: 6px; border-top: 2px solid #111; }
    .totals-row.gst { font-size: 12px; color: #888; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; text-align: center; }
    .badge { display: inline-block; background: #f0f0f0; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 600; }
    @media print { body { padding: 32px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">MycoZenith</div>
      <div class="brand-sub">mycozenith.com · hello@mycozenith.com</div>
      <div class="brand-sub" style="margin-top:2px">GSTIN: 29BHJPH3246Q1ZP</div>
    </div>
    <div class="invoice-meta">
      <div class="label">Tax Invoice</div>
      <div class="value">${order.order_number}</div>
      <div class="date">${date}</div>
    </div>
  </div>

  <div class="grid">
    <div>
      <div class="section-label">Bill To</div>
      <div class="section-value">
        <strong>${order.customer_name}</strong><br>
        ${order.customer_email}<br>
        ${order.customer_phone ? order.customer_phone + '<br>' : ''}
        ${order.address_line1}${order.address_line2 ? ', ' + order.address_line2 : ''}<br>
        ${order.city}, ${order.state} – ${order.pincode}<br>
        ${order.country}
      </div>
    </div>
    <div>
      <div class="section-label">Payment Details</div>
      <div class="section-value">
        <span class="badge">${order.payment_method?.toUpperCase() === 'COD' ? 'Cash on Delivery' : (order.payment_method ?? 'COD')}</span><br><br>
        <span style="font-size:12px;color:#888">HSN Code: 2106</span>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Price</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Subtotal</span><span>${fmt(order.subtotal)}</span></div>
    ${order.discount > 0 ? `<div class="totals-row"><span>Discount</span><span>−${fmt(order.discount)}</span></div>` : ''}
    <div class="totals-row"><span>Shipping</span><span>${order.shipping === 0 ? 'Free' : fmt(order.shipping)}</span></div>
    <div class="totals-row gst"><span>Taxable Value</span><span>${fmt(taxable)}</span></div>
    <div class="totals-row gst"><span>CGST @ 9%</span><span>${fmt(cgst)}</span></div>
    <div class="totals-row gst"><span>SGST @ 9%</span><span>${fmt(sgst)}</span></div>
    <div class="totals-row total"><span>Total (incl. 18% GST)</span><span>${fmt(order.total)}</span></div>
  </div>

  <div class="footer">
    This is a computer-generated invoice and does not require a signature. · © ${new Date().getFullYear()} MycoZenith
  </div>

  <script>window.onload = () => { window.print() }</script>
</body>
</html>`

    const win = window.open('', '_blank')
    if (win) {
      win.document.write(html)
      win.document.close()
    }
  }

  return (
    <button
      type="button"
      onClick={printInvoice}
      className="inline-flex items-center gap-2 border border-white/[0.1] text-white/60 hover:text-white hover:border-white/25 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
      Print Invoice
    </button>
  )
}
