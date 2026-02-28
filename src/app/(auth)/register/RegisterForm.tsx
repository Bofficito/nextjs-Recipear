'use client'
import { useActionState } from 'react'
import { register } from '@/lib/actions/auth'
import Link from 'next/link'

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, null)

  // Si hay mensaje de éxito, mostrar pantalla de confirmación
  if (state?.message) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="font-serif text-xl text-stone-900 mb-2">
          Revisá tu email
        </h2>
        <p className="text-sm text-stone-400">
          Te enviamos un link de confirmación a tu casilla. Una vez que confirmés, podés iniciar sesión.
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 text-sm text-stone-900 underline underline-offset-2"
        >
          Ir al login
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">Email</label>
        <input
          name="email"
          type="email"
          required
          className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
          placeholder="tu@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">Contraseña</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
          placeholder="mínimo 6 caracteres"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-stone-900 text-white rounded-xl py-3 text-sm mt-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        {pending ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-sm text-stone-400 text-center mt-2">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="text-stone-900 underline underline-offset-2">
          Iniciá sesión
        </Link>
      </p>
    </form>
  )
}