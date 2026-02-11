export interface GameState {
  completed: boolean[];
  finalKeyUnlocked: boolean;
  updatedAt: number;
}

export const TOTAL_GAMES = 11;
export const STORAGE_KEY = "reto11:state";
export const GAME_INTERNAL_PREFIX = "reto11:game:";

export const createInitialState = (): GameState => ({
  completed: Array(TOTAL_GAMES).fill(false),
  finalKeyUnlocked: false,
  updatedAt: Date.now()
});

const sanitizeState = (value: unknown): GameState => {
  if (!value || typeof value !== "object") {
    return createInitialState();
  }

  const maybeState = value as Partial<GameState>;
  const completed = Array.isArray(maybeState.completed)
    ? maybeState.completed.map((item) => Boolean(item)).slice(0, TOTAL_GAMES)
    : [];

  while (completed.length < TOTAL_GAMES) {
    completed.push(false);
  }

  return {
    completed,
    finalKeyUnlocked: Boolean(maybeState.finalKeyUnlocked),
    updatedAt: typeof maybeState.updatedAt === "number" ? maybeState.updatedAt : Date.now()
  };
};

export const loadState = (): GameState => {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = createInitialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    const clean = sanitizeState(parsed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    return clean;
  } catch {
    const initial = createInitialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
};

export const saveState = (state: GameState): void => {
  if (typeof window === "undefined") {
    return;
  }

  const payload: GameState = {
    ...state,
    updatedAt: Date.now()
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const resetState = (): GameState => {
  const initial = createInitialState();

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

    for (let id = 1; id <= TOTAL_GAMES; id += 1) {
      window.localStorage.removeItem(`${GAME_INTERNAL_PREFIX}${id}`);
    }
  }

  return initial;
};
