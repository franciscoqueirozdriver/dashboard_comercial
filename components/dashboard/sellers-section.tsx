'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '@/components/ui/card';
import type { SellersMetricsItem, SellersProductionItem } from '@/lib/spotter/types';
import { calculatePercentage } from '@/lib/spotter/metrics';

type SellersSectionProps = {
  metrics: SellersMetricsItem[];
  production: SellersProductionItem[];
};

export function SellersSection({ metrics, production }: SellersSectionProps) {
  const safeMetrics = metrics ?? [];
  const safeProduction = production ?? [];

  const ranking = useMemo(() => {
    return safeMetrics
      .map((metric) => ({
        id: metric.id,
        userName: metric.userName,
        sales: metric.sales,
        sql: metric.sql,
        showRate: calculatePercentage(metric.completedMeetings, metric.scheduledMeetings)
      }))
      .sort((a, b) => b.sales - a.sales);
  }, [safeMetrics]);

  const productionData = useMemo(() => {
    return safeProduction.map((item) => ({
      name: item.name,
      total: item.steps.reduce((acc, step) => acc + step.value, 0),
      stepValues: item.steps
    }));
  }, [safeProduction]);

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card title="Vendedores" description="Ranking por vendas, SQLs e taxa de show.">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2">Closer</th>
                <th className="py-2">Vendas</th>
                <th className="py-2">SQLs</th>
                <th className="py-2">Show rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {ranking.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 font-semibold text-white">{item.userName}</td>
                  <td className="py-2 text-slate-200">{item.sales}</td>
                  <td className="py-2 text-slate-200">{item.sql}</td>
                  <td className="py-2 text-slate-300">{item.showRate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="userName" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
              <Bar dataKey="sales" name="Vendas" fill="#f472b6" />
              <Bar dataKey="sql" name="SQLs" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Produção por etapa" description="Volume de atividades dos closers.">
        <div className="space-y-4">
          {productionData.map((item) => (
            <div key={item.name} className="rounded-xl border border-slate-800/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white">{item.name}</p>
                <p className="text-sm text-slate-400">Total {item.total}</p>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {item.stepValues.map((step) => (
                  <div key={step.id} className="rounded-lg bg-slate-900/60 p-3 text-center">
                    <p className="text-xl font-semibold text-emerald-400">{step.value}</p>
                    <p className="text-xs uppercase text-slate-400">Etapa {step.id}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
