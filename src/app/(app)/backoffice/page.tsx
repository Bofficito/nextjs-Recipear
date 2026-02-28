import {
  getCategories, getUnits, getMethods, getTimeRanges,
  createCategory, deleteCategory,
  createUnit, deleteUnit,
  createMethod, deleteMethod,
  createTimeRange, deleteTimeRange,
} from '@/lib/actions/backoffice'
import { LUCIDE_ICONS } from '@/lib/types'
import BackofficeSection from './BackofficeSection'
import { getFeedback } from '@/lib/actions/feedback'

export default async function BackofficePage() {
  const [categories, units, methods, timeRanges] = await Promise.all([
    getCategories(), getUnits(), getMethods(), getTimeRanges(),
  ])
  const feedbackList = await getFeedback()

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-3xl text-stone-900">Backoffice</h1>
        <p className="text-sm text-stone-400 mt-1">Gestión de listas y configuración</p>
      </div>

      {/* Categorías */}
      <BackofficeSection
        title="Categorías"
        items={categories.map(c => ({
          id:    c.id,
          label: c.icon && LUCIDE_ICONS[c.icon]
            ? `${c.name}`
            : c.name,
          sublabel: c.icon ?? '—',
        }))}
        onDelete={deleteCategory}
        fields={[
          { name: 'name',     label: 'Nombre',   placeholder: 'Ej: Entrada' },
          { name: 'icon',     label: 'Icono',     placeholder: 'Ej: UtensilsCrossed' },
          { name: 'position', label: 'Posición',  placeholder: '0', type: 'number' },
        ]}
        onCreate={createCategory}
      />

      {/* Unidades */}
      <BackofficeSection
        title="Unidades"
        items={units.map(u => ({
          id:      u.id,
          label:   u.label,
          sublabel: `valor: ${u.value || '—'}`,
        }))}
        onDelete={deleteUnit}
        fields={[
          { name: 'label',    label: 'Label',    placeholder: 'Ej: taza' },
          { name: 'value',    label: 'Valor',    placeholder: 'Ej: taza' },
          { name: 'position', label: 'Posición', placeholder: '0', type: 'number' },
        ]}
        onCreate={createUnit}
      />

      {/* Métodos */}
      <BackofficeSection
        title="Métodos de preparación"
        items={methods.map(m => ({
          id:    m.id,
          label: m.name,
        }))}
        onDelete={deleteMethod}
        fields={[
          { name: 'name',     label: 'Nombre',   placeholder: 'Ej: Al vapor' },
          { name: 'position', label: 'Posición', placeholder: '0', type: 'number' },
        ]}
        onCreate={createMethod}
      />

      {/* Rangos de tiempo */}
      <BackofficeSection
        title="Rangos de tiempo"
        items={timeRanges.map(t => ({
          id:      t.id,
          label:   t.label,
          sublabel: `${t.minutes} min`,
        }))}
        onDelete={deleteTimeRange}
        fields={[
          { name: 'label',    label: 'Label',    placeholder: 'Ej: 45 min' },
          { name: 'minutes',  label: 'Minutos',  placeholder: '45', type: 'number' },
          { name: 'position', label: 'Posición', placeholder: '0',  type: 'number' },
        ]}
        onCreate={createTimeRange}
      />
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-stone-900">Feedback</h2>
        {feedbackList.map((f: any) => (
          <div key={f.id} className="border border-stone-200 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs border border-stone-200 rounded-lg px-2 py-0.5 text-stone-500">
                  {f.type}
                </span>
                <span className="text-xs text-stone-400">
                  {new Date(f.created_at).toLocaleDateString('es-AR')}
                </span>
              </div>
              <span className="text-xs text-stone-400">{f.user_email}</span>
            </div>
            <p className="text-sm text-stone-700">{f.message}</p>
          </div>
        ))}
      </section>
    </div>
    
  )
}