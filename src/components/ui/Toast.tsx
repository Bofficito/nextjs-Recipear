'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

type Props = {
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({ message, onClose, duration = 3000 }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // pequeño delay para triggear la animación de entrada
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`
      fixed bottom-6 left-1/2 -translate-x-1/2 z-50
      flex items-center gap-3
      bg-stone-900 text-white
      px-4 py-3 rounded-2xl shadow-lg
      transition-all duration-300
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
    `}>
      <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors ml-1">
        <X size={14} />
      </button>
    </div>
  )
}