import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-center text-slate-100">
      <h1 className="text-4xl font-bold">Dashboard Comercial</h1>
      <p className="text-lg text-slate-300">
        Escolha qual visão deseja consultar e acompanhe os principais indicadores do Spotter.
      </p>
      <div className="flex flex-col gap-3 text-base">
        <Link
          href="/dashboard/comercial"
          className="rounded-md bg-emerald-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400"
        >
          Ir para o Dashboard Comercial
        </Link>
        <Link href="/dashboard/pre-venda" className="text-emerald-300 underline-offset-4 hover:underline">
          Ver painel de Pré-venda
        </Link>
        <Link href="/dashboard/vendas" className="text-sky-300 underline-offset-4 hover:underline">
          Ver painel de Vendas
        </Link>
      </div>
    </main>
  );
}
