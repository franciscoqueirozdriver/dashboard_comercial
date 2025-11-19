'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '@/components/ui/card';
import type { PreSalesMetricsItem, PreSalesProductionItem } from '@/lib/spotter/types';

type PreSalesMetricKey =
  | 'answeredCalls'
  | 'scheduledMeetings'
  | 'completedMeetings'
  | 'sales'
  | 'recoveryRegistration';

const metricKeys: { key: PreSalesMetricKey; label: string }[] = [
  { key: 'answeredCalls', label: 'Chamadas respondidas' },
  { key: 'scheduledMeetings', label: 'Reuniões agendadas' },
  { key: 'completedMeetings', label: 'Reuniões realizadas' },
  { key: 'sales', label: 'Vendas' },
  { key: 'recoveryRegistration', label: 'Recuperações' }
];

type PreSalesSectionProps = {
  metrics: PreSalesMetricsItem[];
  production: PreSalesProductionItem[];
};

export function PreSalesSection({ metrics, production }: PreSalesSectionProps) {
  const safeMetrics = metrics ?? [];
  const safeProduction = production ?? [];

  const chartData = useMemo(
    () =>
      safeMetrics.map((metric) => ({
        name: metric.userName,
        answeredCalls: metric.answeredCalls,
        scheduledMeetings: metric.scheduledMeetings,
        completedMeetings: metric.completedMeetings,
        sales: metric.sales,
        recoveryRegistration: metric.recoveryRegistration
      })),
    [safeMetrics]
  );

  const radarData = useMemo(() => {
    return metricKeys.map((metric) => ({
      metric: metric.label,
      value:
        safeMetrics.reduce((acc, item) => acc + item[metric.key], 0) / Math.max(safeMetrics.length, 1)
    }));
  }, [safeMetrics]);

  const productionHeatmap = useMemo(() => {
    return safeProduction.map((item) => ({
      name: item.name,
      steps: item.steps
    }));
  }, [safeProduction]);

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card title="Pré-vendas" description="Indicadores de produtividade e eficiência dos SDRs.">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
                />
                <Bar dataKey="answeredCalls" fill="#34d399" name="Chamadas" />
                <Bar dataKey="scheduledMeetings" fill="#60a5fa" name="Reuniões" />
                <Bar dataKey="sales" fill="#fbbf24" name="Vendas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={45} stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Radar
                  name="Média"
                  dataKey="value"
                  stroke="#c084fc"
                  fill="#c084fc"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2">SDR</th>
                {metricKeys.map((metric) => (
                  <th key={metric.key} className="py-2">
                    {metric.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-sm">
              {safeMetrics.map((metric) => (
                <tr key={metric.id}>
                  <td className="py-2 font-medium text-white">{metric.userName}</td>
                  {metricKeys.map((key) => (
                    <td key={key.key} className="py-2 text-slate-300">
                      {metric[key.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="Produção por etapa" description="Heatmap de volume entregue em cada fase.">
        <div className="space-y-4">
          {productionHeatmap.map((item) => (
            <div key={item.name}>
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {item.steps.map((step) => (
                  <div
                    key={step.id}
                    className="rounded-lg bg-gradient-to-br from-emerald-500/30 via-emerald-400/40 to-emerald-600/40 p-3 text-center"
                  >
                    <p className="text-lg font-semibold text-white">{step.value}</p>
                    <p className="text-xs uppercase text-emerald-100">Etapa {step.id}</p>
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
