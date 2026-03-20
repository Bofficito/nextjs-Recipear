# Recipear

Tu recetario personal. Guardá, organizá y cocinás tus recetas desde cualquier dispositivo.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-green?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

**[recipear.com](https://recipear.com)**

---

## Features

- **Recetas completas** — título, categoría, método, tiempo, ingredientes, condimentos, pasos y fuente/referencia
- **Etiquetas** — organizá tus recetas con tags personalizados
- **Escalar porciones** — ajustá las cantidades en tiempo real, reflejado en modo cocina
- **Modo cocina** — pantalla limpia paso a paso con ingredientes relevantes por paso, sin que se apague el celular
- **Favoritos** — guardá las recetas que más usás
- **Papelera** — eliminación suave con posibilidad de restaurar
- **Compartir receta** — generá un link público para compartir cualquier receta
- **Compartir en Instagram** — card 1080×1350 de la receta lista para compartir desde mobile
- **PDF por receta** — descargá una receta individual en PDF con nombre descriptivo
- **Exportar recetario (book)** — descargá todas tus recetas como libro PDF con portada e índice
- **Importar desde URL** — pegás un link y la IA extrae la receta automáticamente *(Pro)*
- **Búsqueda en tiempo real** — por nombre, ingrediente o categoría
- **Filtro por categoría** — navegá recetas por tipo
- **Multi-usuario** — cada usuario ve solo sus propias recetas (RLS)
- **Planes** — suscripciones mensuales/anuales y pagos únicos via MercadoPago
- **Feedback** — formulario integrado para sugerencias
- **Backoffice** — gestión de categorías, unidades, métodos, tiempos y usuarios
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
| [next/og](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) | OG image y cards de recetas (Satori) |
| [MercadoPago](https://mercadopago.com) | Pagos únicos y suscripciones |
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
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_ID=uuid-del-usuario-admin
MP_ACCESS_TOKEN=...
MP_WEBHOOK_SECRET=...
MP_PLAN_MONTHLY_ID=...
MP_PLAN_YEARLY_ID=...
```

### 3. Base de datos

Ejecutá el SQL de setup en el editor de Supabase. El schema incluye:

- `recipes` — recetas de cada usuario con RLS
- `categories`, `units`, `methods`, `time_ranges` — listas del backoffice
- `profiles` — plan del usuario y estado de suscripción
- `tags` — etiquetas personalizadas por usuario

**Triggers requeridos:**
- `before_recipe_insert` — valida límite de recetas según plan antes de insertar
- `recipes_updated_at` — actualiza `updated_at` automáticamente

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
│   │   ├── planes/       # Suscripciones y pagos
│   │   ├── pago/         # Resultado de pagos (MercadoPago)
│   │   ├── feedback/     # Formulario de feedback
│   │   └── backoffice/   # Gestión de listas y usuarios (solo admin)
│   ├── r/[id]/           # Receta pública compartida
│   ├── opengraph-image.tsx # OG image dinámica
│   └── api/
│       ├── import-recipe/ # Importación con IA
│       ├── book-pdf/      # PDF del recetario completo
│       ├── recipe-pdf/    # PDF de receta individual
│       ├── recipe-card/   # Card de receta para compartir (1080×1350 PNG)
│       └── webhooks/mp/   # Webhook de MercadoPago
├── components/
│   ├── layout/           # Header, MobileMenu
│   ├── pdf/              # BookPDF, RecipePDF
│   ├── recipes/          # RecipeCard, RecipeForm, RecipeList, TagSelector, etc.
│   └── ui/               # Toast, ToastProvider
└── lib/
    ├── actions/          # Server Actions (auth, recipes, tags, backoffice, payments, profile, admin, feedback)
    ├── supabase/         # Clientes de Supabase
    └── types.ts          # Tipos globales
```

---

## Planes

| Plan | Tipo | Recetas |
|---|---|---|
| **Free** | — | 10 |
| **Mensual** | Suscripción (con 7 días de prueba) | Ilimitadas |
| **Anual** | Suscripción | Ilimitadas |
| **Trimestral** | Pago único | Ilimitadas |
| **Semestral** | Pago único | Ilimitadas |
| **De por vida** | Pago único | Ilimitadas |

Las suscripciones usan la API `PreApproval` de MercadoPago. Los pagos únicos usan `Preference`. Los webhooks en `/api/webhooks/mp` activan/desactivan el plan automáticamente.

---

## Roles

| Rol | Acceso |
|---|---|
| **Usuario free** | CRUD de sus recetas (hasta 10), búsqueda, modo cocina, favoritos, etiquetas, papelera, compartir, PDF |
| **Usuario pro** | Todo lo anterior (recetas ilimitadas) + importar recetas desde URL |
| **Admin** | Todo lo anterior + backoffice + gestión de planes de usuarios |

El admin se define por `ADMIN_ID` en las variables de entorno. El plan se gestiona desde `profiles` y se activa/desactiva via webhooks de MercadoPago.

---

## Deploy

El proyecto está deployado en [Vercel](https://vercel.com). Cada push a `main` genera un deploy automático.

Variables de entorno necesarias en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_ID`
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET`
- `MP_PLAN_MONTHLY_ID`
- `MP_PLAN_YEARLY_ID`

---

## Licencia

MIT
