import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { createBlogPost } from '@/lib/admin/blog'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).single()
  return !!data
}

async function sendNewBlogEmails(post: Record<string, unknown>) {
  try {
    const svc = createServiceClient()
    const { data: subscribers } = await svc.from('newsletter_subscribers').select('email')
    if (!subscribers?.length) return

    const author = post.author as { name?: string } | null
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mycozenith.com'}/api/email/new-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}`,
      },
      body: JSON.stringify({
        recipientEmails: subscribers.map(s => s.email),
        postTitle:   post.title,
        postSlug:    post.slug,
        postExcerpt: post.excerpt ?? '',
        coverImage:  post.image ?? undefined,
        authorName:  author?.name ?? 'MycoZenith Research',
        readTime:    post.read_time ?? '',
        category:    post.category ?? '',
      }),
    })
  } catch (e) {
    console.error('sendNewBlogEmails error:', e)
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const payload = await req.json()
    const post = await createBlogPost(payload)
    if (payload.status === 'published') {
      sendNewBlogEmails(post as Record<string, unknown>)
    }
    return NextResponse.json(post, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to create post'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
