import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/admin/blog'
import { sendNewBlogEmails } from '@/lib/sendNewBlogEmails'

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

    // Only email subscribers when transitioning draft → published
    const wasDraft = payload.status === 'published'
      ? (await getBlogPostById(id))?.status === 'draft'
      : false

    const post = await updateBlogPost(id, payload)

    if (wasDraft) {
      await sendNewBlogEmails(post as Record<string, unknown>)
    }

    return NextResponse.json(post)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to update post'
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
    await deleteBlogPost(id)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to delete post'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
