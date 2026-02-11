"use client";

import Link from "next/link";
import { games } from "@/data/games";
import { useGameState } from "@/lib/useGameState";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageShell } from "@/components/ui/PageShell";
import { SealCard } from "@/components/ui/SealCard";
import { useState } from "react";

export default function RetoPage() {
  const { state, resetAll } = useGameState();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const completedCount = state.completed.filter(Boolean).length;

  return (
    <PageShell
      title={`Hola amor`}
      subtitle="Elige cualquier sello para jugar. El avance de la carta depende de completar todos."
      actions={
        <>
          <Link href="/carta">
            <Button>Ver carta</Button>
          </Link>
          <Button variant="danger" onClick={() => setConfirmResetOpen(true)}>
            Reiniciar todo
          </Button>
        </>
      }
    >
      <section className="card-surface animate-fadeInUp p-4 sm:p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-wine/70">Progreso general</p>
        <p className="mt-2 font-[var(--font-heading)] text-4xl font-semibold text-wine">{completedCount}/11 sellos</p>
        <p className="mt-2 text-sm text-ink/70">Puedes abrir y rejugar cualquier juego en cualquier momento.</p>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <SealCard
            key={game.id}
            id={game.id}
            title={game.title}
            description={game.description}
            completed={state.completed[game.id - 1]}
          />
        ))}
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
        <p>Se borrarán los 11 sellos, la llave final y cualquier avance interno de juegos.</p>
      </Modal>
    </PageShell>
  );
}
