import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/actions/recipes";
import { getRecipeTags } from '@/lib/actions/tags'
import { Clock, ArrowLeft, Pencil, ChefHat } from "lucide-react";
import PortionScaler from "./PortionScaler";
import CookingModeButton from "./CookingModeButton";
import FavoriteButton from "./FavoriteButton";
import ShareButton from './ShareButton'
import DeleteButton from "./DeleteButton";

import type { Ingredient, Tag } from '@/lib/types'

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params
  const [recipe, tags] = await Promise.all([
    getRecipe(id).catch(() => null),
    getRecipeTags(id),
  ])
  if (!recipe) notFound()

  const ingredients = recipe.ingredients as Ingredient[];

  return (
    <div className="flex flex-col gap-8">
      {/* Nav row */}
      <div className="flex flex-col gap-3">
        {/* Volver */}
        <Link
          href="/recetario"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Volver
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-2 flex-wrap">
          {recipe.steps && (
            <CookingModeButton
              title={recipe.title}
              steps={recipe.steps}
              ingredients={ingredients}
            />
          )}
          <Link
            href={`/recetas/${recipe.id}/editar`}
            className="flex items-center gap-1.5 text-sm border border-stone-200 rounded-xl px-3 py-2 hover:border-stone-400 transition-colors"
          >
            <Pencil size={13} />
            Editar
          </Link>
          <FavoriteButton id={recipe.id} isFavorite={recipe.is_favorite} />
          <DeleteButton id={recipe.id} />
          <ShareButton id={recipe.id} isPublic={recipe.is_public ?? false} />
        </div>
      </div>

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
                style={{ backgroundColor: tag.color + '22', color: tag.color }}
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
      </div>

      {ingredients.length > 0 && <PortionScaler ingredients={ingredients} />}

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
