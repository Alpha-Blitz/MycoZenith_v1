import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProduct } from '@/lib/admin/products'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).single()
  return !!data
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const payload = await req.json()
    const product = await createProduct(payload)
    return NextResponse.json(product, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to create product'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
