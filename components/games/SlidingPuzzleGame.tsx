"use client";

import { useEffect, useRef, useState } from "react";
import type { GameComponentProps } from "@/components/games/types";
import { Button } from "@/components/ui/Button";
import { shuffle } from "@/lib/utils";

const SOLVED_BOARD = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const countInversions = (items: number[]) => {
  let inversions = 0;
  const numbers = items.filter((item) => item !== 0);

  for (let i = 0; i < numbers.length; i += 1) {
    for (let j = i + 1; j < numbers.length; j += 1) {
      if (numbers[i] > numbers[j]) {
        inversions += 1;
      }
    }
  }

  return inversions;
};

const isSolvable = (items: number[]) => countInversions(items) % 2 === 0;

const createShuffledBoard = () => {
  let candidate = SOLVED_BOARD;

  while (candidate.join(",") === SOLVED_BOARD.join(",") || !isSolvable(candidate)) {
    candidate = shuffle([...SOLVED_BOARD]);
  }

  return candidate;
};

const isSolved = (board: number[]) => board.every((value, index) => value === SOLVED_BOARD[index]);

const isAdjacent = (from: number, to: number) => {
  const rowA = Math.floor(from / 3);
  const colA = from % 3;
  const rowB = Math.floor(to / 3);
  const colB = to % 3;
  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
};

export function SlidingPuzzleGame({ onComplete }: GameComponentProps) {
  const [board, setBoard] = useState<number[]>([...SOLVED_BOARD]);
  const completedRef = useRef(false);

  useEffect(() => {
    setBoard(createShuffledBoard());
  }, []);

  const onTileClick = (index: number) => {
    const emptyIndex = board.indexOf(0);
    if (!isAdjacent(index, emptyIndex)) {
      return;
    }

    const next = [...board];
    [next[index], next[emptyIndex]] = [next[emptyIndex], next[index]];
    setBoard(next);

    if (isSolved(next) && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  const shuffleAgain = () => {
    setBoard(createShuffledBoard());
    completedRef.current = false;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/80">Ordena las piezas para reconstruir la imagen.</p>

      <div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-1 rounded-xl border border-wine/20 bg-white/75 p-2">
        {board.map((tile, index) => {
          if (tile === 0) {
            return <div key={`empty-${index}`} className="aspect-square rounded-lg border border-dashed border-wine/25 bg-white/50" />;
          }

          const sourceIndex = tile - 1;
          const row = Math.floor(sourceIndex / 3);
          const col = sourceIndex % 3;

          return (
            <button
              key={`tile-${tile}`}
              onClick={() => onTileClick(index)}
              className="aspect-square rounded-lg border border-wine/25 transition hover:scale-[1.02]"
              style={{
                backgroundImage: "url('/assets/puzzle_01.jpg')",
                backgroundSize: "300% 300%",
                backgroundPosition: `${col * 50}% ${row * 50}%`
              }}
              aria-label={`Mover pieza ${tile}`}
            />
          );
        })}
      </div>

      <Button variant="secondary" onClick={shuffleAgain}>
        Mezclar de nuevo
      </Button>
    </div>
  );
}
