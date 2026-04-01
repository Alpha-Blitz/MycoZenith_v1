import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

// Reads use anon client (RLS allows SELECT); writes use service client to bypass RLS
export async function getBlogPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, category, image, status, published_at, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getBlogPostById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function createBlogPost(payload: Record<string, unknown>) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateBlogPost(id: string, payload: Record<string, unknown>) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts').update(payload).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteBlogPost(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
