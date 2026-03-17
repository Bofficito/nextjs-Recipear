"use server";
import { revalidatePath, updateTag, unstable_cache } from "next/cache";
import { createClient as createClientWithAuth } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import type { Category, Unit, Method, TimeRange } from "@/lib/types";

// Cliente sin cookies — válido para datos globales sin RLS por usuario
function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// ── Getters cacheados (datos globales, iguales para todos los usuarios) ──

export const getCategories = unstable_cache(
  async () => {
    const supabase = createAnonClient();
    const { data, error } = await supabase.from("categories").select("*").order("position");
    if (error) throw error;
    return data as Category[];
  },
  ["backoffice-categories"],
  { tags: ["backoffice-categories"] },
);

export const getUnits = unstable_cache(
  async () => {
    const supabase = createAnonClient();
    const { data, error } = await supabase.from("units").select("*").order("position");
    if (error) throw error;
    return data as Unit[];
  },
  ["backoffice-units"],
  { tags: ["backoffice-units"] },
);

export const getMethods = unstable_cache(
  async () => {
    const supabase = createAnonClient();
    const { data, error } = await supabase.from("methods").select("*").order("position");
    if (error) throw error;
    return data as Method[];
  },
  ["backoffice-methods"],
  { tags: ["backoffice-methods"] },
);

export const getTimeRanges = unstable_cache(
  async () => {
    const supabase = createAnonClient();
    const { data, error } = await supabase.from("time_ranges").select("*").order("position");
    if (error) throw error;
    return data as TimeRange[];
  },
  ["backoffice-time-ranges"],
  { tags: ["backoffice-time-ranges"] },
);

// ── Categories ───────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  const supabase = await createClientWithAuth();
  const { error } = await supabase.from("categories").insert({
    name: formData.get("name") as string,
    icon: (formData.get("icon") as string) || null,
    position: Number(formData.get("position") ?? 0),
  });
  if (error) throw error;
  updateTag("backoffice-categories");
  revalidatePath("/backoffice");
}

export async function deleteCategory(id: string) {
  const supabase = await createClientWithAuth();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  updateTag("backoffice-categories");
  revalidatePath("/backoffice");
}

// ── Units ────────────────────────────────────────────────────────────

export async function createUnit(formData: FormData) {
  const supabase = await createClientWithAuth();
  const { error } = await supabase.from("units").insert({
    label: formData.get("label") as string,
    value: formData.get("value") as string,
    position: Number(formData.get("position") ?? 0),
  });
  if (error) throw error;
  updateTag("backoffice-units");
  revalidatePath("/backoffice");
}

export async function deleteUnit(id: string) {
  const supabase = await createClientWithAuth();
  const { error } = await supabase.from("units").delete().eq("id", id);
  if (error) throw error;
  updateTag("backoffice-units");
  revalidatePath("/backoffice");
}

// ── Methods ──────────────────────────────────────────────────────────

export async function createMethod(formData: FormData) {
  const supabase = await createClientWithAuth();
  const { error } = await supabase.from("methods").insert({
    name: formData.get("name") as string,
    position: Number(formData.get("position") ?? 0),
  });
  if (error) throw error;
  updateTag("backoffice-methods");
  revalidatePath("/backoffice");
}

export async function deleteMethod(id: string) {
  const supabase = await createClientWithAuth();
  const { error } = await supabase.from("methods").delete().eq("id", id);
  if (error) throw error;
  updateTag("backoffice-methods");
  revalidatePath("/backoffice");
}

// ── Time Ranges ──────────────────────────────────────────────────────

export async function createTimeRange(formData: FormData) {
  const supabase = await createClientWithAuth();
  const { error } = await supabase.from("time_ranges").insert({
    label: formData.get("label") as string,
    minutes: Number(formData.get("minutes")),
    position: Number(formData.get("position") ?? 0),
  });
  if (error) throw error;
  updateTag("backoffice-time-ranges");
  revalidatePath("/backoffice");
}

export async function deleteTimeRange(id: string) {
  const supabase = await createClientWithAuth();
  const { error } = await supabase.from("time_ranges").delete().eq("id", id);
  if (error) throw error;
  updateTag("backoffice-time-ranges");
  revalidatePath("/backoffice");
}
