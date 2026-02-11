"use client";

import { useState } from "react";
import { quizQuestions } from "@/data/quiz";
import { Button } from "@/components/ui/Button";
import type { GameComponentProps } from "@/components/games/types";

export function QuizGame({ onComplete }: GameComponentProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const current = quizQuestions[questionIndex];

  const onSelect = (option: string) => {
    if (failed) {
      return;
    }

    if (option !== current.correctOption) {
      setFailed(true);
      setMessage("Esa no era. Respira bonito y vuelve a intentarlo 💞");
      return;
    }

    if (questionIndex === quizQuestions.length - 1) {
      setMessage("Perfecto, te sabes todo 💘");
      onComplete();
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setMessage(null);
  };

  const resetQuiz = () => {
    setQuestionIndex(0);
    setFailed(false);
    setMessage(null);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm font-semibold text-wine/80">
        Progreso {questionIndex + 1}/{quizQuestions.length}
      </p>

      <div className="rounded-xl border border-wine/15 bg-white/75 p-4">
        <p className="font-[var(--font-heading)] text-3xl text-wine">{current.question}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {current.options.map((option) => (
          <button
            key={option}
            className="rounded-xl border border-wine/20 bg-white px-4 py-3 text-left text-sm font-semibold text-ink transition hover:bg-blush/40"
            onClick={() => onSelect(option)}
            disabled={failed}
          >
            {option}
          </button>
        ))}
      </div>

      {message ? <p className="text-sm text-ink/80">{message}</p> : null}

      {failed ? (
        <Button variant="secondary" onClick={resetQuiz}>
          Reintentar quiz
        </Button>
      ) : null}
    </div>
  );
}
