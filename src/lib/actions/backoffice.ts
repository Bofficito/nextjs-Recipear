'use server'
import { revalidatePath } from 'next/cache'
import { createClient }   from '@/lib/supabase/server'
import type { Category, Unit, Method, TimeRange } from '@/lib/types'

// ── Getters (usados también en el form de recetas) ──────────────────

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories').select('*').order('position')
  if (error) throw error
  return data as Category[]
}

export async function getUnits() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('units').select('*').order('position')
  if (error) throw error
  return data as Unit[]
}

export async function getMethods() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('methods').select('*').order('position')
  if (error) throw error
  return data as Method[]
}

export async function getTimeRanges() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('time_ranges').select('*').order('position')
  if (error) throw error
  return data as TimeRange[]
}

// ── Categories ───────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').insert({
    name:     formData.get('name') as string,
    icon:     formData.get('icon') as string || null,
    position: Number(formData.get('position') ?? 0),
  })
  if (error) throw error
  revalidatePath('/backoffice')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/backoffice')
}

// ── Units ────────────────────────────────────────────────────────────

export async function createUnit(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('units').insert({
    label:    formData.get('label') as string,
    value:    formData.get('value') as string,
    position: Number(formData.get('position') ?? 0),
  })
  if (error) throw error
  revalidatePath('/backoffice')
}

export async function deleteUnit(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('units').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/backoffice')
}

// ── Methods ──────────────────────────────────────────────────────────

export async function createMethod(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('methods').insert({
    name:     formData.get('name') as string,
    position: Number(formData.get('position') ?? 0),
  })
  if (error) throw error
  revalidatePath('/backoffice')
}

export async function deleteMethod(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('methods').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/backoffice')
}

// ── Time Ranges ──────────────────────────────────────────────────────

export async function createTimeRange(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('time_ranges').insert({
    label:    formData.get('label') as string,
    minutes:  Number(formData.get('minutes')),
    position: Number(formData.get('position') ?? 0),
  })
  if (error) throw error
  revalidatePath('/backoffice')
}

export async function deleteTimeRange(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('time_ranges').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/backoffice')
}