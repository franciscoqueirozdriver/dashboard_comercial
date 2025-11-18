import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-center text-slate-100">
      <h1 className="text-4xl font-bold">Dashboard Comercial</h1>
      <p className="text-lg text-slate-300">
        Acesse o painel consolidado para visualizar os indicadores comerciais.
      </p>
      <Link
        href="/dashboard/comercial"
        className="rounded-md bg-emerald-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400"
      >
        Ir para o dashboard
      </Link>
    </main>
  );
}
