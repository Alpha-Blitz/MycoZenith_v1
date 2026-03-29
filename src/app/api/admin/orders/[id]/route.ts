import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateOrderStatus } from '@/lib/admin/orders'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).single()
  return !!data
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const { status, tracking_id } = await req.json()
    const order = await updateOrderStatus(id, status, tracking_id)
    return NextResponse.json(order)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to update order'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
