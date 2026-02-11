"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sudokuPuzzleEasy, sudokuSolutionEasy } from "@/data/sudoku";
import type { GameComponentProps } from "@/components/games/types";
import { Button } from "@/components/ui/Button";

const SUBGRID_ROWS = 2;
const SUBGRID_COLS = 3;

const cloneBoard = (board: number[][]) => board.map((row) => [...row]);

const isSolved = (board: number[][]) =>
  board.every((row, rowIndex) => row.every((value, colIndex) => value === sudokuSolutionEasy[rowIndex][colIndex]));

export function SudokuGame({ onComplete }: GameComponentProps) {
  const [board, setBoard] = useState<number[][]>(() => cloneBoard(sudokuPuzzleEasy));
  const [errorKeys, setErrorKeys] = useState<Set<string>>(new Set());
  const [errorCount, setErrorCount] = useState<number | null>(null);
  const completedRef = useRef(false);

  const gridSize = sudokuPuzzleEasy.length;

  const fixedCells = useMemo(
    () => sudokuPuzzleEasy.map((row) => row.map((value) => value !== 0)),
    []
  );

  useEffect(() => {
    if (isSolved(board) && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [board, onComplete]);

  const onChange = (row: number, col: number, value: string) => {
    if (fixedCells[row][col]) {
      return;
    }

    const maxDigit = gridSize.toString();
    const sanitized = new RegExp(`^[1-${maxDigit}]$`).test(value) ? Number(value) : 0;

    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][col] = sanitized;
      return next;
    });

    const key = `${row}-${col}`;
    setErrorKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const verify = () => {
    const nextErrors = new Set<string>();

    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        const value = board[row][col];
        if (value !== 0 && value !== sudokuSolutionEasy[row][col]) {
          nextErrors.add(`${row}-${col}`);
        }
      }
    }

    setErrorKeys(nextErrors);
    setErrorCount(nextErrors.size);
  };

  const reset = () => {
    setBoard(cloneBoard(sudokuPuzzleEasy));
    setErrorKeys(new Set());
    setErrorCount(null);
    completedRef.current = false;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/80">Completa el sudoku. Las celdas dadas son de solo lectura.</p>

      <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-xl border-2 border-wine/30 bg-white sm:max-w-[500px]">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
          {board.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const isFixed = fixedCells[rowIndex][colIndex];
              const hasError = errorKeys.has(key);

              return (
                <input
                  key={key}
                  value={value === 0 ? "" : value}
                  readOnly={isFixed}
                  onChange={(event) => onChange(rowIndex, colIndex, event.target.value)}
                  inputMode="numeric"
                  maxLength={1}
                  className={`aspect-square w-full text-center text-xl font-semibold outline-none transition sm:text-2xl ${
                    isFixed ? "bg-[#ffe7ef] text-wine" : "bg-white text-ink"
                  } ${hasError ? "bg-[#ffd7e2] text-[#7f1d46]" : ""}`}
                  style={{
                    borderLeft: `${colIndex % SUBGRID_COLS === 0 ? 2 : 1}px solid rgba(122,40,75,0.25)`,
                    borderTop: `${rowIndex % SUBGRID_ROWS === 0 ? 2 : 1}px solid rgba(122,40,75,0.25)`,
                    borderRight: `${colIndex === gridSize - 1 ? 2 : 1}px solid rgba(122,40,75,0.25)`,
                    borderBottom: `${rowIndex === gridSize - 1 ? 2 : 1}px solid rgba(122,40,75,0.25)`
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={verify}>
          Verificar
        </Button>
        <Button variant="ghost" onClick={reset}>
          Reiniciar
        </Button>
      </div>

      {errorCount !== null ? (
        <p className="text-sm text-ink/80">Errores detectados: {errorCount}</p>
      ) : (
        <p className="text-sm text-ink/65">Puedes verificar en cualquier momento.</p>
      )}
    </div>
  );
}
