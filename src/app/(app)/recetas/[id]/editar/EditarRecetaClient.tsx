'use client'
import { useState } from 'react'
import { updateRecipe } from '@/lib/actions/recipes'
import RecipeForm from '@/components/recipes/RecipeForm'
import { useToast } from '@/components/ui/ToastProvider'
import type { Recipe, RecipeInsert, Category, Unit, Method, TimeRange } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Props = {
  recipe:     Recipe
  categories: Category[]
  units:      Unit[]
  methods:    Method[]
  timeRanges: TimeRange[]
}

export default function EditarRecetaClient({ recipe, categories, units, methods, timeRanges }: Props) {
  const [pending, setPending] = useState(false)
  const { showToast } = useToast()

  async function handleSubmit(data: RecipeInsert) {
    setPending(true)
    showToast('Cambios guardados ✓')
    await updateRecipe(recipe.id, data)
    }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={`/recetas/${recipe.id}`}
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver
      </Link>

      <h1 className="font-serif text-3xl text-stone-900">Editar receta</h1>

      <RecipeForm
        initial={recipe}
        onSubmit={handleSubmit}
        pending={pending}
        categories={categories}
        units={units}
        methods={methods}
        timeRanges={timeRanges}
      />
    </div>
  )
}