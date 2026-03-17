"use client";
import { useState } from "react";
import { createSubscription } from "@/lib/actions/payments";

type Props = {
  planId: "monthly" | "yearly";
  label: string;
  isDark?: boolean;
  disabled?: boolean;
};

export default function SubscribeButton({ planId, label, isDark, disabled }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const url = await createSubscription(planId);
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className={`w-full py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isDark
          ? "bg-white text-stone-900 hover:bg-stone-100"
          : "bg-stone-900 text-white hover:bg-stone-700"
      }`}
    >
      {loading ? "Redirigiendo..." : label}
    </button>
  );
}
