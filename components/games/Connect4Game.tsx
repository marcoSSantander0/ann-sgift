"use client";

import { useMemo, useRef, useState } from "react";
import type { GameComponentProps } from "@/components/games/types";
import { Button } from "@/components/ui/Button";

const ROWS = 6;
const COLS = 7;

type Cell = 0 | 1 | 2;

type Winner = Cell;

const createBoard = (): Cell[][] => Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));

const inBounds = (row: number, col: number) => row >= 0 && row < ROWS && col >= 0 && col < COLS;

const hasConnectFour = (board: Cell[][], row: number, col: number, player: Cell): boolean => {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ] as const;

  return directions.some(([dr, dc]) => {
    let count = 1;

    for (const step of [1, -1]) {
      let r = row + dr * step;
      let c = col + dc * step;

      while (inBounds(r, c) && board[r][c] === player) {
        count += 1;
        r += dr * step;
        c += dc * step;
      }
    }

    return count >= 4;
  });
};

const boardFull = (board: Cell[][]): boolean => board.every((row) => row.every((cell) => cell !== 0));

export function Connect4Game({ onComplete }: GameComponentProps) {
  const [board, setBoard] = useState<Cell[][]>(() => createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Cell>(1);
  const [winner, setWinner] = useState<Winner>(0);
  const [draw, setDraw] = useState(false);
  const completedRef = useRef(false);

  const statusText = useMemo(() => {
    if (winner === 2) {
      return "¡Ganaste! Este sello sí cuenta 💘";
    }

    if (winner === 1) {
      return "Otra vez 😼 (este juego solo se desbloquea si ganas).";
    }

    if (draw) {
      return "Empate. Otra vez 😼 (este juego solo se desbloquea si ganas).";
    }

    return `Turno de ${currentPlayer === 1 ? "Marcos" : "Andrea"}`;
  }, [currentPlayer, draw, winner]);

  const onDrop = (column: number) => {
    if (winner || draw) {
      return;
    }

    const row = (() => {
      for (let r = ROWS - 1; r >= 0; r -= 1) {
        if (board[r][column] === 0) {
          return r;
        }
      }

      return -1;
    })();

    if (row < 0) {
      return;
    }

    const nextBoard = board.map((line) => [...line]) as Cell[][];
    nextBoard[row][column] = currentPlayer;

    if (hasConnectFour(nextBoard, row, column, currentPlayer)) {
      setBoard(nextBoard);
      setWinner(currentPlayer);

      if (currentPlayer === 2 && !completedRef.current) {
        completedRef.current = true;
        onComplete();
      }

      return;
    }

    if (boardFull(nextBoard)) {
      setBoard(nextBoard);
      setDraw(true);
      return;
    }

    setBoard(nextBoard);
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
  };

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPlayer(1);
    setWinner(0);
    setDraw(false);
    completedRef.current = false;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/80">Juego local 2 jugadores: Marcos vs Andrea.</p>

      <p className="rounded-xl border border-wine/20 bg-white/70 px-4 py-2 text-sm font-semibold text-wine">
        {statusText}
      </p>

      <div className="flex justify-center gap-1">
        {Array.from({ length: COLS }, (_, col) => (
          <button
            key={`drop-${col}`}
            className="h-8 w-10 rounded-lg border border-wine/20 bg-white text-sm font-semibold transition hover:bg-blush/50"
            onClick={() => onDrop(col)}
            disabled={Boolean(winner) || draw}
          >
            ↓
          </button>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-md grid-cols-7 gap-1 rounded-xl border border-wine/25 bg-white/70 p-2">
        {board.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className="aspect-square rounded-full border border-wine/15 bg-[#ffe9ef] p-0"
              onClick={() => onDrop(colIndex)}
              disabled={Boolean(winner) || draw}
            >
              <span
                className={`block h-full w-full rounded-full transition ${
                  cell === 0
                    ? "bg-transparent"
                    : cell === 1
                      ? "bg-[#ffbb3f]"
                      : "bg-[#ff4f8f]"
                }`}
              />
            </button>
          ))
        )}
      </div>

      {(winner === 1 || draw || winner === 2) && (
        <Button variant="secondary" onClick={resetGame}>
          Rejugar
        </Button>
      )}
    </div>
  );
}
