import { Heart } from 'lucide-react'
import type { RecipeListItem } from '@/lib/types'
import Link from 'next/link'

export default function RecipeCard({ recipe }: { recipe: RecipeListItem }) {
  return (
    <Link
      href={`/recetas/${recipe.id}`}
      className="block bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-400 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-stone-400">
          {recipe.category}
        </span>
        {recipe.is_favorite && (
          <Heart size={13} className="fill-red-400 text-red-400" />
        )}
      </div>

      <h3 className="font-serif text-xl text-stone-900 mb-3 leading-snug">
        {recipe.title}
      </h3>

      <div className="flex items-center gap-4">
        {recipe.time && (
          <span className="text-xs text-stone-400">⏱ {recipe.time}</span>
        )}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <span className="text-xs text-stone-400">
            {recipe.ingredients.length} ingredientes
          </span>
        )}
      </div>
    </Link>
  )
}