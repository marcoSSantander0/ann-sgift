import Link from "next/link";
import { config } from "@/data/config";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-10 sm:px-6">
      <section className="card-surface w-full animate-fadeInUp p-7 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wine/70">11/02/2026</p>
        <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-wine sm:text-6xl">
          Para {config.recipientName}
        </h1>
        <p className="mt-4 text-sm font-semibold text-ink/70 sm:text-base">
          {config.startDateLabel} → {config.endDateLabel}
        </p>
        <p className="romantic-text mx-auto mt-6 max-w-2xl text-base text-ink/90 sm:text-lg">
          Once retos para recordarte que, incluso en un juego, quiero seguir eligiéndote cada día.
        </p>
        <p className="mt-3 text-sm text-ink/75">Puedes rejugar todos los juegos cuando quieras.</p>

        <Link
          href="/reto"
          className="mt-8 inline-flex animate-pulseGlow rounded-xl border border-rose bg-rose px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7196]"
        >
          Empezar a jugar
        </Link>
      </section>
    </main>
  );
}
