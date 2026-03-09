import { Clock } from 'lucide-react'
import Link from 'next/link'

export default function PagoPendientePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
        <Clock size={28} className="text-amber-600" />
      </div>
      <div>
        <h1 className="font-serif text-3xl text-stone-900 mb-2">Pago pendiente</h1>
        <p className="text-stone-400 text-sm max-w-sm">
          Tu pago está siendo procesado. Te avisaremos cuando se confirme.
        </p>
      </div>
      <Link
        href="/recetario"
        className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm hover:bg-stone-700 transition-colors"
      >
        Volver al recetario
      </Link>
    </div>
  )
}