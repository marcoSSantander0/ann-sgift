"use client";

import { useCallback, useEffect, useState } from "react";
import { createInitialState, loadState, resetState, saveState, type GameState } from "@/lib/storage";

const STATE_EVENT = "reto11:state-change";

const emitStateChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(STATE_EVENT));
  }
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(() => createInitialState());

  useEffect(() => {
    setState(loadState());

    const sync = () => setState(loadState());
    window.addEventListener("storage", sync);
    window.addEventListener(STATE_EVENT, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(STATE_EVENT, sync);
    };
  }, []);

  const updateState = useCallback((updater: (prev: GameState) => GameState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      emitStateChange();
      return next;
    });
  }, []);

  const hardReload = useCallback(() => {
    const next = loadState();
    setState(next);
    return next;
  }, []);

  const resetAll = useCallback(() => {
    const next = resetState();
    setState(next);
    emitStateChange();
    return next;
  }, []);

  return {
    state,
    updateState,
    resetAll,
    hardReload
  };
};

export const notifyStateChanged = emitStateChange;
