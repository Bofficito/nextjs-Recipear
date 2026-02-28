# 🍽️ Recipear

Tu recetario personal. Guardá, organizá y cocinás tus recetas desde cualquier dispositivo.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-green?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

---

## ✨ Features

- **Recetas completas** — título, categoría, método, tiempo, ingredientes y pasos
- **Escalar porciones** — ajustá las cantidades en tiempo real
- **Modo cocina** — pantalla limpia paso a paso, sin que se apague el celular
- **Favoritos** — guardá las recetas que más usás
- **Importar desde URL** — pegás un link y la IA extrae la receta automáticamente *(Pro)*
- **Búsqueda en tiempo real** — por nombre, ingrediente o categoría
- **Multi-usuario** — cada usuario ve solo sus propias recetas
- **Backoffice** — gestión de categorías, unidades, métodos y tiempos

---

## 🚀 Stack

| Tecnología | Uso |
|---|---|
| [Next.js 16](https://nextjs.org) | Framework — App Router + Server Actions |
| [Supabase](https://supabase.com) | Auth + PostgreSQL + RLS |
| [TypeScript](https://www.typescriptlang.org) | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com) | Estilos |
| [Lucide React](https://lucide.dev) | Iconos |
| [Claude API](https://anthropic.com) | Importación de recetas con IA |

---

## 🛠️ Setup local

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
```

### 3. Base de datos

Ejecutá el SQL de setup en el editor de Supabase. El schema incluye:

- `recipes` — recetas de cada usuario con RLS
- `categories`, `units`, `methods`, `time_ranges` — listas del backoffice
- `profiles` — plan del usuario (`free` / `pro`)

### 4. Corré el proyecto

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

---

## 📁 Estructura

```
src/
├── app/
│   ├── (auth)/           # Login y registro
│   ├── (app)/            # App protegida
│   │   ├── page.tsx      # Home — lista de recetas
│   │   ├── backoffice/   # Gestión de listas (solo admin)
│   │   └── recetas/      # CRUD de recetas
│   └── api/
│       └── import-recipe/ # Endpoint de importación con IA
├── components/
│   ├── layout/           # Header
│   ├── recipes/          # RecipeCard, RecipeForm, RecipeList
│   └── ui/               # Toast
└── lib/
    ├── actions/          # Server Actions (auth, recipes, backoffice, profile)
    ├── supabase/         # Clientes de Supabase
    └── types.ts          # Tipos globales
```

---

## 🔐 Roles

| Rol | Acceso |
|---|---|
| **Usuario free** | CRUD de sus recetas, búsqueda, modo cocina, favoritos |
| **Usuario pro** | Todo lo anterior + importar recetas desde URL |
| **Admin** | Todo lo anterior + backoffice |

El admin se define por `user_id` hardcodeado en el proxy. El plan `pro` se gestiona desde la tabla `profiles`.

---

## 🌐 Deploy

El proyecto está deployado en [Vercel](https://vercel.com). Cada push a `main` genera un deploy automático.

Variables de entorno necesarias en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

---

## 📝 Licencia

MIT