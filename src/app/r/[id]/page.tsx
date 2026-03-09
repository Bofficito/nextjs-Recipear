import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicRecipe } from '@/lib/actions/recipes'
import { getRecipeTags } from '@/lib/actions/tags'
import type { Ingredient, Tag } from '@/lib/types'
import { Clock, ChefHat, UtensilsCrossed } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CopyRecipeButton from './CopyRecipeButton'

export default async function PublicRecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [recipe, tags] = await Promise.all([
    getPublicRecipe(id),
    getRecipeTags(id),
  ])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!recipe) notFound()

  const ingredients = recipe.ingredients as Ingredient[]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header simple */}
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link
            href={user ? '/recetario' : '/'}
            className="flex items-center gap-2 text-stone-900 hover:text-stone-600 transition-colors"
            >
            <UtensilsCrossed size={18} />
            <span className="font-serif text-lg">mis recetas</span>
            </Link>
            {user ? null : (
            <Link
                href="/register"
                className="text-xs bg-stone-900 text-white px-3 py-2 rounded-xl hover:bg-stone-700 transition-colors"
            >
                Registarse
            </Link>
            )}
        </div>
        </header>

      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
        {/* Meta */}
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

        {/* Ingredientes */}
        {ingredients.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-wider text-stone-400 mb-3">
              Ingredientes
            </h2>
            <ul className="flex flex-col gap-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-stone-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300 flex-shrink-0" />
                  {[ing.qty, ing.unit, ing.name].filter(Boolean).join(' ')}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Condimentos */}
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

        {/* Preparación */}
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

        {/* CTA */}
        <div className="border-t border-stone-200 pt-8 text-center">
            {user ? (
                <>
                <p className="text-sm text-stone-400 mb-3">¿Querés guardar esta receta?</p>
                <CopyRecipeButton recipe={recipe} tags={tags} />
                </>
            ) : (
                <>
                <p className="text-sm text-stone-400 mb-3">¿Te gustó esta receta?</p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
                >
                    <UtensilsCrossed size={15} />
                    Creá tu propio recetario gratis
                </Link>
                </>
            )}
        </div>
      </main>
    </div>
  )
}