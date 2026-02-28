import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { url, categories, units } = await req.json()

  let html: string
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    html = await res.text()
  } catch (e) {
    return NextResponse.json({ error: 'No se pudo acceder a la URL' }, { status: 400 })
  }

  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 12000)

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role:    'user',
        content: `Extraé la receta de este texto y devolvé SOLO un JSON válido con esta estructura exacta, sin explicaciones ni markdown:
{
  "title": "nombre de la receta",
  "category": "una de estas: ${categories.join(', ')}",
  "method": null,
  "time": "tiempo estimado como string o null",
  "notes": null,
  "steps": "pasos de preparación, cada paso en una línea separada",
  "ingredients": [
    { "qty": "cantidad como string", "unit": "una de estas unidades: ${units.join(', ')}", "name": "nombre del ingrediente" }
  ]
}

Si no encontrás algún campo, usá null. El campo steps debe tener cada paso en una línea nueva (\\n).

Texto de la página:
${text}`
      }],
    }),
  })

  if (!anthropicRes.ok) {
    return NextResponse.json({ error: 'Error al procesar la receta' }, { status: 500 })
  }

  const data = await anthropicRes.json()
  const content = data.content?.[0]?.text ?? ''

  const clean = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  try {
    const recipe = JSON.parse(clean)
    return NextResponse.json(recipe)
  } catch {
    return NextResponse.json({ error: 'No se pudo parsear la receta' }, { status: 500 })
  }
}