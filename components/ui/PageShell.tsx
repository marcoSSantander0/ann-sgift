"use client";

type PageShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function PageShell({ title, subtitle, actions, children }: PageShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <header className="card-surface animate-fadeInUp p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-heading)] text-4xl font-semibold text-wine sm:text-5xl">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-ink/80 sm:text-base">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </header>
      <section className="mt-6 flex-1">{children}</section>
    </main>
  );
}
