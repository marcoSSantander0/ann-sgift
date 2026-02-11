"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { letterFragments } from "@/data/letter";
import { isLetterUnlocked } from "@/lib/gameRules";
import { useGameState } from "@/lib/useGameState";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageShell } from "@/components/ui/PageShell";
import { cn } from "@/lib/utils";

const hearts = ["💗", "💘", "💞", "💖", "💕", "❤️"];

export default function CartaPage() {
  const { state, resetAll } = useGameState();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const unlocked = isLetterUnlocked(state);
  const letterText = useMemo(() => letterFragments.map((fragment) => fragment.text).join("\n\n"), []);

  return (
    <PageShell
      title="Carta final"
      subtitle="La carta existe desde el inicio, pero solo se revela por completo al terminar los 11 retos."
      actions={
        <>
          <Link href="/reto">
            <Button variant="secondary">Volver al hub</Button>
          </Link>
          <Button variant="danger" onClick={() => setConfirmResetOpen(true)}>
            Reiniciar todo
          </Button>
        </>
      }
    >
      <section className="relative card-surface overflow-hidden p-6 sm:p-8">
        {unlocked ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            {hearts.map((heart, index) => (
              <span
                key={`${heart}-${index}`}
                className="absolute animate-floaty text-2xl opacity-30"
                style={{
                  left: `${8 + index * 15}%`,
                  top: `${10 + (index % 2) * 22}%`,
                  animationDelay: `${index * 150}ms`
                }}
              >
                {heart}
              </span>
            ))}
          </div>
        ) : null}

        <article className="relative">
          <pre
            className={cn(
              "romantic-text whitespace-pre-wrap font-[var(--font-heading)] text-2xl leading-relaxed text-ink sm:text-3xl",
              !unlocked && "no-select blur-[9px]"
            )}
          >
            {letterText}
          </pre>

          {!unlocked ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/45 p-5 text-center backdrop-blur-[1px]">
              <div className="card-surface max-w-md p-5">
                <p className="font-[var(--font-heading)] text-3xl font-semibold text-wine">Carta bloqueada</p>
                <p className="mt-2 text-sm text-ink">Completa los 11 retos para leerla sin blur.</p>
              </div>
            </div>
          ) : null}
        </article>

        {unlocked ? (
          <p className="mt-6 text-sm font-semibold text-wine">Desbloqueada con éxito. Ya puedes leer cada palabra.</p>
        ) : (
          <p className="mt-6 text-sm text-ink/75">
            Requisito: juegos 1..10 completados + llave final correcta (juego 11).
          </p>
        )}
      </section>

      <Modal
        open={confirmResetOpen}
        title="¿Reiniciar todo el reto?"
        onClose={() => setConfirmResetOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmResetOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetAll();
                setConfirmResetOpen(false);
              }}
            >
              Sí, reiniciar
            </Button>
          </>
        }
      >
        <p>Se perderá el progreso completo y la carta volverá a bloquearse.</p>
      </Modal>
    </PageShell>
  );
}
