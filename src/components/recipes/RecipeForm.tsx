"use client";
import { useState } from "react";
import type {
  Recipe,
  Ingredient,
  RecipeInsert,
  Category,
  Unit,
  Method,
  TimeRange,
  Tag,
} from "@/lib/types";
import { X, ChevronDown } from "lucide-react";
import Link from "next/link";
import CondimentsInput from "./CondimentsInput";
import TagSelector from "./TagSelector";

type Props = {
  initial?: Recipe;
  onSubmit: (data: RecipeInsert, tagIds: string[]) => Promise<void>;
  pending?: boolean;
  categories: Category[];
  units: Unit[];
  methods: Method[];
  timeRanges: TimeRange[];
  maxIngredients: number | null;
  tags: Tag[];
  initialTags?: string[];
};

const emptyIngredient = (): Ingredient => ({ qty: "", unit: "", name: "" });
const selectClass =
  "appearance-none w-full border border-stone-200 rounded-xl pl-4 pr-9 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors cursor-pointer";
const selectSmallClass =
  "appearance-none w-full border border-stone-200 rounded-lg pl-2 pr-7 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors cursor-pointer";

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
      />
    </div>
  );
}

export default function RecipeForm({
  initial,
  onSubmit,
  pending,
  categories,
  units,
  methods,
  timeRanges,
  maxIngredients,
  tags,
  initialTags,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(
    initial?.category ?? categories[0]?.name ?? "",
  );
  const [method, setMethod] = useState(initial?.method ?? "");
  const [timeRange, setTimeRange] = useState(initial?.time ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [sourceUrl, setSourceUrl] = useState(initial?.source_url ?? "");
  const [steps, setSteps] = useState(initial?.steps ?? "");
  const [condiments, setCondiments] = useState<string[]>(
    initial?.condiments ?? [],
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags ?? []);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initial?.ingredients?.length
      ? [...initial.ingredients, emptyIngredient()]
      : [emptyIngredient()],
  );
  const [error, setError] = useState("");

  const filledCount = ingredients.filter((i) => i.name.trim()).length;
  const atLimit = maxIngredients !== null && filledCount >= maxIngredients;

  function updateIngredient(i: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) => {
      const updated = prev.map((row, idx) =>
        idx === i ? { ...row, [field]: value } : row,
      );
      const last = updated[updated.length - 1];
      if (
        last.name.trim() &&
        (maxIngredients === null || filledCount < maxIngredients)
      ) {
        updated.push(emptyIngredient());
      }
      return updated;
    });
  }

  function removeIngredient(i: number) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    const filtered = ingredients.filter((ing) => ing.name.trim());
    await onSubmit(
      {
        title: title.trim(),
        category,
        method: method || null,
        time: timeRange || null,
        notes: notes.trim() || null,
        steps: steps.trim() || null,
        ingredients: filtered,
        condiments,
        source_url: sourceUrl.trim() || null,
      },
      selectedTags,
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">
          Nombre *
        </label>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          placeholder="Ej: Tarta de espinaca"
          className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider text-stone-400">
            Categoría
          </label>
          <SelectWrapper>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider text-stone-400">
            Método
          </label>
          <SelectWrapper>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={selectClass}
            >
              <option value="">— Sin especificar</option>
              {methods.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">
          Tiempo
        </label>
        <div className="grid grid-cols-2 gap-3">
          <SelectWrapper>
            <select
              value={
                timeRanges.some((t) => t.label === timeRange) ? timeRange : ""
              }
              onChange={(e) => setTimeRange(e.target.value)}
              className={selectClass}
            >
              <option value="">Seleccionar...</option>
              {timeRanges.map((t) => (
                <option key={t.id} value={t.label}>
                  {t.label}
                </option>
              ))}
            </select>
          </SelectWrapper>
          <input
            value={
              timeRanges.some((t) => t.label === timeRange) ? "" : timeRange
            }
            onChange={(e) => setTimeRange(e.target.value)}
            placeholder="O escribí: 1h 20min"
            className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
          />
        </div>
        <p className="text-xs text-stone-400">
          Seleccioná un rango o escribí el tiempo exacto
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">
          Nota personal
        </label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Receta de la abuela, sin TACC..."
          className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider text-stone-400">
            Ingredientes
          </label>
          <span
            className={`text-xs ${atLimit ? "text-red-400" : "text-stone-400"}`}
          >
            {maxIngredients === null
              ? `${filledCount} ingredientes`
              : `${filledCount}/${maxIngredients}`}
          </span>
        </div>
        {ingredients.map((ing, i) => {
          const isLast = i === ingredients.length - 1;
          if (isLast && atLimit)
            return (
              <Link
                key={i}
                href="/planes"
                className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 hover:border-amber-300 transition-colors"
              >
                Límite de {maxIngredients} ingredientes alcanzado — ver planes
                para agregar más
              </Link>
            );
          return (
            <div
              key={i}
              className="grid grid-cols-[4rem_1fr_2fr_2rem] gap-2 items-center"
            >
              <input
                value={ing.qty}
                onChange={(e) => updateIngredient(i, "qty", e.target.value)}
                placeholder="1, 2, 3..."
                className="border border-stone-200 rounded-lg px-2 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
              />
              <SelectWrapper>
                <select
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                  className={selectSmallClass}
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
              <input
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
                placeholder={isLast ? "Agregar ingrediente..." : ""}
                className={`border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors ${isLast ? "col-span-2" : ""}`}
              />
              {!isLast && (
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="flex items-center justify-center text-stone-300 hover:text-red-400 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-wider text-stone-400">
          Condimentos / a gusto
        </label>
        <CondimentsInput value={condiments} onChange={setCondiments} />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-stone-400">
            Etiquetas
          </label>
          <TagSelector
            tags={tags}
            selected={selectedTags}
            onChange={setSelectedTags}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">
          Fuente / referencia
        </label>
        <input
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          type="url"
          placeholder="https://..."
          className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
        />
        <p className="text-xs text-stone-400">
          Link al tutorial, video o receta original
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">
          Preparación
        </label>
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Escribí los pasos..."
          rows={6}
          className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors resize-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-stone-900 text-white rounded-xl py-3 text-sm hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar receta"}
      </button>
    </form>
  );
}
