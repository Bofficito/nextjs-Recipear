import { UtensilsCrossed, LogOut, Settings, Trash2, MessageSquare, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'

const ADMIN_ID = '994b20b5-87bc-4772-9f50-6d888f966b89'

function Tooltip({ label, children }: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-stone-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="absolute bottom-full right-3 border-4 border-transparent border-b-stone-900" />
        {label}
      </div>
    </div>
  )
}

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.id === ADMIN_ID

  return (
    <header className="border-b border-stone-200 bg-white px-4 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/recetario" className="flex items-center gap-2 text-stone-900 hover:text-stone-600 transition-colors">
          <UtensilsCrossed size={18} />
          <span className="font-serif text-lg">mis recetas</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs text-stone-400 hidden sm:block">
            {user?.email}
          </span>

          <Tooltip label="Planes">
            <Link href="/planes" className="text-stone-400 hover:text-stone-900 transition-colors">
              <Sparkles size={16} />
            </Link>
          </Tooltip>

          <Tooltip label="Feedback">
            <Link href="/feedback" className="text-stone-400 hover:text-stone-900 transition-colors">
              <MessageSquare size={16} />
            </Link>
          </Tooltip>

          <Tooltip label="Papelera">
            <Link href="/papelera" className="text-stone-400 hover:text-stone-900 transition-colors">
              <Trash2 size={16} />
            </Link>
          </Tooltip>

          {isAdmin && (
            <Tooltip label="Backoffice">
              <Link href="/backoffice" className="text-stone-400 hover:text-stone-900 transition-colors">
                <Settings size={16} />
              </Link>
            </Tooltip>
          )}

          <Tooltip label="Cerrar sesión">
            <form>
              <button
                formAction={logout}
                className="flex items-center text-stone-400 hover:text-stone-900 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </form>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}