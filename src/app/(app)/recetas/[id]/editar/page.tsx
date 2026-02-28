import { getRecipe } from '@/lib/actions/recipes'
import { getCategories, getUnits, getMethods, getTimeRanges } from '@/lib/actions/backoffice'
import EditarRecetaClient from './EditarRecetaClient'
import { notFound } from 'next/navigation'

export default async function EditarRecetaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [recipe, categories, units, methods, timeRanges] = await Promise.all([
    getRecipe(id),
    getCategories(),
    getUnits(),
    getMethods(),
    getTimeRanges(),
  ])

  if (!recipe) notFound()

  return (
    <EditarRecetaClient
      recipe={recipe as any}
      categories={categories}
      units={units}
      methods={methods}
      timeRanges={timeRanges}
    />
  )
}