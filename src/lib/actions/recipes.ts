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
    .is('deleted_at', null)
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
  revalidatePath('/recetario')
  redirect('/recetario')
}

export async function updateRecipe(id: string, recipe: RecipeInsert) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recipes')
    .update(recipe)
    .eq('id', id)
  if (error) throw error
  revalidatePath('/recetario')
  revalidatePath(`/recetas/${id}`)
  redirect(`/recetas/${id}`)
}

export async function toggleFavorite(id: string, value: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recipes')
    .update({ is_favorite: value })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/recetario')
  revalidatePath(`/recetas/${id}`)
}

// soft delete — mueve a papelera
export async function deleteRecipe(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recipes')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/recetario')
  redirect('/recetario')
}

// restaurar desde papelera
export async function restoreRecipe(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recipes')
    .update({ deleted_at: null })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/recetario')
  revalidatePath('/papelera')
}

// eliminar definitivamente
export async function permanentDeleteRecipe(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
  if (error) throw error
  revalidatePath('/papelera')
}

// obtener recetas en papelera
export async function getDeletedRecipes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
  if (error) throw error
  return data
}