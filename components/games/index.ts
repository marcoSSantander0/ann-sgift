import type { ComponentType } from "react";
import type { GameComponentProps } from "@/components/games/types";
import { MemoryGame } from "@/components/games/MemoryGame";
import { QuizGame } from "@/components/games/QuizGame";
import { Connect4Game } from "@/components/games/Connect4Game";
import { EyeContactGame } from "@/components/games/EyeContactGame";
import { HangmanGame } from "@/components/games/HangmanGame";
import { MazeGame } from "@/components/games/MazeGame";
import { SudokuGame } from "@/components/games/SudokuGame";
import { SimonGame } from "@/components/games/SimonGame";
import { SlidingPuzzleGame } from "@/components/games/SlidingPuzzleGame";
import { StopClockGame } from "@/components/games/StopClockGame";
import { FinalKeyGame } from "@/components/games/FinalKeyGame";

const gameRegistry: Record<number, ComponentType<GameComponentProps>> = {
  1: MemoryGame,
  2: QuizGame,
  3: Connect4Game,
  4: EyeContactGame,
  5: HangmanGame,
  6: MazeGame,
  7: SudokuGame,
  8: SimonGame,
  9: SlidingPuzzleGame,
  10: StopClockGame,
  11: FinalKeyGame
};

export const getGameComponent = (id: number) => gameRegistry[id] ?? null;
