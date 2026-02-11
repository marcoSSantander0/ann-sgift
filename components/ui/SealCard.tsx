"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type SealCardProps = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export function SealCard({ id, title, description, completed }: SealCardProps) {
  return (
    <Link
      href={`/juego/${id}`}
      className={cn(
        "card-surface group flex h-full flex-col justify-between p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl",
        completed && "ring-2 ring-rose/50"
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wine/70">Sello #{id}</p>
        <h3 className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-wine">{title}</h3>
        <p className="mt-2 text-sm text-ink/80">{description}</p>
      </div>
      <div className="mt-5 inline-flex w-fit rounded-full border border-wine/15 px-3 py-1 text-xs font-semibold">
        {completed ? "Completado" : "Pendiente"}
      </div>
    </Link>
  );
}
