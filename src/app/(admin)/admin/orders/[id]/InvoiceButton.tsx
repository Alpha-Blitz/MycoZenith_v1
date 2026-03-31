'use client'

function fmt(n: number) {
  return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
    const GST_RATE  = 0.18
    const taxable   = Math.round(order.total / (1 + GST_RATE))
    const gst       = order.total - taxable
    const cgst      = Math.round(gst / 2)
    const sgst      = gst - cgst
    const date      = new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    const payLabel  = order.payment_method?.toUpperCase() === 'COD' ? 'Cash on Delivery' : (order.payment_method ?? 'Cash on Delivery')
    const year      = new Date(order.created_at).getFullYear()

    const rows = order.order_items.map((i, idx) => `
      <tr class="${idx % 2 === 0 ? 'row-even' : 'row-odd'}">
        <td class="td-item">${i.product_name}</td>
        <td class="td-center">2106</td>
        <td class="td-right">${i.quantity}</td>
        <td class="td-right">${fmt(i.unit_price)}</td>
        <td class="td-right fw6">${fmt(i.line_total)}</td>
      </tr>`).join('')

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Tax Invoice — ${order.order_number}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 12px;
      color: #1a1a1a;
      background: #fff;
      padding: 40px 48px 48px;
      line-height: 1.5;
    }

    /* ── Top stripe ── */
    .stripe {
      height: 5px;
      background: #111;
      margin: -40px -48px 36px;
    }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1.5px solid #222;
    }
    .brand-name {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #111;
    }
    .brand-tagline {
      font-size: 10px;
      color: #777;
      margin-top: 3px;
      letter-spacing: 0.02em;
    }
    .brand-address {
      font-size: 10.5px;
      color: #555;
      margin-top: 10px;
      line-height: 1.7;
    }
    .invoice-block { text-align: right; }
    .invoice-title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: #111;
    }
    .invoice-sub {
      font-size: 10.5px;
      color: #777;
      margin-top: 4px;
      letter-spacing: 0.02em;
    }
    .invoice-num {
      font-size: 13px;
      font-weight: 600;
      color: #111;
      margin-top: 6px;
    }

    /* ── Meta chips row ── */
    .meta-row {
      display: flex;
      gap: 0;
      border: 1.5px solid #222;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 28px;
    }
    .meta-cell {
      flex: 1;
      padding: 10px 14px;
      border-right: 1.5px solid #222;
    }
    .meta-cell:last-child { border-right: none; }
    .meta-label {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #888;
      margin-bottom: 3px;
    }
    .meta-value {
      font-size: 11.5px;
      font-weight: 600;
      color: #111;
    }

    /* ── Party grid ── */
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      border: 1.5px solid #222;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 28px;
    }
    .party {
      padding: 14px 16px;
    }
    .party:first-child { border-right: 1.5px solid #222; }
    .party-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #888;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e5e5e5;
    }
    .party-name {
      font-size: 12.5px;
      font-weight: 700;
      color: #111;
      margin-bottom: 4px;
    }
    .party-detail {
      font-size: 11px;
      color: #444;
      line-height: 1.7;
    }
    .gstin-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      color: #333;
      background: #f3f3f3;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 1px 6px;
      margin-top: 6px;
    }

    /* ── Items table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #222;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 0;
    }
    thead tr {
      background: #111;
    }
    thead th {
      padding: 10px 12px;
      font-size: 9.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #fff;
      text-align: left;
    }
    thead th.th-right { text-align: right; }
    thead th.th-center { text-align: center; }
    .row-even { background: #fff; }
    .row-odd  { background: #fafafa; }
    .td-item   { padding: 10px 12px; font-size: 11.5px; color: #222; border-bottom: 1px solid #e8e8e8; }
    .td-center { padding: 10px 12px; font-size: 11.5px; color: #555; text-align: center; border-bottom: 1px solid #e8e8e8; }
    .td-right  { padding: 10px 12px; font-size: 11.5px; color: #222; text-align: right; border-bottom: 1px solid #e8e8e8; }
    .fw6 { font-weight: 600; }
    tr:last-child td { border-bottom: none; }

    /* ── Totals ── */
    .totals-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      margin-bottom: 28px;
    }
    .totals {
      width: 300px;
      border: 1.5px solid #222;
      border-radius: 6px;
      overflow: hidden;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 14px;
      border-bottom: 1px solid #e8e8e8;
      font-size: 11.5px;
      color: #444;
    }
    .totals-row:last-child { border-bottom: none; }
    .totals-row.subtotal-row { background: #fafafa; }
    .totals-row.gst-row { font-size: 10.5px; color: #777; }
    .totals-row.total-row {
      background: #111;
      color: #fff;
      font-size: 12.5px;
      font-weight: 700;
      padding: 11px 14px;
    }
    .totals-row .lbl { }
    .totals-row .val { font-weight: 500; }
    .totals-row.total-row .val { font-weight: 700; }

    /* ── Notes ── */
    .notes {
      border: 1.5px solid #222;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 28px;
      display: flex;
      gap: 40px;
    }
    .notes-col { flex: 1; }
    .notes-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #888;
      margin-bottom: 4px;
    }
    .notes-val {
      font-size: 11px;
      color: #333;
    }

    /* ── Footer ── */
    .footer {
      border-top: 1.5px solid #222;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-note {
      font-size: 10px;
      color: #999;
      font-style: italic;
    }
    .footer-brand {
      font-size: 10px;
      font-weight: 600;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    @media print {
      body { padding: 24px 32px 32px; }
      .stripe { margin: -24px -32px 28px; }
    }
  </style>
</head>
<body>
  <div class="stripe"></div>

  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand-name">MycoZenith Biologics</div>
      <div class="brand-tagline">Evidence-Based Functional Mushroom Supplements</div>
      <div class="brand-address">
        hello@mycozenith.com · mycozenith.com<br>
        GSTIN: 29BHJPH3246Q1ZP &nbsp;·&nbsp; HSN: 2106
      </div>
    </div>
    <div class="invoice-block">
      <div class="invoice-title">Tax Invoice</div>
      <div class="invoice-sub">Financial Year ${year}–${year + 1}</div>
      <div class="invoice-num">${order.order_number}</div>
      <div class="invoice-sub" style="margin-top:3px">${date}</div>
    </div>
  </div>

  <!-- Meta row -->
  <div class="meta-row">
    <div class="meta-cell">
      <div class="meta-label">Invoice No.</div>
      <div class="meta-value">${order.order_number}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Invoice Date</div>
      <div class="meta-value">${date}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Payment Mode</div>
      <div class="meta-value">${payLabel}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Place of Supply</div>
      <div class="meta-value">${order.state}</div>
    </div>
  </div>

  <!-- Bill To / Sold By -->
  <div class="parties">
    <div class="party">
      <div class="party-label">Sold By</div>
      <div class="party-name">MycoZenith Biologics</div>
      <div class="party-detail">
        hello@mycozenith.com<br>
        +91 80952 55685<br>
        India
      </div>
      <div class="gstin-tag">GSTIN: 29BHJPH3246Q1ZP</div>
    </div>
    <div class="party">
      <div class="party-label">Bill To / Ship To</div>
      <div class="party-name">${order.customer_name}</div>
      <div class="party-detail">
        ${order.customer_email}<br>
        ${order.customer_phone ? order.customer_phone + '<br>' : ''}
        ${order.address_line1}${order.address_line2 ? ', ' + order.address_line2 : ''}<br>
        ${order.city}, ${order.state} – ${order.pincode}<br>
        ${order.country}
      </div>
    </div>
  </div>

  <!-- Items -->
  <table>
    <thead>
      <tr>
        <th style="width:45%">Description</th>
        <th class="th-center" style="width:10%">HSN</th>
        <th class="th-right" style="width:8%">Qty</th>
        <th class="th-right" style="width:16%">Unit Rate</th>
        <th class="th-right" style="width:16%">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <!-- Totals -->
  <div class="totals-wrap">
    <div class="totals">
      <div class="totals-row subtotal-row"><span class="lbl">Subtotal</span><span class="val">${fmt(order.subtotal)}</span></div>
      ${order.discount > 0 ? `<div class="totals-row"><span class="lbl">Discount</span><span class="val" style="color:#d33">− ${fmt(order.discount)}</span></div>` : ''}
      <div class="totals-row"><span class="lbl">Shipping</span><span class="val">${order.shipping === 0 ? 'Free' : fmt(order.shipping)}</span></div>
      <div class="totals-row" style="border-top:1.5px solid #ccc;margin-top:2px"><span class="lbl">Taxable Value</span><span class="val">${fmt(taxable)}</span></div>
      <div class="totals-row gst-row"><span class="lbl">CGST @ 9%</span><span class="val">${fmt(cgst)}</span></div>
      <div class="totals-row gst-row"><span class="lbl">SGST @ 9%</span><span class="val">${fmt(sgst)}</span></div>
      <div class="totals-row total-row"><span class="lbl">Total (Incl. GST)</span><span class="val">${fmt(order.total)}</span></div>
    </div>
  </div>

  <!-- Notes -->
  <div class="notes">
    <div class="notes-col">
      <div class="notes-label">Payment Terms</div>
      <div class="notes-val">${payLabel}</div>
    </div>
    <div class="notes-col">
      <div class="notes-label">Tax Registration</div>
      <div class="notes-val">GSTIN: 29BHJPH3246Q1ZP</div>
    </div>
    <div class="notes-col">
      <div class="notes-label">HSN Code</div>
      <div class="notes-val">2106 — Food Preparations</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-note">This is a computer-generated invoice and does not require a physical signature.</div>
    <div class="footer-brand">MycoZenith Biologics © ${new Date().getFullYear()}</div>
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
