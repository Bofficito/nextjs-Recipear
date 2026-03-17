"use server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function verifyAdmin() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== process.env.ADMIN_ID)
    throw new Error("No autorizado");
}

export type UserRow = {
  id: string;
  email: string;
  plan: string;
  plan_type: string | null;
  plan_expires_at: string | null;
};

export async function getUsers(): Promise<UserRow[]> {
  await verifyAdmin();
  const admin = createAdminClient();

  const [
    {
      data: { users },
    },
    { data: profiles },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 200 }),
    admin.from("profiles").select("id, plan, plan_type, plan_expires_at"),
  ]);

  return users.map((u) => {
    const profile = profiles?.find((p) => p.id === u.id);
    return {
      id: u.id,
      email: u.email ?? "—",
      plan: profile?.plan ?? "free",
      plan_type: profile?.plan_type ?? null,
      plan_expires_at: profile?.plan_expires_at ?? null,
    };
  });
}

export type PlanOption =
  | "free"
  | "monthly"
  | "quarterly"
  | "biannual"
  | "yearly"
  | "pro"
  | "lifetime";

export async function setUserPlan(userId: string, plan: PlanOption) {
  await verifyAdmin();
  const admin = createAdminClient();

  const now = new Date();
  const update: Record<string, unknown> = { plan };

  if (plan === "free") {
    update.plan_type = null;
    update.plan_expires_at = null;
  } else if (plan === "monthly") {
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + 1);
    update.plan_type = "monthly";
    update.plan_expires_at = expires.toISOString();
  } else if (plan === "quarterly") {
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + 3);
    update.plan_type = "quarterly";
    update.plan_expires_at = expires.toISOString();
  } else if (plan === "biannual") {
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + 6);
    update.plan_type = "biannual";
    update.plan_expires_at = expires.toISOString();
  } else if (plan === "yearly") {
    const expires = new Date(now);
    expires.setFullYear(expires.getFullYear() + 1);
    update.plan_type = "yearly";
    update.plan_expires_at = expires.toISOString();
  } else if (plan === "pro") {
    update.plan_type = "manual";
    update.plan_expires_at = null;
  } else if (plan === "lifetime") {
    update.plan_type = "lifetime";
    update.plan_expires_at = null;
  }

  await admin.from("profiles").update(update).eq("id", userId);
  revalidatePath("/backoffice");
}
