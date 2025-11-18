'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import type { AverageTimeAggregate } from '@/lib/spotter/types';
import { averageTimeInHours, buildLeadSpeedScore } from '@/lib/spotter/metrics';

const stages = [
  { key: 'call', label: 'Contato' },
  { key: 'scheduling', label: 'Agendamento' },
  { key: 'activity', label: 'Atividade' },
  { key: 'sale', label: 'Venda' }
] as const;

type VelocitySectionProps = {
  averageTime: AverageTimeAggregate | null;
};

export function VelocitySection({ averageTime }: VelocitySectionProps) {
  const originData = useMemo(() => {
    if (!averageTime) {
      return [];
    }
    return averageTime.list.map((origin) => ({
      name: origin.name,
      call: averageTimeInHours(origin.call),
      scheduling: averageTimeInHours(origin.scheduling),
      activity: averageTimeInHours(origin.activity),
      sale: averageTimeInHours(origin.sale),
      score: buildLeadSpeedScore(origin)
    }));
  }, [averageTime]);

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card title="Velocidade por origem" description="Tempo médio (h) até cada marco do funil.">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={originData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" label={{ value: 'Horas', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(1)} h`}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
              {stages.map((stage, index) => (
                <Bar
                  key={stage.key}
                  dataKey={stage.key}
                  stackId="time"
                  name={stage.label}
                  fill={['#22d3ee', '#34d399', '#fbbf24', '#f87171'][index]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Lead Speed Score" description="Quanto mais próximo de 100, mais ágil o funil da origem.">
        <ul className="space-y-4">
          {originData.map((origin) => (
            <li key={origin.name} className="rounded-xl border border-slate-800/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white">{origin.name}</p>
                <p className="text-sm text-slate-400">{origin.score.toFixed(0)} / 100</p>
              </div>
              <p className="text-sm text-slate-400">
                Tempo total: {(origin.call + origin.scheduling + origin.activity + origin.sale).toFixed(1)} h
              </p>
            </li>
          ))}
          {originData.length === 0 && <p className="text-sm text-slate-400">Sem dados de tempo médio.</p>}
        </ul>
      </Card>
    </section>
  );
}
