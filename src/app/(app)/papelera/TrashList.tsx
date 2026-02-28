'use client'
import { useTransition } from 'react'
import { restoreRecipe, permanentDeleteRecipe } from '@/lib/actions/recipes'
import { RotateCcw, Trash2 } from 'lucide-react'
import type { Recipe } from '@/lib/types'

function daysLeft(deletedAt: string): number {
  const deleted = new Date(deletedAt)
  const expires = new Date(deleted.getTime() + 7 * 24 * 60 * 60 * 1000)
  const diff    = expires.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function TrashList({ recipes }: { recipes: Recipe[] }) {
  const [, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-3">
      {recipes.map(recipe => (
        <div
          key={recipe.id}
          className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center justify-between gap-4"
        >
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-serif text-lg text-stone-900 truncate">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">{recipe.category}</span>
              <span className="text-stone-200">·</span>
              <span className={`text-xs ${
                daysLeft(recipe.deleted_at!) <= 1
                  ? 'text-red-400'
                  : 'text-stone-400'
              }`}>
                {daysLeft(recipe.deleted_at!)} día{daysLeft(recipe.deleted_at!) !== 1 ? 's' : ''} restante{daysLeft(recipe.deleted_at!) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => startTransition(() => restoreRecipe(recipe.id))}
              className="flex items-center gap-1.5 text-xs border border-stone-200 rounded-xl px-3 py-2 hover:border-stone-400 transition-colors text-stone-600"
            >
              <RotateCcw size={12} />
              Restaurar
            </button>
            <button
              onClick={() => {
                if (confirm('¿Eliminar definitivamente? Esta acción no se puede deshacer.')) {
                  startTransition(() => permanentDeleteRecipe(recipe.id))
                }
              }}
              className="flex items-center gap-1.5 text-xs border border-red-100 rounded-xl px-3 py-2 hover:border-red-300 transition-colors text-red-400"
            >
              <Trash2 size={12} />
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}