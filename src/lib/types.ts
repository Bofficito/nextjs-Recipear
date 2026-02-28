import {
  Sun, UtensilsCrossed, Coffee, Moon,
  Cake, Cookie, GlassWater, Pin,
  type LucideIcon
} from 'lucide-react'

export type Ingredient = {
  qty:  string
  unit: string
  name: string
}

export type Recipe = {
  id:          string
  user_id:     string
  title:       string
  category:    string
  method:      string | null
  time:        string | null
  notes:       string | null
  steps:       string | null
  ingredients: Ingredient[]
  is_favorite: boolean
  created_at:  string
  updated_at:  string
}

export type RecipeInsert = Omit<Recipe, 'id' | 'user_id' | 'is_favorite' | 'created_at' | 'updated_at'>

export type Category = {
  id:       string
  name:     string
  icon:     string | null
  position: number
}

export type Unit = {
  id:       string
  label:    string
  value:    string
  position: number
}

export type Method = {
  id:       string
  name:     string
  position: number
}

export type TimeRange = {
  id:       string
  label:    string
  minutes:  number
  position: number
}

export const LUCIDE_ICONS: Record<string, LucideIcon> = {
  Sun, UtensilsCrossed, Coffee, Moon,
  Cake, Cookie, GlassWater, Pin,
}