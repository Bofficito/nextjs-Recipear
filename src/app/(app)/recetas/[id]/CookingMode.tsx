"use client";
import { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChefHat,
  Timer,
  Play,
  Square,
  Pause,
} from "lucide-react";
import type { Ingredient } from "@/lib/types";

type Props = {
  title: string;
  steps: string;
  ingredients: Ingredient[];
  onClose: () => void;
};

function parseSteps(steps: string): string[] {
  return steps
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getStepIngredients(step: string, ingredients: Ingredient[]): Ingredient[] {
  const stepNorm = normalize(step);
  return ingredients.filter((ing) => {
    const name = normalize(ing.name.trim());
    return name.length >= 3 && stepNorm.includes(name);
  });
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// — Cronómetro global —
function GlobalTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setRunning((r) => !r)}
        className="text-stone-600 hover:text-stone-300 transition-colors"
      >
        {running ? <Pause size={13} /> : <Play size={13} />}
      </button>
      <span className="text-sm text-stone-400 font-mono tabular-nums">
        {formatTime(seconds)}
      </span>
    </div>
  );
}

// — Timer por paso —
function StepTimer() {
  const [input, setInput] = useState("");
  const [seconds, setSeconds] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  function playAlarm() {
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {}
  }

  function start() {
    const mins = parseFloat(input);
    if (!mins || mins <= 0) return;
    setSeconds(Math.round(mins * 60));
    setRunning(true);
    setDone(false);
  }

  function stop() {
    setRunning(false);
    setSeconds(null);
    setInput("");
    setDone(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => {
    if (!running || seconds === null) return;
    if (seconds === 0) {
      setRunning(false);
      setDone(true);
      playAlarm();
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s !== null ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, seconds]);

  // reset al cambiar de paso
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (done)
    return (
      <div className="flex items-center gap-3 bg-green-950 border border-green-800 rounded-xl px-4 py-3">
        <Timer size={15} className="text-green-400" />
        <span className="text-green-400 text-sm">¡Timer completado!</span>
        <button
          onClick={stop}
          className="ml-auto text-green-600 hover:text-green-400 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );

  if (running && seconds !== null)
    return (
      <div
        className={`flex items-center gap-3 border rounded-xl px-4 py-2.5 transition-colors ${
          seconds <= 10
            ? "bg-red-950 border-red-800"
            : "bg-stone-900 border-stone-700"
        }`}
      >
        <Timer
          size={14}
          className={seconds <= 10 ? "text-red-400" : "text-stone-400"}
        />
        <span
          className={`font-mono text-sm tabular-nums ${seconds <= 10 ? "text-red-400" : "text-white"}`}
        >
          {formatTime(seconds)}
        </span>
        <button
          onClick={stop}
          className="ml-auto text-stone-600 hover:text-white transition-colors"
        >
          <Square size={14} />
        </button>
      </div>
    );

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 flex-1">
        <Timer size={14} className="text-stone-500 flex-shrink-0" />
        <input
          type="number"
          min="0.5"
          step="0.5"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && start()}
          placeholder="Tiempo en minutos..."
          className="bg-transparent text-sm text-white outline-none w-full placeholder:text-stone-600"
        />
      </div>
      <button
        onClick={start}
        disabled={!input}
        className="flex items-center gap-1.5 bg-stone-700 hover:bg-stone-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm px-4 py-2.5 rounded-xl transition-colors"
      >
        <Play size={13} />
        Iniciar
      </button>
    </div>
  );
}

export default function CookingMode({
  title,
  steps,
  ingredients,
  onClose,
}: Props) {
  const parsedSteps = parseSteps(steps);
  const [current, setCurrent] = useState(0);
  const isFirst = current === 0;
  const isLast = current === parsedSteps.length - 1;
  const stepIngredients = getStepIngredients(parsedSteps[current], ingredients);

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator)
          wakeLock = await navigator.wakeLock.request("screen");
      } catch {}
    }
    requestWakeLock();
    return () => {
      wakeLock?.release();
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && !isLast) setCurrent((c) => c + 1);
      if (e.key === "ArrowLeft" && !isFirst) setCurrent((c) => c - 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFirst, isLast, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute("content");
    meta?.setAttribute("content", "#0c0a09");

    return () => {
      document.body.style.overflow = "";
      if (meta && prev) meta.setAttribute("content", prev);
    };
  }, []);

  return (
    <div className="fixed inset-0 h-svh bg-stone-950 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800">
        <div className="flex items-center gap-3 text-stone-400">
          <ChefHat size={16} />
          <span className="text-sm font-serif">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <GlobalTimer />
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Paso actual */}
      <div className="flex-1 flex flex-col px-8 py-8 overflow-y-auto min-h-0">
        {/* Contador */}
        <div className="text-stone-600 text-sm mb-6 tracking-wider uppercase text-center">
          Paso {current + 1} de {parsedSteps.length}
        </div>

        {/* Texto — ocupa el espacio disponible */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {stepIngredients.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 max-w-xl">
              {stepIngredients.map((ing, i) => (
                <span
                  key={i}
                  className="text-xs text-stone-400 border border-stone-700 rounded-lg px-2.5 py-1"
                >
                  {[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
                </span>
              ))}
            </div>
          )}
          <p className="text-white text-2xl md:text-3xl font-serif leading-relaxed text-center max-w-2xl">
            {parsedSteps[current]}
          </p>
        </div>
      </div>

      {/* Barra de progreso + timer — fijos sobre la navegación */}
      <div className="px-8 pb-4 flex flex-col items-center gap-4 border-t border-stone-800 pt-4">
        <div className="flex gap-1.5">
          {parsedSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white w-8"
                  : i < current
                    ? "bg-stone-600 w-4"
                    : "bg-stone-800 w-4"
              }`}
            />
          ))}
        </div>
        <div className="w-full max-w-sm">
          <StepTimer key={current} />
        </div>
      </div>

      {ingredients.length > 0 && <IngredientDrawer ingredients={ingredients} />}

      {/* Navegación */}
      <div className="flex items-center justify-between px-6 py-6 border-t border-stone-800">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={isFirst}
          className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
          Anterior
        </button>

        {isLast ? (
          <button
            onClick={onClose}
            className="bg-white text-stone-900 text-sm px-6 py-2.5 rounded-xl hover:bg-stone-100 transition-colors font-medium"
          >
            Terminar
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors"
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function IngredientDrawer({ ingredients }: { ingredients: Ingredient[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-stone-800">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-stone-400 hover:text-white transition-colors"
      >
        <span className="text-xs uppercase tracking-wider">
          Ingredientes ({ingredients.length})
        </span>
        <ChevronLeft
          size={16}
          className={`transition-transform duration-200 ${open ? "-rotate-90" : "rotate-90"}`}
        />
      </button>

      {open && (
        <div className="px-6 pb-4 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {ingredients.map((ing, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-stone-300"
            >
              <span className="w-1 h-1 rounded-full bg-stone-600 flex-shrink-0" />
              {[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
