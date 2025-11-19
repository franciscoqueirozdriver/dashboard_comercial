import type { ReactNode } from 'react';
import { MainNav } from '@/components/layout/main-nav';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-800 bg-slate-900/40 px-4 py-4 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Dashboards comerciais</p>
            <h1 className="text-2xl font-bold text-white">Exact Spotter</h1>
            <p className="text-sm text-slate-400">Acompanhe a operação em tempo real.</p>
          </div>
          <MainNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
