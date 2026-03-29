import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateProduct, deleteProduct } from '@/lib/admin/products'

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
    const payload = await req.json()
    const product = await updateProduct(id, payload)
    return NextResponse.json(product)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to update product'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    await deleteProduct(id)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to delete product'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
