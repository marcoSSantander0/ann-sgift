"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { config } from "@/data/config";
import type { GameComponentProps } from "@/components/games/types";
import { Button } from "@/components/ui/Button";

const normalizePin = (value: string | number) => String(value).trim().replace(/\s+/g, "");

export function FinalKeyGame({ onComplete }: GameComponentProps) {
  const [showInput, setShowInput] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const completedRef = useRef(false);
  const expectedPin = normalizePin(config.finalPin);

  const submitPin = () => {
    const enteredPin = normalizePin(pin);

    if (enteredPin === expectedPin) {
      setSuccess(true);
      setError(null);
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete({ finalKeyUnlocked: true });
      }
      return;
    }

    setError("PIN incorrecto. Pide la llave correcta y vuelve a intentarlo.");
    setSuccess(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-wine/20 bg-white/80 p-4 text-sm text-ink/85">
        Ve con tu novio y dile qué te gusta de él. Si lo convences, te dará la llave.
      </div>

      <Button onClick={() => setShowInput(true)}>Tengo la llave</Button>

      {showInput ? (
        <div className="max-w-sm space-y-3 rounded-xl border border-wine/20 bg-white/80 p-4">
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-wine/75" htmlFor="final-pin">
            Ingresa el PIN
          </label>
          <input
            id="final-pin"
            type="text"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitPin();
              }
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={expectedPin.length || 12}
            autoComplete="off"
            className="w-full rounded-lg border border-wine/25 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose/30"
            placeholder="PIN"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={submitPin}>
              Validar
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPin("");
                setError(null);
                setSuccess(false);
              }}
            >
              Limpiar
            </Button>
          </div>
          {error ? <p className="text-sm text-[#8d204a]">{error}</p> : null}
          {success ? (
            <div className="space-y-2 rounded-lg bg-[#ffe8f0] p-3 text-sm text-wine">
              <p className="font-semibold">Llave final aceptada. Sello #11 obtenido 💘</p>
              <Link href="/carta" className="inline-flex text-sm font-semibold underline">
                Leer carta
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
