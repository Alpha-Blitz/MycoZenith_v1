import { createClient } from '@/lib/supabase/server'

export async function getOrders(status?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (status && status !== 'all') query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getOrderById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders').select('*, order_items(*)').eq('id', id).single()
  if (error) return null
  return data
}

export async function updateOrderStatus(id: string, status: string, trackingId?: string) {
  const supabase = await createClient()
  const update: Record<string, string> = { status }
  if (trackingId !== undefined) update.tracking_id = trackingId
  const { data, error } = await supabase
    .from('orders').update(update).eq('id', id).select().single()
  if (error) throw error
  return data
}
