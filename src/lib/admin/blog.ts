import { createClient } from '@/lib/supabase/server'

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
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateBlogPost(id: string, payload: Record<string, unknown>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw error
}
