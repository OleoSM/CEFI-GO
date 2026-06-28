import type { Metadata } from "next";
import { Outfit, Rubik } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "CEFI GO — Plataforma de preparación universitaria",
  description:
    "La plataforma #1 en México para preparar tu examen de admisión a UNAM, IPN y UAM.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${outfit.variable} ${rubik.variable} bg-[#0B0617] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
