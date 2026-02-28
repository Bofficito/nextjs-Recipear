import { getCategories, getUnits, getMethods, getTimeRanges } from '@/lib/actions/backoffice'
import { isPro } from '@/lib/actions/profile'
import NuevaRecetaClient from './NuevaRecetaClient'

export default async function NuevaRecetaPage() {
  const [categories, units, methods, timeRanges, pro] = await Promise.all([
    getCategories(), getUnits(), getMethods(), getTimeRanges(), isPro(),
  ])

  return (
    <NuevaRecetaClient
      categories={categories}
      units={units}
      methods={methods}
      timeRanges={timeRanges}
      isPro={pro}
    />
  )
}