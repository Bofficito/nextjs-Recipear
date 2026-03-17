"use server";
import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("plan, plan_type, plan_expires_at")
    .eq("id", user.id)
    .single();

  return data;
}

export async function getProfileWithLimits() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Traer el perfil y todos los límites en paralelo (plan_limits es una tabla chica)
  const [{ data: profile }, { data: allLimits }] = await Promise.all([
    supabase
      .from("profiles")
      .select("plan, plan_type, plan_expires_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("plan_limits")
      .select("plan, max_recipes, max_ingredients, max_tags"),
  ]);

  if (!profile) return null;

  // verificar si el plan mensual/anual expiró
  const planExpired = profile.plan_expires_at
    ? new Date(profile.plan_expires_at) < new Date()
    : false;

  const effectivePlan = planExpired ? "free" : (profile.plan ?? "free");

  // todos los planes pagos usan los mismos límites que "monthly" (todos son "pro")
  const limitsKey =
    effectivePlan === "free" || effectivePlan === "lifetime"
      ? effectivePlan
      : "monthly";
  const planLimits = allLimits?.find((l) => l.plan === limitsKey);

  return {
    plan: effectivePlan,
    plan_type: profile.plan_type,
    plan_expires_at: profile.plan_expires_at,
    max_recipes: planLimits == null ? 15 : planLimits.max_recipes,
    max_ingredients: planLimits == null ? 10 : planLimits.max_ingredients,
    max_tags: planLimits == null ? 0 : planLimits.max_tags,
  };
}

export async function isPro(): Promise<boolean> {
  const profile = await getProfile();
  if (!profile) return false;
  const planExpired = profile.plan_expires_at
    ? new Date(profile.plan_expires_at) < new Date()
    : false;
  return !planExpired && profile.plan !== "free";
}
