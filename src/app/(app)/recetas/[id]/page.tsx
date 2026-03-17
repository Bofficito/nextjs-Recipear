import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/actions/recipes";
import { getRecipeTags } from "@/lib/actions/tags";
import { Clock, ArrowLeft, Pencil, ChefHat, ExternalLink } from "lucide-react";
import PortionScaler from "./PortionScaler";
import FavoriteButton from "./FavoriteButton";
import DeleteButton from "./DeleteButton";
import ActionsMenu from "./ActionsMenu";

import type { Ingredient, Tag } from "@/lib/types";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [recipe, tags] = await Promise.all([
    getRecipe(id).catch(() => null),
    getRecipeTags(id),
  ]);
  if (!recipe) notFound();

  const ingredients = recipe.ingredients as Ingredient[];

  return (
    <div className="flex flex-col gap-8">
      {/* Nav row: volver + acciones compactas */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/recetario"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={15} />
          Volver
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/recetas/${recipe.id}/editar`}
            title="Editar"
            className="flex items-center justify-center w-9 h-9 border border-stone-200 rounded-xl hover:border-stone-400 transition-colors text-stone-500"
          >
            <Pencil size={15} />
          </Link>
          <FavoriteButton id={recipe.id} isFavorite={recipe.is_favorite} />
          <DeleteButton id={recipe.id} />
          <ActionsMenu
            id={recipe.id}
            title={recipe.title}
            isPublic={recipe.is_public ?? false}
          />
        </div>
      </div>

      {/* Metadata + título */}
      <div>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs uppercase tracking-wider text-stone-400">
            {recipe.category}
          </span>
          {recipe.method && (
            <>
              <span className="text-stone-200">·</span>
              <span className="flex items-center gap-1 text-xs text-stone-400">
                <ChefHat size={13} />
                {recipe.method}
              </span>
            </>
          )}
          {recipe.time && (
            <>
              <span className="text-stone-200">·</span>
              <span className="flex items-center gap-1 text-xs text-stone-400">
                <Clock size={13} />
                {recipe.time}
              </span>
            </>
          )}
        </div>

        <h1 className="font-serif text-4xl text-stone-900 leading-tight">
          {recipe.title}
        </h1>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag: Tag) => (
              <span
                key={tag.id}
                className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{ backgroundColor: tag.color + "22", color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {recipe.notes && (
          <div className="mt-4 bg-stone-100 rounded-xl px-4 py-3">
            <p className="text-sm text-stone-500 italic">{recipe.notes}</p>
          </div>
        )}

        {recipe.source_url && (
          <a
            href={recipe.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors w-fit"
          >
            <ExternalLink size={12} />
            Ver receta original
          </a>
        )}
      </div>

      {/* Ingredientes + porciones + modo cocina */}
      {ingredients.length > 0 && (
        <PortionScaler
          ingredients={ingredients}
          cookingProps={
            recipe.steps
              ? { title: recipe.title, steps: recipe.steps }
              : undefined
          }
        />
      )}

      {recipe.condiments && recipe.condiments.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-wider text-stone-400 mb-3">
            Condimentos / a gusto
          </h2>
          <div className="flex flex-wrap gap-2">
            {recipe.condiments.map((c: string, i: number) => (
              <span
                key={i}
                className="text-xs bg-stone-100 text-stone-600 rounded-lg px-2.5 py-1.5"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      )}

      {recipe.steps && (
        <section>
          <h2 className="text-xs uppercase tracking-wider text-stone-400 mb-4">
            Preparación
          </h2>
          <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
            {recipe.steps}
          </p>
        </section>
      )}
    </div>
  );
}
