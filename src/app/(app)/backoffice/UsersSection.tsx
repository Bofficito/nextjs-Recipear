"use client";
import { useState } from "react";
import { setUserPlan, type UserRow, type PlanOption } from "@/lib/actions/admin";

const PLAN_OPTIONS: { value: PlanOption; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "monthly", label: "Pro 1 mes" },
  { value: "quarterly", label: "Pro 3 meses" },
  { value: "biannual", label: "Pro 6 meses" },
  { value: "yearly", label: "Pro 1 año" },
  { value: "pro", label: "Pro sin vencer" },
  { value: "lifetime", label: "De por vida" },
];

const PLAN_STYLES: Record<string, string> = {
  free: "bg-stone-100 text-stone-500",
  monthly: "bg-blue-50 text-blue-600",
  quarterly: "bg-blue-50 text-blue-600",
  biannual: "bg-violet-50 text-violet-600",
  yearly: "bg-violet-50 text-violet-600",
  pro: "bg-blue-50 text-blue-700",
  lifetime: "bg-amber-50 text-amber-600",
};

export default function UsersSection({ users }: { users: UserRow[] }) {
  const [pending, setPending] = useState<string | null>(null);

  async function handleChange(userId: string, plan: PlanOption) {
    setPending(userId);
    await setUserPlan(userId, plan);
    setPending(null);
  }

  return (
    <section className="border border-stone-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-stone-100 flex items-center gap-3">
        <span className="font-serif text-lg text-stone-900">Usuarios</span>
        <span className="text-xs text-stone-400 bg-stone-100 rounded-full px-2 py-0.5">
          {users.length}
        </span>
      </div>
      <ul className="divide-y divide-stone-100">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between px-6 py-3 bg-white"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-stone-900">{user.email}</span>
              {user.plan_expires_at && (
                <span className="text-xs text-stone-400">
                  vence{" "}
                  {new Date(user.plan_expires_at).toLocaleDateString("es-AR")}
                </span>
              )}
            </div>
            <select
              value={user.plan}
              onChange={(e) => handleChange(user.id, e.target.value as PlanOption)}
              disabled={pending === user.id}
              className={`text-xs rounded-lg px-2 py-1.5 border border-stone-200 outline-none cursor-pointer transition-opacity disabled:opacity-50 ${PLAN_STYLES[user.plan] ?? "bg-stone-100 text-stone-500"}`}
            >
              {PLAN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  );
}
