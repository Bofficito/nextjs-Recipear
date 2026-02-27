import { getRecipes } from '@/lib/actions/recipes'
import RecipeCard from '@/components/recipes/RecipeCard'
import CategoryFilter from '@/components/recipes/CategoryFilter'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Category } from '@/lib/types'

export default async function HomePage({
  searchParams,
}: {
  searchParams: { cat?: string; q?: string }
}) {
  const allRecipes = await getRecipes()

  const filtered = allRecipes.filter((r) => {
    const matchCat = !searchParams.cat || r.category === searchParams.cat
    const matchSearch = !searchParams.q ||
      r.title.toLowerCase().includes(searchParams.q.toLowerCase()) ||
      (r.ingredients as any[]).some((i) =>
        i.name?.toLowerCase().includes(searchParams.q!.toLowerCase())
      )
    return matchCat && matchSearch
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Título + botón nueva receta */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">recetas</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            {allRecipes.length} guardada{allRecipes.length !== 1 ? 's' : ''}
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

      {/* Filtros */}
      <Suspense>
        <CategoryFilter />
      </Suspense>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif text-xl text-stone-900 mb-2">
            {searchParams.cat || searchParams.q ? 'Sin resultados' : 'Todavía no hay recetas'}
          </p>
          <p className="text-sm text-stone-400">
            {searchParams.cat || searchParams.q
              ? 'Probá con otro filtro'
              : 'Tocá + para agregar tu primera receta'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe as any} />
          ))}
        </div>
      )}
    </div>
  )
}