"use server";
import { MercadoPagoConfig, Preference, PreApproval, PreApprovalPlan } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// ── Pagos únicos ─────────────────────────────────────────────────────

const PLANES = {
  quarterly: {
    title: "Recipear Pro — 3 meses",
    price: 14900, // 10,60 usd
  },
  biannual: {
    title: "Recipear Pro — 6 meses",
    price: 26900, // 19,20 usd
  },
  lifetime: {
    title: "Recipear De por vida",
    price: 56000, // 40 usd
  },
} as const;

type OneTimePlanId = keyof typeof PLANES;

export async function createPaymentPreference(planId: OneTimePlanId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const plan = PLANES[planId];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const preference = new Preference(mp);
  const response = await preference.create({
    body: {
      items: [
        {
          id: planId,
          title: plan.title,
          quantity: 1,
          unit_price: plan.price,
          currency_id: "ARS",
        },
      ],
      payer: { email: user.email },
      back_urls: {
        success: `${siteUrl}/pago/exitoso?plan=${planId}`,
        failure: `${siteUrl}/planes?error=pago_fallido`,
        pending: `${siteUrl}/pago/pendiente`,
      },
      external_reference: `${user.id}|${planId}`,
      notification_url: `${siteUrl}/api/webhooks/mp`,
    },
  });

  return response.init_point!;
}

// ── Suscripciones ─────────────────────────────────────────────────────

const SUBSCRIPTION_PLANS = {
  monthly: {
    // ID del plan creado en MP (ver setupSubscriptionPlans)
    mpPlanId: process.env.MP_PLAN_MONTHLY_ID!,
    title: "Recipear Pro — 1 mes",
  },
  yearly: {
    mpPlanId: process.env.MP_PLAN_YEARLY_ID!,
    title: "Recipear Pro — 1 año",
  },
} as const;

type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS;

export async function createSubscription(planId: SubscriptionPlanId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const plan = SUBSCRIPTION_PLANS[planId];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const preApproval = new PreApproval(mp);
  const response = await preApproval.create({
    body: {
      preapproval_plan_id: plan.mpPlanId,
      reason: plan.title,
      payer_email: user.email,
      // prefijo "sub_" para distinguirlo de pagos únicos en el webhook
      external_reference: `${user.id}|sub_${planId}`,
      back_url: `${siteUrl}/pago/exitoso?plan=${planId}`,
    },
  });

  return response.init_point!;
}

// ── Setup único: crear los planes en MP ──────────────────────────────
// Correr UNA sola vez desde el backoffice → copiar los IDs al .env

export async function setupSubscriptionPlans(backUrl: string) {
  const planApi = new PreApprovalPlan(mp);

  const [monthly, yearly] = await Promise.all([
    planApi.create({
      body: {
        reason: "Recipear Pro Mensual",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 5586, // 3,99 usd
          currency_id: "ARS",
          free_trial: {
            frequency: 7,
            frequency_type: "days",
          },
        },
        back_url: backUrl,
        payment_methods_allowed: {
          payment_types: [{ id: "credit_card" }, { id: "debit_card" }],
        },
      },
    }),
    planApi.create({
      body: {
        reason: "Recipear Pro Anual",
        auto_recurring: {
          frequency: 12,
          frequency_type: "months",
          transaction_amount: 40600, // 29 usd
          currency_id: "ARS",
        },
        back_url: backUrl,
        payment_methods_allowed: {
          payment_types: [{ id: "credit_card" }, { id: "debit_card" }],
        },
      },
    }),
  ]);

  return {
    MP_PLAN_MONTHLY_ID: monthly.id,
    MP_PLAN_YEARLY_ID: yearly.id,
  };
}
