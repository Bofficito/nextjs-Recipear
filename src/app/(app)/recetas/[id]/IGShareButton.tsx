"use client";
import { useState } from "react";
import { Instagram, Check } from "lucide-react";

export default function IGShareButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/recipe-card/${id}`);
      const blob = await res.blob();
      const file = new File([blob], `${title}.png`, { type: "image/png" });

      const shareText = `Te comparto mi receta de ${title} 🍽️\nHecha con Recipear — tu recetario digital.`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title, text: shareText });
      } else {
        // Fallback desktop: descarga + copia texto al portapapeles
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}.png`;
        a.click();
        URL.revokeObjectURL(url);
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm border border-stone-200 rounded-xl px-3 py-2 hover:border-stone-400 transition-colors text-stone-600 disabled:opacity-50"
    >
      {copied ? <Check size={13} /> : <Instagram size={13} />}
      {loading ? "Generando..." : copied ? "Texto copiado" : "Compartir"}
    </button>
  );
}
