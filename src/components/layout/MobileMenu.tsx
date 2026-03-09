"use client";
import { useState } from "react";
import { Menu, X, UtensilsCrossed, Sparkles, MessageSquare, Trash2, Settings, LogOut, Tag, BookOpen } from "lucide-react";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";

type Props = {
  isAdmin: boolean;
  userEmail: string;
  plan: string;
};

const MENU_ITEMS = (isAdmin: boolean) => [
  { href: "/recetario", icon: UtensilsCrossed, label: "Mi recetario" },
  { href: '/exportar', icon: BookOpen, label: 'Exportar recetario' },
  { href: "/etiquetas", icon: Tag, label: "Etiquetas" },
  { href: "/papelera", icon: Trash2, label: "Papelera" },
  { href: "/planes", icon: Sparkles, label: "Planes" },
  { href: "/feedback", icon: MessageSquare, label: "Feedback" },
  ...(isAdmin
    ? [{ href: "/backoffice", icon: Settings, label: "Backoffice" }]
    : []),
];

export default function MobileMenu({ isAdmin, userEmail, plan }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(true)}
        className="text-stone-400 hover:text-stone-900 transition-colors md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex flex-col">
            <span className="font-serif text-stone-900">mis recetas</span>
            <span className="text-xs text-stone-400 mt-0.5 truncate max-w-[180px]">
              {userEmail}
            </span>
            {plan !== "free" && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md w-fit mt-1 ${
                  plan === "lifetime"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {plan === "lifetime" ? "✦ Lifetime" : "★ Pro"}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <nav className="flex flex-col py-2">
          {MENU_ITEMS(isAdmin).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3.5 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
            >
              <item.icon size={16} className="text-stone-400" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Cerrar sesión */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-stone-100 p-4">
          <form>
            <button
              formAction={logout}
              className="flex items-center gap-3 w-full px-1 py-2 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-sm">Cerrar sesión</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
