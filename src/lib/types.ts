import {
  Sun, UtensilsCrossed, Coffee, Moon,
  Cake, Cookie, GlassWater, Pin,
  type LucideIcon
} from 'lucide-react'

export type Ingredient = {
  qty: string
  unit: string
  name: string
}

export type Category =
  | 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena'
  | 'Postre'   | 'Snack'    | 'Bebida'   | 'Otra'

export type Recipe = {
  id: string
  user_id: string
  title: string
  category: Category
  time: string | null
  notes: string | null
  steps: string | null
  ingredients: Ingredient[]
  created_at: string
  updated_at: string
}

export type RecipeInsert = Omit<Recipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export const CATEGORIES: Category[] = [
  'Desayuno', 'Almuerzo', 'Merienda', 'Cena',
  'Postre', 'Snack', 'Bebida', 'Otra'
]

export const UNITS = [
  { label: '—',        value: '' },
  { label: 'g',        value: 'g' },
  { label: 'kg',       value: 'kg' },
  { label: 'ml',       value: 'ml' },
  { label: 'l',        value: 'l' },
  { label: 'cda',      value: 'cda' },
  { label: 'cdita',    value: 'cdita' },
  { label: 'taza',     value: 'taza' },
  { label: 'unidad',   value: 'unidad' },
  { label: 'rebanada', value: 'rebanada' },
  { label: 'pizca',    value: 'pizca' },
  { label: 'al gusto', value: 'al gusto' },
]

export const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  Desayuno: Sun,
  Almuerzo: UtensilsCrossed,
  Merienda: Coffee,
  Cena:     Moon,
  Postre:   Cake,
  Snack:    Cookie,
  Bebida:   GlassWater,
  Otra:     Pin,
}

export const CATEGORY_ICON_COMPONENTS: Record<Category, LucideIcon> = {
  Desayuno: Sun,
  Almuerzo: UtensilsCrossed,
  Merienda: Coffee,
  Cena:     Moon,
  Postre:   Cake,
  Snack:    Cookie,
  Bebida:   GlassWater,
  Otra:     Pin,
}