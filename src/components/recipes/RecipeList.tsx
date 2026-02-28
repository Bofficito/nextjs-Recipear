'use client'
import { useState, useMemo } from 'react'
import { Search, X, Heart } from 'lucide-react'
import RecipeCard from './RecipeCard'
import type { Recipe, Category } from '@/lib/types'

type Props = {
  recipes:    Recipe[]
  categories: Category[]
}

export default function RecipeList({ recipes, categories }: Props) {
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const filtered = useMemo(() => {
    return recipes.filter(r => {
        const matchCat    = !cat || r.category === cat
        const matchFav    = !onlyFavorites || r.is_favorite
        const q           = search.toLowerCase()
        const matchSearch = !q ||
        r.title.toLowerCase().includes(q) ||
        (r.ingredients as any[]).some(i =>
            i.name?.toLowerCase().includes(q)
        )
        return matchCat && matchFav && matchSearch
    })
    }, [recipes, search, cat, onlyFavorites])

  const usedCategories = categories.filter(c =>
    recipes.some(r => r.category === c.name)
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Búsqueda + filtro */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o ingrediente..."
            className="w-full border border-stone-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {usedCategories.length > 0 && (
          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-600 bg-white outline-none focus:border-stone-400 transition-colors cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {usedCategories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        )}
        
        <button
        onClick={() => setOnlyFavorites(o => !o)}
        className={`flex items-center gap-1.5 text-sm border rounded-xl px-3 py-2.5 transition-colors ${
            onlyFavorites
            ? 'border-red-200 text-red-400'
            : 'border-stone-200 text-stone-400 hover:border-stone-400'
        }`}
        >
        <Heart size={14} className={onlyFavorites ? 'fill-red-400' : ''} />
        </button>
        
      </div>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif text-xl text-stone-900 mb-2">
            {search || cat ? 'Sin resultados' : 'Todavía no hay recetas'}
          </p>
          <p className="text-sm text-stone-400">
            {search || cat
              ? 'Probá con otro filtro'
              : 'Tocá + para agregar tu primera receta'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}