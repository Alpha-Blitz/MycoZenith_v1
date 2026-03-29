import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setSetting } from '@/lib/admin/settings'

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
    const { key, value } = await req.json()
    await setSetting(key, value)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to save setting'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
