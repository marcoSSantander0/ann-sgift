"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameComponentProps } from "@/components/games/types";

const mazeRows = [
  "##########",
  "#S.......#",
  "###.####.#",
  "#...#....#",
  "#.###.##.#",
  "#.#...#..#",
  "#.#.###.##",
  "#...#....#",
  "#######G.#",
  "##########"
];

type Position = {
  row: number;
  col: number;
};

const findInMaze = (token: string): Position => {
  for (let row = 0; row < mazeRows.length; row += 1) {
    const col = mazeRows[row].indexOf(token);
    if (col >= 0) {
      return { row, col };
    }
  }

  return { row: 1, col: 1 };
};

const START = findInMaze("S");
const GOAL = findInMaze("G");

export function MazeGame({ onComplete }: GameComponentProps) {
  const [player, setPlayer] = useState<Position>(START);
  const [won, setWon] = useState(false);
  const completedRef = useRef(false);

  const canMove = useCallback((row: number, col: number) => {
    const cell = mazeRows[row]?.[col];
    return Boolean(cell) && cell !== "#";
  }, []);

  const move = useCallback(
    (dr: number, dc: number) => {
      if (won) {
        return;
      }

      setPlayer((prev) => {
        const next = {
          row: prev.row + dr,
          col: prev.col + dc
        };

        if (!canMove(next.row, next.col)) {
          return prev;
        }

        return next;
      });
    },
    [canMove, won]
  );

  useEffect(() => {
    const reachedGoal = player.row === GOAL.row && player.col === GOAL.col;
    if (!reachedGoal || won) {
      return;
    }

    setWon(true);
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [onComplete, player, won]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        event.preventDefault();
      }

      if (key === "w" || key === "arrowup") {
        move(-1, 0);
      }
      if (key === "s" || key === "arrowdown") {
        move(1, 0);
      }
      if (key === "a" || key === "arrowleft") {
        move(0, -1);
      }
      if (key === "d" || key === "arrowright") {
        move(0, 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/80">Usa W A S D para moverte. También funcionan las flechas del teclado.</p>

      <div className="mx-auto grid w-full max-w-md grid-cols-10 gap-1 rounded-xl border border-wine/20 bg-white/80 p-2">
        {mazeRows.flatMap((line, row) =>
          line.split("").map((cell, col) => {
            const isPlayer = player.row === row && player.col === col;
            const isGoal = row === GOAL.row && col === GOAL.col;

            return (
              <div
                key={`${row}-${col}`}
                className={`aspect-square rounded ${
                  cell === "#" ? "bg-wine/75" : "bg-[#fff2f6]"
                } flex items-center justify-center text-sm`}
              >
                {isPlayer ? "🧍" : isGoal ? "🍓" : ""}
              </div>
            );
          })
        )}
      </div>

      <div className="grid w-full max-w-[190px] grid-cols-3 gap-2">
        <div />
        <button
          onClick={() => move(-1, 0)}
          className="rounded-lg border border-wine/20 bg-white px-4 py-2 text-sm font-semibold"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => move(0, -1)}
          className="rounded-lg border border-wine/20 bg-white px-4 py-2 text-sm font-semibold"
        >
          ←
        </button>
        <button
          onClick={() => move(1, 0)}
          className="rounded-lg border border-wine/20 bg-white px-4 py-2 text-sm font-semibold"
        >
          ↓
        </button>
        <button
          onClick={() => move(0, 1)}
          className="rounded-lg border border-wine/20 bg-white px-4 py-2 text-sm font-semibold"
        >
          →
        </button>
      </div>

      {won ? <p className="text-sm font-semibold text-wine">Llegaste a la fresa. Reto superado 💘</p> : null}
    </div>
  );
}
