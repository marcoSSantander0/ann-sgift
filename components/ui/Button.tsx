"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-rose text-white border-rose hover:bg-[#ff7196] focus-visible:ring-rose/45 shadow-[0_8px_20px_rgba(255,143,171,0.35)]",
  secondary:
    "bg-white text-ink border-wine/25 hover:bg-blush/50 focus-visible:ring-wine/30",
  ghost: "bg-transparent text-wine border-wine/15 hover:bg-white/50 focus-visible:ring-wine/25",
  danger: "bg-[#b32453] text-white border-[#b32453] hover:bg-[#991f47] focus-visible:ring-[#b32453]/35"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
