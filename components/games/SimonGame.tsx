"use client";

import { useEffect, useRef, useState } from "react";
import type { GameComponentProps } from "@/components/games/types";
import { Button } from "@/components/ui/Button";

const STEPS_TO_WIN = 5;

type Phase = "idle" | "showing" | "input" | "failed" | "won";

const pads = [
  { id: 0, color: "bg-[#ffd166]", active: "bg-[#ffbe0b]", label: "☀️" },
  { id: 1, color: "bg-[#90dbf4]", active: "bg-[#48bfe3]", label: "💧" },
  { id: 2, color: "bg-[#b9fbc0]", active: "bg-[#57cc99]", label: "🍀" },
  { id: 3, color: "bg-[#ffc6ff]", active: "bg-[#ff8fab]", label: "🎵" }
] as const;

const randomPad = () => Math.floor(Math.random() * pads.length);

export function SimonGame({ onComplete }: GameComponentProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [inputIndex, setInputIndex] = useState(0);
  const [message, setMessage] = useState("Presiona empezar y memoriza la secuencia.");
  const completedRef = useRef(false);

  useEffect(() => {
    if (phase !== "showing" || sequence.length === 0) {
      return;
    }

    const timeoutIds: number[] = [];

    sequence.forEach((padId, index) => {
      timeoutIds.push(
        window.setTimeout(() => {
          setActivePad(padId);
        }, 250 + index * 650)
      );

      timeoutIds.push(
        window.setTimeout(() => {
          setActivePad(null);
        }, 520 + index * 650)
      );
    });

    timeoutIds.push(
      window.setTimeout(() => {
        setInputIndex(0);
        setPhase("input");
        setMessage("Tu turno: repite la secuencia.");
      }, 300 + sequence.length * 650)
    );

    return () => timeoutIds.forEach((id) => window.clearTimeout(id));
  }, [phase, sequence]);

  const startGame = () => {
    setSequence([randomPad()]);
    setPhase("showing");
    setInputIndex(0);
    setMessage("Mira la secuencia...");
  };

  const onPadClick = (padId: number) => {
    if (phase !== "input") {
      return;
    }

    if (padId !== sequence[inputIndex]) {
      setPhase("failed");
      setMessage("Fallaste la melodía. Reintenta desde cero 💫");
      return;
    }

    const nextIndex = inputIndex + 1;
    if (nextIndex < sequence.length) {
      setInputIndex(nextIndex);
      return;
    }

    if (sequence.length >= STEPS_TO_WIN) {
      setPhase("won");
      setMessage("Secuencia perfecta. Sello conseguido 💘");
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }

    setMessage("Bien. Se añade un paso...");
    setPhase("showing");
    setSequence((prev) => [...prev, randomPad()]);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/80">Llega a una secuencia de {STEPS_TO_WIN} pasos.</p>

      <p className="rounded-xl border border-wine/20 bg-white/75 px-4 py-2 text-sm font-semibold text-wine">{message}</p>

      <div className="grid max-w-sm grid-cols-2 gap-3">
        {pads.map((pad) => {
          const highlighted = activePad === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => onPadClick(pad.id)}
              disabled={phase === "showing" || phase === "idle"}
              className={`aspect-square rounded-2xl border border-wine/20 text-3xl transition ${
                highlighted ? `${pad.active} scale-[1.03] shadow-lg` : pad.color
              }`}
            >
              {pad.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(phase === "idle" || phase === "failed" || phase === "won") && (
          <Button onClick={startGame}>{phase === "idle" ? "Empezar" : "Reintentar"}</Button>
        )}
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine/70">
          Ronda actual: {Math.max(sequence.length, 1)}/{STEPS_TO_WIN}
        </p>
      </div>
    </div>
  );
}
