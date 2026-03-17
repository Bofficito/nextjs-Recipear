import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment, PreApproval } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    if (body.type === "payment") {
      return handlePayment(body.data?.id);
    }

    if (body.type === "subscription_preapproval") {
      return handleSubscriptionStatus(body.data?.id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("webhook error:", e);
    return NextResponse.json({ error: "webhook error" }, { status: 500 });
  }
}

// ── Pago aprobado (pago único o cargo de suscripción) ─────────────────

async function handlePayment(paymentId: string) {
  if (!paymentId) return NextResponse.json({ ok: true });

  const payment = new Payment(mp);
  const data = await payment.get({ id: paymentId });
  if (data.status !== "approved") return NextResponse.json({ ok: true });

  const [userId, planId] = (data.external_reference ?? "").split("|");
  if (!userId || !planId) return NextResponse.json({ ok: true });

  const supabase = await createClient();
  const update: Record<string, any> = {};

  if (planId === "quarterly") {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 3);
    update.plan = "quarterly";
    update.plan_type = "quarterly";
    update.plan_expires_at = expires.toISOString();
  } else if (planId === "biannual") {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 6);
    update.plan = "biannual";
    update.plan_type = "biannual";
    update.plan_expires_at = expires.toISOString();
  } else if (planId === "lifetime") {
    update.plan = "lifetime";
    update.plan_type = "lifetime";
    update.plan_expires_at = null;
  } else if (planId === "sub_monthly") {
    // cargo de suscripción mensual: extendemos 1 mes desde hoy
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    update.plan = "monthly";
    update.plan_type = "monthly";
    update.plan_expires_at = expires.toISOString();
  } else if (planId === "sub_yearly") {
    // cargo de suscripción anual: extendemos 1 año desde hoy
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    update.plan = "yearly";
    update.plan_type = "yearly";
    update.plan_expires_at = expires.toISOString();
  }

  if (Object.keys(update).length > 0) {
    await supabase.from("profiles").update(update).eq("id", userId);
  }

  return NextResponse.json({ ok: true });
}

// ── Cambio de estado de suscripción ──────────────────────────────────

async function handleSubscriptionStatus(subscriptionId: string) {
  if (!subscriptionId) return NextResponse.json({ ok: true });

  const preApproval = new PreApproval(mp);
  const data = await preApproval.get({ id: subscriptionId });

  const [userId, planId] = (data.external_reference ?? "").split("|");
  if (!userId || !planId) return NextResponse.json({ ok: true });

  const supabase = await createClient();

  if (data.status === "authorized") {
    // suscripción aprobada — activamos el plan hasta el próximo cargo
    // (el primer cargo real llegará como "payment" cuando termine el trial)
    const planName = planId === "sub_monthly" ? "monthly" : "yearly";
    const expires = new Date();
    if (planName === "monthly") {
      expires.setDate(expires.getDate() + 7); // cubre el período de prueba
    } else {
      expires.setFullYear(expires.getFullYear() + 1);
    }

    await supabase
      .from("profiles")
      .update({
        plan: planName,
        plan_type: planName,
        plan_expires_at: expires.toISOString(),
        subscription_id: subscriptionId,
      })
      .eq("id", userId);
  } else if (
    data.status === "cancelled" ||
    data.status === "paused" ||
    data.status === "expired"
  ) {
    await supabase
      .from("profiles")
      .update({
        plan: "free",
        plan_type: null,
        plan_expires_at: null,
        subscription_id: null,
      })
      .eq("id", userId);
  }

  return NextResponse.json({ ok: true });
}
