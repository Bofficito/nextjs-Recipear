"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRecipe } from "@/lib/actions/recipes";
import { setRecipeTags } from "@/lib/actions/tags";
import RecipeForm from "@/components/recipes/RecipeForm";
import ImportFromUrl from "./ImportFromUrl";
import { useToast } from "@/components/ui/ToastProvider";
import type {
  RecipeInsert,
  Category,
  Unit,
  Method,
  TimeRange,
  Tag,
} from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  categories: Category[];
  units: Unit[];
  methods: Method[];
  timeRanges: TimeRange[];
  isPro: boolean;
  limitReached: boolean;
  maxIngredients: number | null;
  tags: Tag[];
};

export default function NuevaRecetaClient({
  categories,
  units,
  methods,
  timeRanges,
  isPro,
  limitReached,
  maxIngredients,
  tags,
}: Props) {
  const [pending, setPending] = useState(false);
  const [prefill, setPrefill] = useState<RecipeInsert | undefined>();
  const { showToast } = useToast();
  const router = useRouter();

  async function handleSubmit(data: RecipeInsert, tagIds: string[]) {
    setPending(true);
    try {
      const recipeId = await createRecipe(data);
      if (tagIds.length > 0) await setRecipeTags(recipeId, tagIds);
      showToast("Receta guardada ✓");
      router.push("/recetario");
    } catch (e: any) {
      setPending(false);
      if (e?.message === "LIMIT_REACHED") {
        showToast("Llegaste al límite de recetas del plan gratuito");
      } else {
        showToast("Ocurrió un error al guardar");
      }
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/recetario"
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver
      </Link>

      <h1 className="font-serif text-3xl text-stone-900">Nueva receta</h1>

      {limitReached && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-amber-800">
              Llegaste al límite de recetas del plan gratuito
            </span>
            <span className="text-xs text-amber-600">
              Próximamente vas a poder acceder a la Cocina Pro para agregar más
            </span>
          </div>
          <span className="text-lg">🔒</span>
        </div>
      )}

      {!limitReached && (
        <>
          <ImportFromUrl
            categories={categories}
            units={units}
            isPro={isPro}
            onImport={(data) => {
              setPrefill(data);
              showToast("Receta importada — revisá los datos antes de guardar");
            }}
          />

          <RecipeForm
            key={JSON.stringify(prefill)}
            initial={prefill as any}
            onSubmit={handleSubmit}
            pending={pending}
            categories={categories}
            units={units}
            methods={methods}
            timeRanges={timeRanges}
            maxIngredients={maxIngredients}
            tags={tags}
          />
        </>
      )}
    </div>
  );
}
