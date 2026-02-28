import { getDeletedRecipes } from '@/lib/actions/recipes'
import TrashList from './TrashList'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PapeleraPage() {
  const recipes = await getDeletedRecipes()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/recetario"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Volver
        </Link>
        <h1 className="font-serif text-3xl text-stone-900">Papelera</h1>
        <p className="text-sm text-stone-400 mt-1">
          Las recetas se eliminan definitivamente después de 7 días.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif text-xl text-stone-900 mb-2">La papelera está vacía</p>
          <p className="text-sm text-stone-400">Las recetas eliminadas aparecerán acá</p>
        </div>
      ) : (
        <TrashList recipes={recipes as any} />
      )}
    </div>
  )
}