export type GameCompletePayload = {
  finalKeyUnlocked?: boolean;
};

export type GameComponentProps = {
  onComplete: (payload?: GameCompletePayload) => void;
};
