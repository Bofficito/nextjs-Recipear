'use server'
import { createClient } from '@/lib/supabase/server'

export async function submitFeedback(type: string, message: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { error } = await supabase
    .from('feedback')
    .insert({ user_id: user.id, user_email: user.email, type, message })

  if (error) throw error
}

export async function getFeedback() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}