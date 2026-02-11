import type { GameState } from "@/lib/storage";
import { GAME_INTERNAL_PREFIX } from "@/lib/storage";

export const isLetterUnlocked = (state: GameState): boolean => {
  const firstTenDone = state.completed.slice(0, 10).every(Boolean);
  return firstTenDone && state.finalKeyUnlocked;
};

export const markCompleted = (state: GameState, id: number): GameState => {
  if (id < 1 || id > 11) {
    return state;
  }

  const next: GameState = {
    ...state,
    completed: [...state.completed],
    updatedAt: Date.now()
  };

  if (id === 11 && !next.finalKeyUnlocked) {
    return next;
  }

  next.completed[id - 1] = true;
  return next;
};

export const resetSingleGameState = (id: number): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(`${GAME_INTERNAL_PREFIX}${id}`);
};
