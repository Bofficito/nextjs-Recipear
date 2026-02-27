'use client'
import { useActionState } from 'react'
import { login } from '@/lib/actions/auth'
import Link from 'next/link'

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
          placeholder="tu@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">
          Contraseña
        </label>
        <input
          name="password"
          type="password"
          required
          className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-stone-900 text-white rounded-xl py-3 text-sm mt-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        {pending ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="text-sm text-stone-400 text-center mt-2">
        ¿No tenés cuenta?{' '}
        <Link href="/register" className="text-stone-900 underline underline-offset-2">
          Registrate
        </Link>
      </p>
    </form>
  )
}