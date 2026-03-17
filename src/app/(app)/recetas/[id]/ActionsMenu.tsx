"use client";
import { useState, useTransition } from "react";
import {
  MoreHorizontal,
  Copy,
  Check,
  Instagram,
  FileDown,
  Globe,
  Lock,
  Download,
  X,
} from "lucide-react";
import { togglePublic } from "@/lib/actions/recipes";

type Props = {
  id: string;
  title: string;
  isPublic: boolean;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Modal de preview de la imagen (fallback cuando no hay Web Share API)
function ShareImageModal({
  imageUrl,
  title,
  onClose,
}: {
  imageUrl: string;
  title: string;
  onClose: () => void;
}) {
  const [textCopied, setTextCopied] = useState(false);
  const shareText = `Te comparto mi receta de ${title} 🍽️\nHecha con Recipear — tu recetario digital.`;

  function handleDownload() {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `${slugify(title)}.png`;
    a.click();
  }

  async function handleCopyText() {
    try {
      await navigator.clipboard?.writeText(shareText);
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stone-900">Compartir imagen</span>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full rounded-xl border border-stone-100"
        />

        {/* Acciones */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white rounded-xl py-3 text-sm hover:bg-stone-700 transition-colors"
        >
          <Download size={15} />
          Guardar imagen
        </button>

        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 w-full border border-stone-200 rounded-xl py-3 text-sm text-stone-600 hover:border-stone-400 transition-colors"
        >
          {textCopied ? (
            <Check size={15} className="text-green-600" />
          ) : (
            <Copy size={15} />
          )}
          {textCopied ? "Texto copiado" : "Copiar texto para pegar"}
        </button>

        <p className="text-xs text-stone-400 text-center -mt-1">
          Guardá la imagen y pegá el texto en Instagram, WhatsApp o donde quieras.
        </p>
      </div>
    </div>
  );
}

export default function ActionsMenu({ id, title, isPublic: initial }: Props) {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [igLoading, setIgLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleTogglePublic() {
    const next = !isPublic;
    setIsPublic(next);
    startTransition(() => togglePublic(id, next));
  }

  function handleCopy() {
    const url = `${window.location.origin}/r/${id}`;
    try { navigator.clipboard?.writeText(url); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleIG() {
    setOpen(false);
    setIgLoading(true);
    try {
      const res = await fetch(`/api/recipe-card/${id}`);
      const blob = await res.blob();
      const file = new File([blob], `${title}.png`, { type: "image/png" });
      const shareText = `Te comparto mi receta de ${title} 🍽️\nHecha con Recipear — tu recetario digital.`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title, text: shareText });
      } else {
        // Fallback: mostrar modal con preview
        const objectUrl = URL.createObjectURL(blob);
        setShareImageUrl(objectUrl);
      }
    } finally {
      setIgLoading(false);
    }
  }

  function handleCloseModal() {
    if (shareImageUrl) {
      URL.revokeObjectURL(shareImageUrl);
      setShareImageUrl(null);
    }
  }

  async function handlePDF() {
    setOpen(false);
    setPdfLoading(true);
    try {
      const res = await fetch(`/api/recipe-pdf/${id}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(title)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setPdfLoading(false);
    }
  }

  const iconBtn =
    "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50 text-left";

  return (
    <>
      <div className="relative">
        {open && (
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          title="Más opciones"
          className="flex items-center justify-center w-9 h-9 border border-stone-200 rounded-xl hover:border-stone-400 transition-colors text-stone-500"
        >
          {igLoading || pdfLoading ? (
            <span className="text-xs text-stone-400">...</span>
          ) : (
            <MoreHorizontal size={15} />
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-11 z-20 bg-white border border-stone-200 rounded-2xl shadow-lg py-1.5 min-w-[190px]">
            {/* Compartir imagen */}
            <button onClick={handleIG} disabled={igLoading} className={iconBtn}>
              <Instagram size={14} className="flex-shrink-0" />
              {igLoading ? "Generando..." : "Compartir imagen"}
            </button>

            {/* Descargar PDF */}
            <button onClick={handlePDF} disabled={pdfLoading} className={iconBtn}>
              <FileDown size={14} className="flex-shrink-0" />
              {pdfLoading ? "Generando..." : "Descargar PDF"}
            </button>

            {/* Copiar link */}
            <button
              onClick={isPublic ? handleCopy : undefined}
              disabled={!isPublic}
              title={!isPublic ? "Hacé la receta pública para compartir el link" : undefined}
              className={`${iconBtn} ${!isPublic ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {copied ? (
                <Check size={14} className="text-green-600 flex-shrink-0" />
              ) : (
                <Copy size={14} className="flex-shrink-0" />
              )}
              {copied ? "Copiado" : "Copiar link"}
            </button>

            <div className="my-1 border-t border-stone-100" />

            {/* Privacidad */}
            <button onClick={handleTogglePublic} className={`${iconBtn} text-stone-400`}>
              {isPublic ? (
                <Globe size={14} className="text-green-500 flex-shrink-0" />
              ) : (
                <Lock size={14} className="flex-shrink-0" />
              )}
              {isPublic ? "Hacer privada" : "Hacer pública"}
            </button>
          </div>
        )}
      </div>

      {/* Modal de preview — solo cuando Web Share no está disponible */}
      {shareImageUrl && (
        <ShareImageModal
          imageUrl={shareImageUrl}
          title={title}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
