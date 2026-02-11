"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GameComponentProps } from "@/components/games/types";
import { normalizeUpperNoAccents } from "@/lib/utils";

const TARGET_WORD = "CAFÉ MOKA";
const MAX_ERRORS = 6;
const LETTERS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

export function HangmanGame({ onComplete }: GameComponentProps) {
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const completedRef = useRef(false);

  const normalizedTarget = useMemo(() => normalizeUpperNoAccents(TARGET_WORD), []);
  const lettersToGuess = useMemo(
    () => Array.from(new Set(normalizedTarget.split("").filter((char) => /[A-ZÑ]/.test(char)))),
    [normalizedTarget]
  );

  const won = lettersToGuess.every((char) => guessedLetters.includes(char));
  const lost = errors >= MAX_ERRORS;

  useEffect(() => {
    if (won && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [won, onComplete]);

  const guess = (letter: string) => {
    if (won || lost || guessedLetters.includes(letter)) {
      return;
    }

    setGuessedLetters((prev) => [...prev, letter]);
    if (!lettersToGuess.includes(letter)) {
      setErrors((prev) => prev + 1);
    }
  };

  const revealedWord = TARGET_WORD.split("").map((char) => {
    if (char === " ") {
      return " ";
    }

    const normalized = normalizeUpperNoAccents(char);
    return guessedLetters.includes(normalized) ? char : "_";
  });

  const bodyParts = [
    "Cabeza",
    "Cuerpo",
    "Brazo izquierdo",
    "Brazo derecho",
    "Pierna izquierda",
    "Pierna derecha"
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/75">Adivina la frase secreta. Tienes {MAX_ERRORS} intentos.</p>

      <div className="rounded-xl border border-wine/20 bg-white/75 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wine/70">Palabra</p>
        <p className="mt-3 font-[var(--font-heading)] text-4xl tracking-[0.2em] text-wine">{revealedWord.join(" ")}</p>
      </div>

      <div className="grid gap-1 rounded-xl border border-wine/20 bg-white/75 p-3 sm:grid-cols-2">
        {bodyParts.map((part, index) => (
          <div
            key={part}
            className={`rounded-lg px-3 py-2 text-sm ${
              index < errors ? "bg-[#ff5a86]/20 text-wine" : "bg-blush/30 text-ink/70"
            }`}
          >
            {part}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:grid-cols-9">
        {LETTERS.map((letter) => (
          <button
            key={letter}
            onClick={() => guess(letter)}
            disabled={guessedLetters.includes(letter) || won || lost}
            className="rounded-lg border border-wine/20 bg-white px-2 py-2 text-sm font-semibold text-ink transition hover:bg-blush/40 disabled:opacity-45"
          >
            {letter}
          </button>
        ))}
      </div>

      {won ? <p className="text-sm font-semibold text-wine">¡Perfecto! La palabra era {TARGET_WORD}.</p> : null}
      {lost ? (
        <p className="text-sm font-semibold text-[#8b2248]">Se acabaron los intentos. Reintenta para ganar el sello.</p>
      ) : null}
    </div>
  );
}
