'use client'
import { useState } from 'react'
import { createRecipe }  from '@/lib/actions/recipes'
import RecipeForm        from '@/components/recipes/RecipeForm'
import ImportFromUrl     from './ImportFromUrl'
import { useToast }      from '@/components/ui/ToastProvider'
import type { RecipeInsert, Category, Unit, Method, TimeRange } from '@/lib/types'
import { ArrowLeft }     from 'lucide-react'
import Link              from 'next/link'

type Props = {
  categories: Category[]
  units:      Unit[]
  methods:    Method[]
  timeRanges: TimeRange[]
  isPro:      boolean
}

export default function NuevaRecetaClient({ categories, units, methods, timeRanges, isPro }: Props) {
  const [pending, setPending] = useState(false)
  const [prefill, setPrefill] = useState<RecipeInsert | undefined>()
  const { showToast }         = useToast()

  async function handleSubmit(data: RecipeInsert) {
    setPending(true)
    await createRecipe(data)
    showToast('Receta guardada ✓')
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver
      </Link>

      <h1 className="font-serif text-3xl text-stone-900">Nueva receta</h1>

      <ImportFromUrl
        categories={categories}
        units={units}
        isPro={isPro}
        onImport={data => {
          setPrefill(data)
          showToast('Receta importada — revisá los datos antes de guardar')
        }}
      />

      <RecipeForm
        key={JSON.stringify(prefill)}
        initial={prefill as any}
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