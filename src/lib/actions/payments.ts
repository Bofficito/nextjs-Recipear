'use server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createClient } from '@/lib/supabase/server'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

const PLANES = {
  monthly: {
    title: 'Recipear Pro Mensual',
    price: 5586,
  },
  yearly: {
    title: 'Recipear Pro Anual',
    price: 40600,
  },
  lifetime: {
    title: 'Recipear Lifetime',
    price: 56000,
  },
} as const

type PlanId = keyof typeof PLANES

export async function createPaymentPreference(planId: PlanId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const plan = PLANES[planId]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

    const preference = new Preference(mp)

    const response = await preference.create({
    body: {
        items: [{
        id:          planId,
        title:       plan.title,
        quantity:    1,
        unit_price:  plan.price,
        currency_id: 'ARS',
        }],
        payer: {
        email: user.email,
        },
        back_urls: {
        success: `${siteUrl}/pago/exitoso?plan=${planId}`,
        failure: `${siteUrl}/planes?error=pago_fallido`,
        pending: `${siteUrl}/pago/pendiente`,
        },
        external_reference: `${user.id}|${planId}`,
        notification_url:   `${siteUrl}/api/webhooks/mp`,
    },
})

  return response.init_point!
}