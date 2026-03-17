# Recipear

Tu recetario personal. Guardá, organizá y cocinás tus recetas desde cualquier dispositivo.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-green?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

---

## Features

- **Recetas completas** — título, categoría, método, tiempo, ingredientes, condimentos y pasos
- **Etiquetas** — organizá tus recetas con tags personalizados
- **Escalar porciones** — ajustá las cantidades en tiempo real
- **Modo cocina** — pantalla limpia paso a paso, sin que se apague el celular
- **Favoritos** — guardá las recetas que más usás
- **Papelera** — eliminación suave con posibilidad de restaurar
- **Exportar recetario** — descargá todas tus recetas como PDF
- **PDF por receta** — descargá una receta individual en PDF
- **Compartir recetas** — generá un link público para compartir cualquier receta
- **Importar desde URL** — pegás un link y la IA extrae la receta automáticamente *(Pro)*
- **Búsqueda en tiempo real** — por nombre, ingrediente o categoría
- **Filtro por categoría** — navegá recetas por tipo
- **Multi-usuario** — cada usuario ve solo sus propias recetas
- **Planes** — suscripción Pro via MercadoPago
- **Feedback** — formulario integrado para sugerencias
- **Backoffice** — gestión de categorías, unidades, métodos y tiempos
- **Analytics** — integración con Vercel Analytics

---

## Stack

| Tecnología | Uso |
|---|---|
| [Next.js 16](https://nextjs.org) | Framework — App Router + Server Actions |
| [Supabase](https://supabase.com) | Auth + PostgreSQL + RLS |
| [TypeScript](https://www.typescriptlang.org) | Tipado estático |
| [Tailwind CSS v4](https://tailwindcss.com) | Estilos |
| [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) | Componentes UI |
| [Lucide React](https://lucide.dev) | Iconos |
| [React PDF](https://react-pdf.org) | Generación de PDFs |
| [MercadoPago](https://mercadopago.com) | Pagos y suscripciones |
| [Vercel Analytics](https://vercel.com/analytics) | Analytics |
| [Claude API](https://anthropic.com) | Importación de recetas con IA |

---

## Setup local

### 1. Cloná el repo

```bash
git clone https://github.com/tu-usuario/recipear.git
cd recipear
npm install
```

### 2. Variables de entorno

Creá un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MP_ACCESS_TOKEN=...
MP_WEBHOOK_SECRET=...
```

### 3. Base de datos

Ejecutá el SQL de setup en el editor de Supabase. El schema incluye:

- `recipes` — recetas de cada usuario con RLS
- `categories`, `units`, `methods`, `time_ranges` — listas del backoffice
- `profiles` — plan del usuario (`free` / `pro`)
- `tags` — etiquetas personalizadas por usuario

### 4. Corré el proyecto

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

---

## Estructura

```
src/
├── app/
│   ├── (landing)/        # Página de inicio pública
│   ├── (auth)/           # Login y registro
│   ├── (app)/            # App protegida
│   │   ├── recetario/    # Home — lista de recetas
│   │   ├── recetas/      # CRUD de recetas + modo cocina
│   │   ├── etiquetas/    # Gestión de etiquetas
│   │   ├── exportar/     # Exportar recetario a PDF
│   │   ├── papelera/     # Recetas eliminadas
│   │   ├── planes/       # Suscripción Pro
│   │   ├── pago/         # Resultado de pagos (MercadoPago)
│   │   ├── feedback/     # Formulario de feedback
│   │   └── backoffice/   # Gestión de listas (solo admin)
│   ├── r/[id]/           # Receta pública compartida
│   └── api/
│       ├── import-recipe/ # Importación con IA
│       ├── book-pdf/      # PDF del recetario completo
│       ├── recipe-pdf/    # PDF de receta individual
│       └── webhooks/mp/   # Webhook de MercadoPago
├── components/
│   ├── layout/           # Header, MobileMenu
│   ├── pdf/              # BookPDF, RecipePDF
│   ├── recipes/          # RecipeCard, RecipeForm, RecipeList, TagSelector, etc.
│   └── ui/               # Toast, ToastProvider
└── lib/
    ├── actions/          # Server Actions (auth, recipes, tags, backoffice, payments, profile, feedback)
    ├── supabase/         # Clientes de Supabase
    └── types.ts          # Tipos globales
```

---

## Roles

| Rol | Acceso |
|---|---|
| **Usuario free** | CRUD de sus recetas, búsqueda, modo cocina, favoritos, etiquetas, papelera, compartir, PDF |
| **Usuario pro** | Todo lo anterior + importar recetas desde URL |
| **Admin** | Todo lo anterior + backoffice |

El admin se define por `user_id` hardcodeado en el proxy. El plan `pro` se gestiona desde la tabla `profiles` y se activa via MercadoPago.

---

## Deploy

El proyecto está deployado en [Vercel](https://vercel.com). Cada push a `main` genera un deploy automático.

Variables de entorno necesarias en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET`

---

## Licencia

MIT
