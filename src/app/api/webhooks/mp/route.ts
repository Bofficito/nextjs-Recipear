import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  // MP manda distintos tipos de notificaciones
  if (body.type !== "payment") {
    return NextResponse.json({ ok: true });
  }

  const paymentId = body.data?.id;
  if (!paymentId) return NextResponse.json({ ok: true });

  try {
    const payment = new Payment(mp);
    const data = await payment.get({ id: paymentId });

    if (data.status !== "approved") {
      return NextResponse.json({ ok: true });
    }

    // external_reference = "userId|planId"
    const [userId, planId] = (data.external_reference ?? "").split("|");
    if (!userId || !planId) return NextResponse.json({ ok: true });

    const supabase = await createClient();

    let planUpdate: Record<string, any> = { plan: planId };

    // si es mensual o anual, calcular fecha de expiración
    if (planId === "monthly") {
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      planUpdate.plan_expires_at = expires.toISOString();
      planUpdate.plan_type = "monthly";
    } else if (planId === "yearly") {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      planUpdate.plan_expires_at = expires.toISOString();
      planUpdate.plan_type = "yearly";
    } else if (planId === "lifetime") {
      planUpdate.plan_type = "lifetime";
      planUpdate.plan_expires_at = null;
    }

    await supabase.from("profiles").update(planUpdate).eq("id", userId);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("webhook error:", e);
    return NextResponse.json({ error: "webhook error" }, { status: 500 });
  }
}
