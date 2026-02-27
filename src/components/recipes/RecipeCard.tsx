import { CATEGORY_ICONS, CATEGORY_ICON_COMPONENTS } from '@/lib/types'
import type { Recipe } from '@/lib/types'
import Link from 'next/link'

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const Icon = CATEGORY_ICON_COMPONENTS[recipe.category]

  return (
    <Link
      href={`/recetas/${recipe.id}`}
      className="block bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-400 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-stone-400" />
        <span className="text-xs uppercase tracking-wider text-stone-400">
          {recipe.category}
        </span>
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

      {recipe.notes && (
        <p className="text-sm text-stone-400 italic mt-3 border-t border-stone-100 pt-3">
          {recipe.notes}
        </p>
      )}
    </Link>
  )
}