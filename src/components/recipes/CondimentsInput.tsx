"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

const DEFAULTS = [
  "Sal",
  "Pimienta",
  "Pimentón",
  "Pimentón ahumado",
  "Ajo en polvo",
  "Cebolla en polvo",
  "Orégano",
  "Comino",
  "Curry",
  "Cúrcuma",
  "Perejil",
  "Albahaca",
  "Romero",
  "Tomillo",
  "Laurel",
  "Ají molido",
  "Nuez moscada",
  "Canela",
  "Azúcar",
  "Aceite de oliva",
];

type Props = {
  value: string[];
  onChange: (val: string[]) => void;
};

export default function CondimentsInput({ value, onChange }: Props) {
  const [input, setInput] = useState("");

  function add(name: string) {
    const trimmed = name.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  }

  function remove(name: string) {
    onChange(value.filter((v) => v !== name));
  }

  function handleInputKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      add(input);
      setInput("");
    }
  }

  const suggestions = DEFAULTS.filter(
    (d) =>
      !value.includes(d) &&
      (input === "" || d.toLowerCase().includes(input.toLowerCase())),
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Seleccionados */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((v) => (
            <span
              key={v}
              className="flex items-center gap-1.5 text-xs bg-stone-100 text-stone-700 rounded-lg px-2.5 py-1.5"
            >
              {v}
              <button
                type="button"
                onClick={() => remove(v)}
                className="text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input custom */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKey}
          placeholder="Buscar o agregar condimento..."
          className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
        />
        {input.trim() &&
          !DEFAULTS.some((d) => d.toLowerCase() === input.toLowerCase()) && (
            <button
              type="button"
              onClick={() => {
                add(input);
                setInput("");
              }}
              className="flex items-center gap-1.5 text-sm border border-stone-200 rounded-xl px-3 py-2.5 hover:border-stone-400 transition-colors text-stone-600"
            >
              <Plus size={13} />
              Agregar
            </button>
          )}
      </div>

      {/* Sugerencias */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 12).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-xs border border-stone-200 text-stone-500 rounded-lg px-2.5 py-1.5 hover:border-stone-400 hover:text-stone-700 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
