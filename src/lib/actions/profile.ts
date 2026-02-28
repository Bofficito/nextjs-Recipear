'use server'
import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('plan, plan_type, plan_expires_at')
    .eq('id', user.id)
    .single()

  return data
}

export async function getProfileWithLimits() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: profile }, { data: limits }] = await Promise.all([
    supabase
      .from('profiles')
      .select('plan, plan_type, plan_expires_at')
      .eq('id', user.id)
      .single(),
    supabase
      .from('plan_limits')
      .select('max_recipes, max_ingredients')
      .eq('plan', 'free') // fallback, se pisa abajo
      .single(),
  ])

  if (!profile) return null

  // verificar si el plan mensual/anual expiró
  const planExpired = profile.plan_expires_at
    ? new Date(profile.plan_expires_at) < new Date()
    : false

  const effectivePlan = planExpired ? 'free' : (profile.plan ?? 'free')

  const { data: planLimits } = await supabase
    .from('plan_limits')
    .select('max_recipes, max_ingredients')
    .eq('plan', effectivePlan)
    .single()

  return {
    plan:           effectivePlan,
    plan_type:      profile.plan_type,
    plan_expires_at: profile.plan_expires_at,
    max_recipes:    planLimits?.max_recipes    ?? 15,
    max_ingredients: planLimits?.max_ingredients ?? 10,
  }
}

export async function isPro(): Promise<boolean> {
  const profile = await getProfileWithLimits()
  return profile?.plan !== 'free'
}