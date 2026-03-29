import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { duplicateProduct } from '@/lib/admin/products'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).single()
  return !!data
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const product = await duplicateProduct(id)
    return NextResponse.json(product, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to duplicate product'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
