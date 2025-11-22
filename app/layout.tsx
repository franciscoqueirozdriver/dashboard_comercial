import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Master Dashboard Comercial',
  description: 'Painel consolidado com dados do Exact Spotter'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
