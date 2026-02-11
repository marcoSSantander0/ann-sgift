"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type ModalProps = {
  open: boolean;
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function Modal({ open, title, onClose, children, actions }: ModalProps) {
  useEffect(() => {
    if (!open || !onClose) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className="card-surface relative z-10 w-full max-w-md animate-fadeInUp p-6">
        <h3 className="font-[var(--font-heading)] text-3xl font-semibold text-wine">{title}</h3>
        <div className="mt-3 text-sm text-ink/90">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          {actions ?? (
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
