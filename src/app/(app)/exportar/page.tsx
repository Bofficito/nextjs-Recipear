import { getRecipesForExport } from "@/lib/actions/recipes";
import { getProfileWithLimits } from "@/lib/actions/profile";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import ExportarClient from "./ExportarClient";

export default async function ExportarPage() {
  const [recipes, profile] = await Promise.all([
    getRecipesForExport(),
    getProfileWithLimits(),
  ]);

  const isLifetime = profile?.plan === "lifetime";

  if (!isLifetime)
    return (
      <div className="flex flex-col gap-6">
        <Link
          href="/recetario"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={15} />
          Volver
        </Link>
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Lock size={28} className="text-stone-300" />
          <h1 className="font-serif text-3xl text-stone-900">
            Book de Recetas
          </h1>
          <p className="text-sm text-stone-400 max-w-sm">
            Exportar tu recetario como PDF es una feature exclusiva del plan
            Lifetime.
          </p>
          <Link
            href="/planes"
            className="text-sm bg-stone-900 text-white px-5 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
          >
            Ver planes
          </Link>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/recetario"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Volver
        </Link>
        <h1 className="font-serif text-3xl text-stone-900">Book de Recetas</h1>
        <p className="text-sm text-stone-400 mt-1">
          Seleccioná las recetas que quieras incluir en el PDF.
        </p>
      </div>
      <ExportarClient recipes={recipes as any} />
    </div>
  );
}
