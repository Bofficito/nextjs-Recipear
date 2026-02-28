'use server'
import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  return data
}

export async function isPro(): Promise<boolean> {
  const profile = await getProfile()
  return profile?.plan === 'pro'
}