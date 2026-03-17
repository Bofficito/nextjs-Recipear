import { ArrowLeft, Check, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import PlanButton from "./PlanButton";
import SubscribeButton from "./SubscribeButton";
import { getProfile } from "@/lib/actions/profile";

const PRO_FEATURES = [
  "Recetas ilimitadas",
  "Ingredientes ilimitados",
  "Importar recetas con IA",
  "Exportar recetario completo",
  "Etiquetas personalizadas",
];

const PLAN_ORDER = ["free", "monthly", "quarterly", "biannual", "yearly", "lifetime"] as const;

type PlanId = (typeof PLAN_ORDER)[number];

function isPlanBlocked(planId: PlanId, currentPlan: string): boolean {
  const current = PLAN_ORDER.indexOf(currentPlan as PlanId);
  const target = PLAN_ORDER.indexOf(planId);
  return current >= target;
}

function PlanActive() {
  return (
    <span className="text-xs text-stone-400 border border-stone-200 rounded-lg px-3 py-1.5">
      Activo
    </span>
  );
}

function PlanUnavailable() {
  return (
    <span className="text-xs text-stone-300 border border-stone-100 rounded-lg px-3 py-1.5">
      No disponible
    </span>
  );
}

function PlanSoon() {
  return (
    <span className="text-xs text-stone-400 border border-stone-200 rounded-lg px-3 py-1.5">
      Próximamente
    </span>
  );
}

const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

export default async function PlanesPage() {
  const profile = await getProfile();
  const currentPlan = profile?.plan ?? "free";
  const isLifetime = currentPlan === "lifetime";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link
          href="/recetario"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Volver
        </Link>
        <h1 className="font-serif text-3xl text-stone-900">Planes</h1>
        <p className="text-sm text-stone-400 mt-1">
          Desbloqueá todas las features de Recipear.
        </p>
      </div>

      {/* ── Suscripciones ───────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <RefreshCw size={14} className="text-stone-400" />
          <h2 className="font-serif text-xl text-stone-900">Suscripciones</h2>
        </div>
        <p className="text-xs text-stone-400 -mt-2">
          Se renuevan automáticamente. Cancelás cuando querés.
        </p>

        {/* Mensual */}
        <div className="border border-stone-200 rounded-2xl p-5 flex flex-col gap-4 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-stone-900">Mensual</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-semibold text-stone-900">$5.586</span>
                <span className="text-stone-400 text-sm">/ mes</span>
              </div>
            </div>
            <span className="text-xs bg-green-50 text-green-600 rounded-full px-2.5 py-1 font-medium">
              7 días gratis
            </span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-stone-500">
                <Check size={13} className="text-stone-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {currentPlan === "monthly" ? (
            <PlanActive />
          ) : isPlanBlocked("monthly", currentPlan) ? (
            <PlanUnavailable />
          ) : PAYMENTS_ENABLED ? (
            <SubscribeButton planId="monthly" label="Empezar prueba gratuita" isDark={false} />
          ) : (
            <PlanSoon />
          )}
        </div>

        {/* Anual */}
        <div className="border border-stone-200 rounded-2xl p-5 flex flex-col gap-4 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-stone-900">Anual</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-semibold text-stone-900">$40.600</span>
                <span className="text-stone-400 text-sm">/ año</span>
              </div>
              <p className="text-xs text-green-600 mt-1">Equivale a $3.383/mes — ahorrás 39%</p>
            </div>
          </div>
          <ul className="flex flex-col gap-1.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-stone-500">
                <Check size={13} className="text-stone-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {currentPlan === "yearly" ? (
            <PlanActive />
          ) : isPlanBlocked("yearly", currentPlan) ? (
            <PlanUnavailable />
          ) : PAYMENTS_ENABLED ? (
            <SubscribeButton planId="yearly" label="Suscribirse anualmente" isDark={false} />
          ) : (
            <PlanSoon />
          )}
        </div>
      </section>

      {/* ── Pagos únicos ────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-stone-400" />
          <h2 className="font-serif text-xl text-stone-900">Pago único</h2>
        </div>
        <p className="text-xs text-stone-400 -mt-2">
          Sin renovación automática. Pagás una vez, usás por el período.
        </p>

        {/* De por vida */}
        <div className="bg-stone-900 text-white rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Mejor opción</p>
              <h3 className="font-medium text-white">De por vida</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-semibold">$56.000</span>
                <span className="text-stone-400 text-sm">pago único</span>
              </div>
            </div>
            <Sparkles size={16} className="text-stone-400 mt-1" />
          </div>
          <ul className="flex flex-col gap-1.5">
            {[...PRO_FEATURES, "Acceso a todas las features futuras"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-stone-300">
                <Check size={13} className="text-stone-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {isLifetime ? (
            <div className="w-full py-3 rounded-xl text-sm font-medium text-center bg-stone-800 text-stone-400">
              Tu plan actual
            </div>
          ) : PAYMENTS_ENABLED ? (
            <PlanButton
              planId="lifetime"
              label="Comprar acceso de por vida"
              isDark={false}
              disabled={isPlanBlocked("lifetime", currentPlan)}
            />
          ) : (
            <PlanSoon />
          )}
        </div>

        {/* 3 y 6 meses */}
        {(["quarterly", "biannual"] as const).map((id) => {
          const info = {
            quarterly: { label: "3 meses", price: "$14.900", savings: "Ahorrás 11%" },
            biannual: { label: "6 meses", price: "$26.900", savings: "Ahorrás 19%" },
          }[id];

          return (
            <div
              key={id}
              className="border border-stone-200 rounded-xl px-4 py-3 flex items-center justify-between bg-white"
            >
              <div>
                <span className="text-sm font-medium text-stone-900">{info.label}</span>
                <span className="ml-2 text-xs text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                  {info.savings}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-500">{info.price}</span>
                {currentPlan === id ? (
                  <PlanActive />
                ) : isPlanBlocked(id, currentPlan) ? (
                  <PlanUnavailable />
                ) : PAYMENTS_ENABLED ? (
                  <PlanButton planId={id} label="Elegir" isDark={true} compact />
                ) : (
                  <PlanSoon />
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
