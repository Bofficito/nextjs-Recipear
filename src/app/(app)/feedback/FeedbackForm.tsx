'use client'
import { useState, useTransition } from 'react'
import { submitFeedback } from '@/lib/actions/feedback'
import { useToast } from '@/components/ui/ToastProvider'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'

const TYPES = [
  { value: 'bug',        label: '🐛 Bug' },
  { value: 'sugerencia', label: '💡 Sugerencia' },
  { value: 'otro',       label: '💬 Otro' },
]

export default function FeedbackForm({ userEmail }: { userEmail: string }) {
  const [type, setType]       = useState('sugerencia')
  const [message, setMessage] = useState('')
  const [, startTransition]   = useTransition()
  const { showToast }         = useToast()
  const router                = useRouter()

  function handleSubmit() {
    if (!message.trim()) return
    startTransition(async () => {
      await submitFeedback(type, message)
      showToast('Feedback enviado, ¡gracias! 🙌')
      router.push('/recetario')
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {/* Email — solo lectura */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">Tu email</label>
        <input
          value={userEmail}
          disabled
          className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-400 bg-stone-50 cursor-not-allowed"
        />
      </div>

      {/* Tipo */}
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-wider text-stone-400">Tipo</label>
        <div className="flex gap-2">
          {TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`flex-1 text-sm py-2.5 rounded-xl border transition-colors ${
                type === t.value
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-wider text-stone-400">Mensaje</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Contanos qué pensás..."
          rows={5}
          className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!message.trim()}
        className="flex items-center justify-center gap-2 bg-stone-900 text-white text-sm py-3 rounded-xl hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        <Send size={14} />
        Enviar
      </button>
    </div>
  )
}