import { getRecipes }    from '@/lib/actions/recipes'
import { getCategories } from '@/lib/actions/backoffice'
import RecipeList        from '@/components/recipes/RecipeList'
import { Plus }          from 'lucide-react'
import Link              from 'next/link'

export default async function HomePage() {
  const [recipes, categories] = await Promise.all([
    getRecipes(),
    getCategories(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">recetas</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            {recipes.length} guardada{recipes.length !== 1 ? 's' : ''}
          </p>
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