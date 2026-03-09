"use client";
import { useState, useTransition } from "react";
import { togglePublic } from "@/lib/actions/recipes";
import { Link, Copy, Check } from "lucide-react";

type Props = {
  id: string;
  isPublic: boolean;
};

export default function ShareButton({ id, isPublic: initial }: Props) {
  const [isPublic, setIsPublic] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  function handleToggle() {
    const next = !isPublic;
    setIsPublic(next);
    startTransition(() => togglePublic(id, next));
  }

  function handleCopy() {
    const url = `${window.location.origin}/r/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      {/* Toggle */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-1.5 text-sm border rounded-xl px-3 py-2 transition-colors ${
          isPublic
            ? "border-green-200 bg-green-50 text-green-700 hover:border-green-300"
            : "border-stone-200 text-stone-400 hover:border-stone-400"
        }`}
      >
        <Link size={13} />
        {isPublic ? "Público" : "Privado"}
      </button>

      {/* Copiar link */}
      {isPublic && (
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm border border-stone-200 rounded-xl px-3 py-2 hover:border-stone-400 transition-colors text-stone-600"
        >
          {copied ? (
            <Check size={13} className="text-green-600" />
          ) : (
            <Copy size={13} />
          )}
          {copied ? "Copiado" : "Copiar link"}
        </button>
      )}
    </div>
  );
}
