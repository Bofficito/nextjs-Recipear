// src/app/(app)/etiquetas/page.tsx
import { getTags } from '@/lib/actions/tags'
import { getProfileWithLimits } from '@/lib/actions/profile'
import { ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'
import EtiquetasClient from './EtiquetasClient'

export default async function EtiquetasPage() {
  const [tags, profile] = await Promise.all([
    getTags(),
    getProfileWithLimits(),
  ])

  const isLifetime = profile?.plan === 'lifetime'

  if (!isLifetime) return (
    <div className="flex flex-col gap-6">
      <Link
        href="/recetario"
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver
      </Link>
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Lock size={28} className="text-stone-300" />
        <h1 className="font-serif text-3xl text-stone-900">Etiquetas</h1>
        <p className="text-sm text-stone-400 max-w-sm">
          Las etiquetas personalizadas son una feature exclusiva del plan Lifetime.
        </p>
        <Link
          href="/planes"
          className="text-sm bg-stone-900 text-white px-5 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
        >
          Ver planes
        </Link>
      </div>
    </div>
  )

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
        <h1 className="font-serif text-3xl text-stone-900">Etiquetas</h1>
        <p className="text-sm text-stone-400 mt-1">Organizá tus recetas con etiquetas personalizadas.</p>

        {/* Agregar esto: */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 mt-3">
        <p className="text-sm text-stone-600 leading-relaxed">
            Las etiquetas te permiten agrupar recetas por cualquier criterio que se te ocurra — 
            por ejemplo <span className="font-medium">sin gluten</span>, <span className="font-medium">para invitados</span> o <span className="font-medium">favoritas de los chicos</span>. 
            Una vez creadas, podés asignarlas al crear o editar una receta y filtrar por ellas desde el recetario.
        </p>
        </div>
      </div>
      <EtiquetasClient tags={tags} />
    </div>
  )
}