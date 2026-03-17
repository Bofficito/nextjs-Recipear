"use client";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/recipes";

type Props = {
  id: string;
  isFavorite: boolean;
};

export default function FavoriteButton({ id, isFavorite }: Props) {
  const [active, setActive] = useState(isFavorite);
  const [, startTransition] = useTransition();

  function handleToggle() {
    const next = !active;
    setActive(next);
    startTransition(() => {
      toggleFavorite(id, next);
    });
  }

  return (
    <button
      onClick={handleToggle}
      title={active ? "Quitar de guardadas" : "Guardar"}
      className={`flex items-center justify-center w-9 h-9 border rounded-xl transition-colors ${
        active
          ? "border-red-200 text-red-400 hover:border-red-300"
          : "border-stone-200 text-stone-400 hover:border-stone-400"
      }`}
    >
      <Heart size={15} className={active ? "fill-red-400" : ""} />
    </button>
  );
}
