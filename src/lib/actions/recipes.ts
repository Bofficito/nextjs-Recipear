"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import type { RecipeInsert } from "../types";
import { getProfileWithLimits } from "@/lib/actions/profile";

export async function getRecipes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "id, title, category, time, is_favorite, ingredients, condiments, recipe_tags(tag:tags(id, name, color))",
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((r) => ({
    ...r,
    tags: (r.recipe_tags ?? []).map((rt: any) => rt.tag),
  }));
}

export async function getRecipe(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getRecipeCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { count } = await supabase
    .from("recipes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .is("deleted_at", null);
  return count ?? 0;
}

export async function getRecipesForExport() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "id, title, category, method, time, notes, steps, ingredients, condiments, recipe_tags(tag:tags(id, name, color))",
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((r) => ({
    ...r,
    tags: (r.recipe_tags ?? []).map((rt: any) => rt.tag),
  }));
}

export async function createRecipe(recipe: RecipeInsert): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count }, profile] = await Promise.all([
    supabase
      .from("recipes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .is("deleted_at", null),
    getProfileWithLimits(),
  ]);

  const maxRecipes = profile?.max_recipes ?? 15;
  if (maxRecipes !== null && (count ?? 0) >= maxRecipes) {
    throw new Error("LIMIT_REACHED");
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert({ ...recipe, user_id: user!.id })
    .select("id")
    .single();

  if (error) throw error;
  revalidatePath("/recetario");
  return data.id;
}

export async function updateRecipe(id: string, recipe: RecipeInsert) {
  const supabase = await createClient();
  const { error } = await supabase.from("recipes").update(recipe).eq("id", id);
  if (error) throw error;
  revalidatePath("/recetario");
  revalidatePath(`/recetas/${id}`);
}

export async function toggleFavorite(id: string, value: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recipes")
    .update({ is_favorite: value })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/recetario");
  revalidatePath(`/recetas/${id}`);
}

export async function deleteRecipe(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recipes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/recetario");
  redirect("/recetario");
}

export async function restoreRecipe(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recipes")
    .update({ deleted_at: null })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/recetario");
  revalidatePath("/papelera");
}

export async function permanentDeleteRecipe(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/papelera");
}

export async function getDeletedRecipes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("id, title, category, deleted_at")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPublicRecipe(id: string) {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase
    .from("recipes")
    .select(
      "id, title, category, method, time, notes, steps, ingredients, condiments",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  return data;
}

export async function togglePublic(id: string, value: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recipes")
    .update({ is_public: value })
    .eq("id", id);
  if (error) throw error;
  revalidatePath(`/recetas/${id}`);
}
