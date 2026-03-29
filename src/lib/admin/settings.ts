import { createClient } from '@/lib/supabase/server'

export async function getSetting(key: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('value').eq('key', key).single()
  return data?.value ?? null
}

export async function getAllSettings() {
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('*')
  const map: Record<string, unknown> = {}
  for (const row of data ?? []) map[row.key] = row.value
  return map
}

export async function setSetting(key: string, value: unknown) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' })
  if (error) throw error
}
