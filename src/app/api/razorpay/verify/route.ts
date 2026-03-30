import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface CartItem {
  slug:     string
  name:     string
  image:    string
  price:    number
  quantity: number
}

interface VerifyPayload {
  razorpay_order_id:   string
  razorpay_payment_id: string
  razorpay_signature:  string
  // Order data to persist
  customerName:  string
  customerEmail: string
  customerPhone: string
  addr1:         string
  addr2?:        string
  city:          string
  state:         string
  pincode:       string
  subtotal:      number
  discount:      number
  shipping:      number
  total:         number
  items:         CartItem[]
  userId?:       string
}

export async function POST(req: NextRequest) {
  try {
    const body: VerifyPayload = await req.json()

    // 1. Verify signature
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
      .digest('hex')

    if (expected !== body.razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // 2. Insert order into Supabase
    const supabase = await createClient()
    const orderNumber = `MZ-${Date.now().toString(36).toUpperCase()}`

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number:   orderNumber,
        user_id:        body.userId ?? null,
        customer_name:  body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        address_line1:  body.addr1,
        address_line2:  body.addr2 ?? null,
        city:           body.city,
        state:          body.state,
        pincode:        body.pincode,
        country:        'India',
        subtotal:       body.subtotal,
        discount:       body.discount,
        shipping:       body.shipping,
        total:          body.total,
        currency:       'INR',
        payment_method: 'razorpay',
        payment_id:     body.razorpay_payment_id,
        paid_at:        new Date().toISOString(),
        status:         'confirmed',
      })
      .select('id, order_number')
      .single()

    if (orderErr) throw orderErr

    const orderItems = body.items.map((item) => ({
      order_id:      order.id,
      product_name:  item.name,
      product_slug:  item.slug,
      product_image: item.image,
      unit_price:    item.price,
      quantity:      item.quantity,
      line_total:    item.price * item.quantity,
    }))

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
    if (itemsErr) throw itemsErr

    // 3. Send confirmation email (fire-and-forget)
    fetch(`${req.nextUrl.origin}/api/email/order-confirm`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber:   order.order_number,
        customerName:  body.customerName,
        customerEmail: body.customerEmail,
        items:         body.items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, lineTotal: i.price * i.quantity })),
        subtotal:      body.subtotal,
        discount:      body.discount,
        shipping:      body.shipping,
        total:         body.total,
        paymentMethod: 'razorpay',
        address:       [body.addr1, body.addr2, body.city, body.state, body.pincode, 'India'].filter(Boolean).join(', '),
      }),
    }).catch(console.error)

    return NextResponse.json({ success: true, orderNumber: order.order_number })
  } catch (e) {
    console.error('Razorpay verify error:', e)
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 })
  }
}
