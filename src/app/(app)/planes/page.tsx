// import { getProfileWithLimits } from '@/lib/actions/profile'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
// import PlanButton from './PlanButton'

// const PLANES = [
//   {
//     id:    'free',
//     name:  'Free',
//     price: 'Gratis',
//     sub:   'para siempre',
//     features: [
//       '15 recetas',
//       '10 ingredientes por receta',
//       'Modo cocina',
//       'Favoritos y búsqueda',
//     ],
//     cta:      null,
//     highlight: false,
//   },
//   {
//     id:    'monthly',
//     name:  'Pro Mensual',
//     price: '$5.500',
//     sub:   'por mes',
//     features: [
//       '30 recetas',
//       '20 ingredientes por receta',
//       'Importar recetas con IA',
//       'Todo lo del plan Free',
//     ],
//     cta:      'Suscribirse',
//     highlight: false,
//   },
//   {
//     id:    'yearly',
//     name:  'Pro Anual',
//     price: '$38.500',
//     sub:   'por año — ahorrás 5 meses',
//     features: [
//       '30 recetas',
//       '20 ingredientes por receta',
//       'Importar recetas con IA',
//       'Todo lo del plan Free',
//     ],
//     cta:      'Suscribirse',
//     highlight: true,
//   },
//   {
//     id:    'lifetime',
//     name:  'Lifetime',
//     price: '$56.000',
//     sub:   'pago único',
//     features: [
//       'Recetas ilimitadas',
//       'Ingredientes ilimitados',
//       'Importar recetas con IA',
//       'Exportar recetario completo',
//       'Notas por paso en modo cocina',
//       'Historial de cambios',
//       'Etiquetas personalizadas',
//       'Acceso a todas las features futuras',
//     ],
//     cta:      'Comprar',
//     highlight: false,
//   },
// ]

export default async function PlanesPage() {
  // const profile = await getProfileWithLimits()
  // const currentPlan = profile?.plan ?? 'free'

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
    </div>

    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <Sparkles size={28} className="text-stone-300" />
      <h1 className="font-serif text-3xl text-stone-900">Planes</h1>
      <p className="text-sm text-stone-400 max-w-sm">
        Próximamente vas a poder acceder a planes Pro y Lifetime con más recetas, ingredientes ilimitados, importación con IA y más.
      </p>
    </div>
  </div>
)
}