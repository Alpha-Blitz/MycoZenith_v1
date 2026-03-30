import Razorpay from 'razorpay'
import { NextRequest, NextResponse } from 'next/server'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Razorpay expects amount in paise (smallest unit)
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),
      currency,
      receipt:  receipt ?? `mz_${Date.now()}`,
    })

    return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency })
  } catch (e) {
    console.error('Razorpay create-order error:', e)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
