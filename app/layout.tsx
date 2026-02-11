import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import "@/app/globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "700"]
});

const bodyFont = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"]
});

export const metadata: Metadata = {
  title: "11/02/2026",
  description: "Un regalo más para mi niña"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${headingFont.variable} ${bodyFont.variable} font-[var(--font-body)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
