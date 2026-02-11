"use client";

import { useEffect, useRef, useState } from "react";
import type { GameComponentProps } from "@/components/games/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const TARGET_SECONDS = 20;

export function EyeContactGame({ onComplete }: GameComponentProps) {
  const [secondsLeft, setSecondsLeft] = useState(TARGET_SECONDS);
  const [running, setRunning] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          setRunning(false);
          setConfirmOpen(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setSecondsLeft(TARGET_SECONDS);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/80">
        Instrucciones: mírense a los ojos durante 20 segundos sin distraerse. Cuando terminen, confirmen si lo lograron.
      </p>

      <div className="rounded-2xl border border-wine/20 bg-white/80 p-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-wine/70">Tiempo</p>
        <p className="mt-2 font-[var(--font-heading)] text-6xl text-wine">{secondsLeft}s</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {!running ? (
          <Button
            onClick={() => {
              setSecondsLeft(TARGET_SECONDS);
              setRunning(true);
            }}
          >
            Empezar
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => setRunning(false)}>
            Pausar
          </Button>
        )}

        <Button variant="ghost" onClick={reset}>
          Reiniciar contador
        </Button>
      </div>

      <Modal
        open={confirmOpen}
        title="Tiempo terminado"
        onClose={() => setConfirmOpen(false)}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmOpen(false);
                reset();
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                if (!completedRef.current) {
                  completedRef.current = true;
                  onComplete();
                }
              }}
            >
              Sí, lo logramos
            </Button>
          </>
        }
      >
        <p>¿Lo lograste?</p>
      </Modal>
    </div>
  );
}
