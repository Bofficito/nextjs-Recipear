import Link from "next/link";
import {
  UtensilsCrossed,
  ChefHat,
  Heart,
  Search,
  Scale,
  Trash2,
  Tag,
  Link2,
  FileDown,
  Share2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import ExploraButton from "./(landing)/ExploreButton";

const features = [
  {
    icon: ChefHat,
    title: "Modo cocina",
    desc: "Pantalla limpia paso a paso. Sin distracciones, sin que se apague el celular.",
  },
  {
    icon: Share2,
    title: "Compartir recetas",
    desc: "Generá un link público para compartir cualquier receta con quien quieras.",
  },
  {
    icon: Tag,
    title: "Etiquetas personalizadas",
    desc: "Creá grupos a tu medida. Sin gluten, Para invitados, Recetas de la abuela, etc.",
  },
  {
    icon: FileDown,
    title: "Exportar en PDF",
    desc: "Descargá una receta suelta o tu recetario completo como book en PDF.",
  },
  {
    icon: UtensilsCrossed,
    title: "Métodos de preparación",
    desc: "Clasificá tus recetas por técnica — horno, sartén, vapor, plancha y más.",
  },
  {
    icon: Heart,
    title: "Favoritos",
    desc: "Marcá las recetas que más usás y encontralas al instante.",
  },
  {
    icon: Search,
    title: "Búsqueda por ingrediente",
    desc: "Buscá por nombre o por ingrediente. Filtrá por categoría.",
  },
  {
    icon: Link2,
    title: "Importar desde URL",
    desc: "Pegá el link de cualquier receta de internet y la importamos automáticamente.",
  },
  {
    icon: Trash2,
    title: "Papelera con recuperación",
    desc: "Las recetas eliminadas se guardan 7 días antes de borrarse definitivamente.",
  },
];

const plans = [
  {
    name: "Free",
    desc: "Para empezar.",
    features: [
      "15 recetas",
      "10 ingredientes por receta",
      "Todas las funciones básicas",
    ],
    cta: "Empezar gratis",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    desc: "Para los que cocinan seguido.",
    features: [
      "30 recetas",
      "20 ingredientes por receta",
      "Etiquetas personalizadas (hasta 5)",
    ],
    cta: "Elegir Pro",
    href: "/register",
    highlight: true,
  },
  {
    name: "Lifetime",
    desc: "Una vez y para siempre.",
    features: [
      "Recetas ilimitadas",
      "Ingredientes ilimitados",
      "Etiquetas ilimitadas",
      "Exportar book PDF",
      "Acceso a todas las features futuras",
    ],
    cta: "Obtener Lifetime",
    href: "/register",
    highlight: false,
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={20} className="text-stone-900" />
          <span className="font-serif text-xl text-stone-900">Recipear</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/recetario"
                className="text-sm bg-stone-900 text-white px-4 py-2 rounded-xl hover:bg-stone-700 transition-colors"
              >
                Ir al recetario
              </Link>
              <form>
                <button
                  formAction={logout}
                  className="text-sm text-stone-400 hover:text-stone-900 transition-colors px-4 py-2"
                >
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-stone-500 hover:text-stone-900 transition-colors px-4 py-2"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="text-sm bg-stone-900 text-white px-4 py-2 rounded-xl hover:bg-stone-700 transition-colors"
              >
                Registrate
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <div className="max-w-2xl">
          <h1 className="font-serif text-6xl text-stone-900 leading-[1.1] mb-6">
            Tu recetario,
            <br />
            <span className="text-stone-400">siempre a mano.</span>
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed mb-10 max-w-lg">
            Guardá, organizá y cociná tus recetas desde cualquier lado,
            <br />
            sin perder nada.
          </p>
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/recetario"
                className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm hover:bg-stone-700 transition-colors"
              >
                Ir a mi recetario →
              </Link>
            ) : (
              <ExploraButton />
            )}
          </div>
        </div>

        {/* Preview mockup */}
        <div className="mt-20 relative">
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAFAF8] z-10 pointer-events-none"
            style={{ top: "60%" }}
          />
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={16} className="text-stone-400" />
                <span className="font-serif text-stone-600">mis recetas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-stone-100" />
                <div className="w-4 h-4 rounded bg-stone-100" />
                <div className="w-4 h-4 rounded bg-stone-100" />
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-serif text-2xl text-stone-900">
                    recetas
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    12 guardadas
                  </div>
                </div>
                <div className="bg-stone-900 text-white text-xs px-3 py-2 rounded-xl">
                  + Nueva
                </div>
              </div>
              <div className="h-9 bg-stone-50 border border-stone-200 rounded-xl" />
              {[
                {
                  title: "Tarta de espinaca y ricota",
                  cat: "Almuerzo",
                  time: "45 min",
                  ings: 8,
                },
                {
                  title: "Bifes a la portuguesa",
                  cat: "Cena",
                  time: "30 min",
                  ings: 6,
                  fav: true,
                },
                {
                  title: "Medialunas de manteca",
                  cat: "Desayuno",
                  time: "2 hs",
                  ings: 7,
                },
              ].map((r, i) => (
                <div key={i} className="border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-stone-400 uppercase tracking-wider">
                      {r.cat}
                    </span>
                    {r.fav && (
                      <Heart size={12} className="fill-red-400 text-red-400" />
                    )}
                  </div>
                  <div className="font-serif text-base text-stone-900 mb-2">
                    {r.title}
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs text-stone-400">⏱ {r.time}</span>
                    <span className="text-xs text-stone-400">
                      {r.ings} ingredientes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-4xl mx-auto px-6 py-24 border-t border-stone-200"
      >
        <h2 className="font-serif text-3xl text-stone-900 mb-4">
          Todo lo que necesitás
        </h2>
        <p className="text-stone-400 mb-14 max-w-md">
          Diseñado para que cocinar sea más fácil, no más complicado.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="w-9 h-9 bg-stone-100 rounded-xl flex items-center justify-center">
                <f.icon size={16} className="text-stone-600" />
              </div>
              <h3 className="font-serif text-lg text-stone-900">{f.title}</h3>
              <p className="text-sm text-stone-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section
        id="planes"
        className="max-w-4xl mx-auto px-6 py-24 border-t border-stone-200"
      >
        <h2 className="font-serif text-3xl text-stone-900 mb-4">Planes</h2>
        <p className="text-stone-400 mb-14 max-w-md">
          Empezá gratis y expandí cuando lo necesites.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 flex flex-col gap-4 border ${
                plan.highlight
                  ? "bg-stone-900 border-stone-900"
                  : "bg-white border-stone-200"
              }`}
            >
              <div>
                <h3
                  className={`font-serif text-xl mb-1 ${plan.highlight ? "text-white" : "text-stone-900"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${plan.highlight ? "text-stone-400" : "text-stone-400"}`}
                >
                  {plan.desc}
                </p>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 text-xs ${plan.highlight ? "text-stone-400" : "text-stone-300"}`}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm ${plan.highlight ? "text-stone-300" : "text-stone-500"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={user ? "/planes" : plan.href}
                className={`mt-2 text-center text-sm px-4 py-2.5 rounded-xl transition-colors ${
                  plan.highlight
                    ? "bg-white text-stone-900 hover:bg-stone-100"
                    : "bg-stone-900 text-white hover:bg-stone-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="bg-stone-900 rounded-3xl px-10 py-14 text-center">
          <h2 className="font-serif text-4xl text-white mb-4">
            Empezá hoy, gratis.
          </h2>
          <p className="text-stone-400 mb-8 max-w-sm mx-auto">
            Creá tu cuenta y empezá a guardar tus recetas en segundos.
          </p>
          {user ? (
            <Link
              href="/recetario"
              className="inline-block bg-white text-stone-900 px-8 py-3 rounded-xl text-sm hover:bg-stone-100 transition-colors"
            >
              Ir a mi recetario →
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-block bg-white text-stone-900 px-8 py-3 rounded-xl text-sm hover:bg-stone-100 transition-colors"
            >
              Crear cuenta gratis
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={14} className="text-stone-400" />
            <span className="font-serif text-stone-400">Recipear</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-300">Desarrollado por</span>
            <a
              href="https://www.lautaroboffi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone-300 hover:text-stone-600 transition-colors"
            >
              Lautaro Boffi
            </a>
            <span className="text-xs text-stone-300"> / </span>
            <a
              href="https://github.com/Bofficito"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone-300 hover:text-stone-600 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
