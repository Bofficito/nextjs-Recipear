"use client";
import { useState } from "react";
import { createPaymentPreference } from "@/lib/actions/payments";

type Props = {
  planId: "quarterly" | "biannual" | "lifetime";
  label: string;
  isDark: boolean;
  compact?: boolean;
  disabled?: boolean;
};

export default function PlanButton({ planId, label, isDark, compact, disabled }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const url = await createPaymentPreference(planId);
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className={`font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        compact
          ? "text-xs rounded-lg px-3 py-1.5 border"
          : "w-full py-3 rounded-xl text-sm"
      } ${
        isDark
          ? "bg-white text-stone-900 hover:bg-stone-100 border-stone-200"
          : "bg-stone-900 text-white hover:bg-stone-700"
      }`}
    >
      {loading ? "..." : label}
    </button>
  );
}
