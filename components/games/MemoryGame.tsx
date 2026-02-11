"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GameComponentProps } from "@/components/games/types";
import { shuffle } from "@/lib/utils";

type MemoryCard = {
  uid: string;
  pairId: number;
  src: string;
  flipped: boolean;
  matched: boolean;
};

const memoryImages = [
  "/assets/memory_01.jpg",
  "/assets/memory_02.jpg",
  "/assets/memory_03.jpg",
  "/assets/memory_04.jpg"
];

const createDeck = (): MemoryCard[] => {
  const cards = memoryImages.flatMap((src, pairId) => [
    {
      uid: `${pairId}-a-${Math.random().toString(36).slice(2, 7)}`,
      pairId,
      src,
      flipped: false,
      matched: false
    },
    {
      uid: `${pairId}-b-${Math.random().toString(36).slice(2, 7)}`,
      pairId,
      src,
      flipped: false,
      matched: false
    }
  ]);

  return shuffle(cards);
};

export function MemoryGame({ onComplete }: GameComponentProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [locked, setLocked] = useState(false);
  const completedRef = useRef(false);

  const openCards = useMemo(
    () => cards.filter((card) => card.flipped && !card.matched),
    [cards]
  );

  const onFlip = (uid: string) => {
    if (locked) {
      return;
    }

    setCards((prev) =>
      prev.map((card) => {
        if (card.uid !== uid || card.flipped || card.matched) {
          return card;
        }

        return {
          ...card,
          flipped: true
        };
      })
    );
  };

  useEffect(() => {
    setCards(createDeck());
  }, []);

  useEffect(() => {
    if (openCards.length !== 2) {
      return;
    }

    const [first, second] = openCards;

    if (first.pairId === second.pairId) {
      const timeoutId = window.setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            card.pairId === first.pairId
              ? {
                  ...card,
                  matched: true,
                  flipped: true
                }
              : card
          )
        );
      }, 360);

      return () => window.clearTimeout(timeoutId);
    }

    setLocked(true);
    const openedIds = openCards.map((card) => card.uid);
    const timeoutId = window.setTimeout(() => {
      setCards((prev) =>
        prev.map((card) =>
          openedIds.includes(card.uid)
            ? {
                ...card,
                flipped: false
              }
            : card
        )
      );
      setLocked(false);
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [openCards]);

  useEffect(() => {
    if (cards.length === 0 || completedRef.current) {
      return;
    }

    if (cards.every((card) => card.matched)) {
      completedRef.current = true;
      onComplete();
    }
  }, [cards, onComplete]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/75">Empareja las 4 fotos. Si fallas, las cartas se cierran otra vez.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.length === 0 ? (
          <div className="col-span-full rounded-xl border border-wine/20 bg-white/70 p-4 text-sm text-ink/75">
            Cargando tablero...
          </div>
        ) : null}

        {cards.map((card) => (
          <button
            key={card.uid}
            className="group relative aspect-square overflow-hidden rounded-xl border border-wine/20 bg-blush/50 transition-transform hover:scale-[1.02]"
            onClick={() => onFlip(card.uid)}
            disabled={card.flipped || card.matched || locked}
          >
            {card.flipped || card.matched ? (
              <Image
                src={card.src}
                alt="Carta de memorama"
                fill
                sizes="(max-width: 640px) 45vw, 22vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-white/70 text-4xl">💘</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
