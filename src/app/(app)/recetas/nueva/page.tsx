import { getCategories, getUnits, getMethods, getTimeRanges } from '@/lib/actions/backoffice'
import { getProfileWithLimits } from '@/lib/actions/profile'
import { getTags } from '@/lib/actions/tags'
import { createClient } from '@/lib/supabase/server'
import NuevaRecetaClient from './NuevaRecetaClient'

export default async function NuevaRecetaPage() {
  const supabase = await createClient()

  const [categories, units, methods, timeRanges, profile, { count }, tags] = await Promise.all([
    getCategories(),
    getUnits(),
    getMethods(),
    getTimeRanges(),
    getProfileWithLimits(),
    supabase.from('recipes').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    getTags(),
  ])

  const isPro = profile?.plan !== 'free'
  const limitReached = profile?.max_recipes !== null && (count ?? 0) >= (profile?.max_recipes ?? 15)
  const maxIngredients = profile?.max_ingredients ?? null

  return (
    <NuevaRecetaClient
      categories={categories}
      units={units}
      methods={methods}
      timeRanges={timeRanges}
      isPro={isPro}
      limitReached={limitReached}
      maxIngredients={maxIngredients}
      tags={tags}
    />
  )
}