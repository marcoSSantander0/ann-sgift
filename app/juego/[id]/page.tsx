"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { games } from "@/data/games";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageShell } from "@/components/ui/PageShell";
import { getGameComponent } from "@/components/games";
import { markCompleted, resetSingleGameState } from "@/lib/gameRules";
import { useGameState } from "@/lib/useGameState";
import type { GameCompletePayload } from "@/components/games/types";

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, updateState } = useGameState();
  const [gameKey, setGameKey] = useState(0);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  const id = Number(params.id);
  const game = games.find((item) => item.id === id);
  const GameComponent = getGameComponent(id);

  const title = useMemo(() => (game ? `Juego ${game.id}: ${game.title}` : "Juego no encontrado"), [game]);

  const handleComplete = useCallback(
    (payload?: GameCompletePayload) => {
      updateState((prev) => {
        let next = {
          ...prev,
          completed: [...prev.completed]
        };

        if (id >= 1 && id <= 10) {
          next = markCompleted(next, id);
        }

        if (id === 11 && payload?.finalKeyUnlocked) {
          next.finalKeyUnlocked = true;
          next = markCompleted(next, 11);
        }

        return {
          ...next,
          updatedAt: Date.now()
        };
      });
      setCompletionModalOpen(true);
    },
    [id, updateState]
  );

  const retryCurrentGame = () => {
    resetSingleGameState(id);
    setGameKey((prev) => prev + 1);
  };

  if (!game || !GameComponent) {
    return (
      <PageShell title="Juego no encontrado" subtitle="El juego solicitado no existe.">
        <Link href="/reto">
          <Button>Volver al hub</Button>
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle={game.description}
      actions={
        <>
          <Button variant="secondary" onClick={retryCurrentGame}>
            Reintentar
          </Button>
          <Link href="/reto">
            <Button variant="ghost">Volver al hub</Button>
          </Link>
        </>
      }
    >
      <section className="card-surface p-5 sm:p-6">
        {state.completed[id - 1] ? (
          <p className="mb-4 rounded-xl border border-rose/30 bg-[#ffe5ee] px-4 py-2 text-sm font-semibold text-wine">
            Este sello ya está completado, pero puedes rejugarlo cuando quieras.
          </p>
        ) : null}

        <GameComponent key={gameKey} onComplete={handleComplete} />
      </section>

      <Modal
        open={completionModalOpen}
        title={`Sello #${id} obtenido 💘`}
        onClose={() => setCompletionModalOpen(false)}
        actions={
          <Button
            onClick={() => {
              setCompletionModalOpen(false);
              router.push("/reto");
            }}
          >
            Continuar
          </Button>
        }
      >
        <p>Tu progreso ya se guardó. Puedes seguir con otro reto.</p>
      </Modal>
    </PageShell>
  );
}
