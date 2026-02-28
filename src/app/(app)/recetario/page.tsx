import { getRecipes } from '@/lib/actions/recipes'
import { getCategories } from '@/lib/actions/backoffice'
import { getProfile } from '@/lib/actions/profile'
import { Plus } from 'lucide-react'
import RecipeList from '@/components/recipes/RecipeList'
import Link from 'next/link'
import { getProfileWithLimits } from '@/lib/actions/profile'

export const metadata = { title: 'Mi recetario' }

export default async function HomePage() {
  const [recipes, categories, profile] = await Promise.all([
    getRecipes(),
    getCategories(),
    getProfileWithLimits(),
  ])

  const count      = recipes.length
  const maxRecipes = profile?.max_recipes ?? 15
  const isFree     = profile?.plan === 'free'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Recetario</h1>
          <div className="flex items-center gap-2 mt-0.5">
            {isFree ? (
              <p className={`text-sm ${count >= maxRecipes ? 'text-red-400' : 'text-stone-400'}`}>
                {count}/{maxRecipes} guardada{count !== 1 ? 's' : ''}
              </p>
            ) : (
              <p className="text-sm text-stone-400">
                {count} guardada{count !== 1 ? 's' : ''}
              </p>
            )}

            {isFree && count >= maxRecipes && (
              <Link
                href="/planes"
                className="text-xs border border-amber-200 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg hover:border-amber-300 transition-colors"
              >
                Obtener más espacio
              </Link>
            )}
          </div>
        </div>
        <Link
          href="/recetas/nueva"
          className="flex items-center gap-2 bg-stone-900 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
        >
          <Plus size={16} />
          Nueva
        </Link>
      </div>

      <RecipeList recipes={recipes as any} categories={categories} />
    </div>
  )
}