"use client";

import { useEffect, useRef, useState } from "react";
import type { GameComponentProps } from "@/components/games/types";
import { config } from "@/data/config";
import { Button } from "@/components/ui/Button";

export function StopClockGame({ onComplete }: GameComponentProps) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [diff, setDiff] = useState<number | null>(null);
  const completedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!running) {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      return;
    }

    startRef.current = performance.now();

    const tick = (now: number) => {
      const seconds = (now - startRef.current) / 1000;
      setElapsed(seconds);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [running]);

  const start = () => {
    setElapsed(0);
    setDiff(null);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    const delta = elapsed - config.stopClockTargetSeconds;
    const absDelta = Math.abs(delta);
    setDiff(delta);

    if (absDelta <= config.stopClockToleranceSeconds && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setDiff(null);
    completedRef.current = false;
  };

  const withinTolerance = diff !== null && Math.abs(diff) <= config.stopClockToleranceSeconds;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/80">
        Objetivo: detener el reloj cerca de {config.stopClockTargetSeconds.toFixed(2)} segundos, con tolerancia ±
        {config.stopClockToleranceSeconds} s.
      </p>

      <div className="rounded-2xl border border-wine/20 bg-white/80 p-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-wine/70">Tiempo actual</p>
        <p className="mt-2 font-[var(--font-heading)] text-6xl text-wine">{elapsed.toFixed(2)}</p>
        <p className="text-xs text-ink/70">segundos</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {!running ? <Button onClick={start}>{elapsed > 0 ? "Reintentar" : "Iniciar"}</Button> : null}
        {running ? (
          <Button variant="secondary" onClick={stop}>
            Detener
          </Button>
        ) : null}
        <Button variant="ghost" onClick={reset}>
          Reiniciar
        </Button>
      </div>

      {diff !== null ? (
        <p className="text-sm font-semibold text-ink/85">
          {withinTolerance
            ? `¡Exactitud increíble! Diferencia: ${Math.abs(diff).toFixed(2)} s.`
            : `Te faltó precisión. Diferencia: ${Math.abs(diff).toFixed(2)} s.`}
        </p>
      ) : null}
    </div>
  );
}