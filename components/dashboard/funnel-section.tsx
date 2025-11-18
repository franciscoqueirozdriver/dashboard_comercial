'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '@/components/ui/card';
import type { FunnelActivityItem, HarvestItem } from '@/lib/spotter/types';

const colors = ['#34d399', '#60a5fa', '#fbbf24', '#f472b6'];

type FunnelSectionProps = {
  harvest: HarvestItem[];
  funnelActivity: FunnelActivityItem[];
};

export function FunnelSection({ harvest, funnelActivity }: FunnelSectionProps) {
  const harvestData = useMemo(
    () =>
      harvest.map((item) => ({
        name: item.name,
        total: item.total,
        converted: item.converted ?? 0,
        parked: item.parked ?? 0,
        discarded: item.discarded ?? 0,
        restarted: item.restarted ?? 0,
        conversionRate: item.conversionRate ?? 0
      })),
    [harvest]
  );

  const insights = useMemo(() => {
    return harvest
      .map((item) => ({
        name: item.name,
        conversion: item.conversionRate ?? 0,
        dropped: (item.discarded ?? 0) + (item.parked ?? 0)
      }))
      .sort((a, b) => a.conversion - b.conversion);
  }, [harvest]);

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card title="Funil & Harvest" description="Conversões por etapa e volume de oportunidades.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={harvestData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
                />
                <Bar dataKey="converted" stackId="a" fill="#34d399" name="Convertidos" />
                <Bar dataKey="parked" stackId="a" fill="#fbbf24" name="Estacionados" />
                <Bar dataKey="discarded" stackId="a" fill="#f87171" name="Descartados" />
                <Bar dataKey="restarted" stackId="a" fill="#60a5fa" name="Reiniciados" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={harvestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis unit="%" stroke="#94a3b8" />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
                />
                <Bar dataKey="conversionRate" name="Taxa de Conversão" fill="#818cf8">
                  {harvestData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {insights.map((insight) => (
            <div key={insight.name} className="rounded-xl bg-slate-900/60 p-4">
              <p className="text-sm uppercase tracking-wide text-slate-400">{insight.name}</p>
              <p className="text-2xl font-semibold text-white">{insight.conversion.toFixed(1)}%</p>
              <p className="text-sm text-slate-400">{insight.dropped} oportunidades com atrito</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Atividade por Questionário" description="Etapas com maior conversão ou queda.">
        <ul className="space-y-4">
          {funnelActivity.map((activity) => (
            <li key={activity.id} className="rounded-xl border border-slate-800/50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{activity.name}</span>
                <span>{activity.questionnaire ?? 'N/A'}</span>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-semibold text-white">{activity.conversionRate ?? 0}%</p>
                  <p className="text-xs uppercase text-slate-400">Conversão</p>
                </div>
                <div className="text-right text-sm text-slate-400">
                  <p>Convertidos: {activity.converted ?? 0}</p>
                  <p>Descartados: {activity.discarded ?? 0}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
