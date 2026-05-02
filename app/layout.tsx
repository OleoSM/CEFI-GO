import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CEFI-GO — Entra a la universidad de tus sueños',
  description: 'Plataforma de preparación para examen de admisión a UNAM, IPN, UAM y COMIPEMS.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
