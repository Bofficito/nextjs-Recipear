'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Tag = {
  id: string
  name: string
  color: string
}

export async function getTags(): Promise<Tag[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, color')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function createTag(name: string, color: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  const { error } = await supabase
    .from('tags')
    .insert({ name: name.trim(), color, user_id: user.id })
  if (error) throw error
  revalidatePath('/etiquetas')
}

export async function deleteTag(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)
  if (error) throw error
  revalidatePath('/etiquetas')
}

export async function getRecipeTags(recipeId: string): Promise<Tag[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('recipe_tags')
    .select('tag:tags(id, name, color)')
    .eq('recipe_id', recipeId)
  if (error) throw error
  return (data ?? []).map((d: any) => d.tag)
}

export async function setRecipeTags(recipeId: string, tagIds: string[]) {
  const supabase = await createClient()
  await supabase.from('recipe_tags').delete().eq('recipe_id', recipeId)
  if (tagIds.length === 0) {
    revalidatePath('/recetario')
    return
  }
  const { error } = await supabase
    .from('recipe_tags')
    .insert(tagIds.map(tag_id => ({ recipe_id: recipeId, tag_id })))
  if (error) throw error
  revalidatePath('/recetario')
}