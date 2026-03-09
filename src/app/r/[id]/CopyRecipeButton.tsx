"use client";
import { useState } from "react";
import { createRecipe } from "@/lib/actions/recipes";
import { BookPlus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RecipeInsert } from "@/lib/types";

type Props = {
  recipe: {
    title: string;
    category: string;
    method: string | null;
    time: string | null;
    notes: string | null;
    steps: string | null;
    ingredients: any[];
    condiments: string[];
  };
  tags: any[];
};

export default function CopyRecipeButton({ recipe }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleCopy() {
    setLoading(true);
    try {
      await createRecipe({
        title: recipe.title,
        category: recipe.category,
        method: recipe.method ?? null,
        time: recipe.time ?? null,
        notes: recipe.notes ?? null,
        steps: recipe.steps ?? null,
        ingredients: recipe.ingredients ?? [],
        condiments: recipe.condiments ?? [],
      } as RecipeInsert);
      setDone(true);
      setTimeout(() => router.push("/recetario"), 1000);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={loading || done}
      className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-stone-700 disabled:opacity-50 transition-colors"
    >
      {done ? (
        <>
          <Check size={15} /> Agregada al recetario
        </>
      ) : (
        <>
          <BookPlus size={15} />{" "}
          {loading ? "Agregando..." : "Agregar a mi recetario"}
        </>
      )}
    </button>
  );
}
