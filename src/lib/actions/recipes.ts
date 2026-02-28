'use server'
import { revalidatePath } from 'next/cache'
import { redirect }       from 'next/navigation'
import { createClient } from '../supabase/server'
import type { RecipeInsert } from '../types'

export async function getRecipes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getRecipe(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createRecipe(recipe: RecipeInsert) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('recipes')
    .insert({ ...recipe, user_id: user!.id })
  if (error) throw error
  revalidatePath('/')
  redirect('/')
}

export async function updateRecipe(id: string, recipe: RecipeInsert) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recipes')
    .update(recipe)
    .eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath(`/recetas/${id}`)
  redirect(`/recetas/${id}`)
}

export async function deleteRecipe(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
  if (error) throw error
  revalidatePath('/')
  redirect('/')
}

export async function toggleFavorite(id: string, value: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recipes')
    .update({ is_favorite: value })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath(`/recetas/${id}`)
}