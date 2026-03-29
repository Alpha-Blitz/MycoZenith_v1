import { createClient } from '@/lib/supabase/server'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getProductById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function createProduct(payload: Record<string, unknown>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateProduct(id: string, payload: Record<string, unknown>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function duplicateProduct(id: string) {
  const supabase = await createClient()
  const { data: orig } = await supabase.from('products').select('*').eq('id', id).single()
  if (!orig) throw new Error('Product not found')
  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = orig
  const copy = {
    ...rest,
    name:   `${orig.name} (Copy)`,
    slug:   `${orig.slug}-copy-${Date.now()}`,
    status: 'draft',
  }
  const { data, error } = await supabase.from('products').insert(copy).select().single()
  if (error) throw error
  return data
}
