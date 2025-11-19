'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import type { QuestionnaireTemperature } from '@/lib/spotter/types';

const categories = ['Congelada', 'Fria', 'Morna', 'Quente', 'Muito Quente'];

type TemperatureSectionProps = {
  questionnaireTemperatures: QuestionnaireTemperature[];
};

export function TemperatureSection({ questionnaireTemperatures }: TemperatureSectionProps) {
  const safeQuestionnaireTemperatures = questionnaireTemperatures ?? [];

  const chartData = useMemo(() => {
    return safeQuestionnaireTemperatures.map((questionnaire) => {
      const entry: Record<string, number | string> = { name: questionnaire.questionnaireName };
      categories.forEach((category) => {
        const found = questionnaire.temperatures.find((temperature) => temperature.qualification === category);
        entry[category] = found?.quantity ?? 0;
      });
      return entry;
    });
  }, [safeQuestionnaireTemperatures]);

  const cardsData = useMemo(() => {
    return safeQuestionnaireTemperatures.map((questionnaire) => {
      const temperatures = questionnaire.temperatures ?? [];
      const total = temperatures.reduce((acc, item) => acc + item.quantity, 0);
      const weighted = temperatures.reduce((acc, item) => acc + item.rating * item.quantity, 0);
      const score = total === 0 ? 0 : weighted / total;
      const hottest = temperatures.reduce(
        (prev, curr) => (curr.rating > prev.rating ? curr : prev),
        temperatures[0] ?? { qualification: 'N/A', rating: 0, quantity: 0 }
      );
      return {
        id: questionnaire.questionnaireId,
        name: questionnaire.questionnaireName,
        score,
        hottest: hottest.qualification,
        total
      };
    });
  }, [safeQuestionnaireTemperatures]);

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card title="Temperatura por questionário" description="Distribuição de leads por temperatura.">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
              <Legend />
              {categories.map((category, index) => (
                <Bar key={category} dataKey={category} stackId="a" fill={[ '#0ea5e9', '#22d3ee', '#fbbf24', '#f97316', '#ef4444' ][index]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Heat score" description="Questionários que entregam leads mais quentes.">
        <ul className="space-y-4">
          {cardsData.map((card) => (
            <li key={card.id} className="rounded-xl border border-slate-800/60 p-4">
              <p className="text-lg font-semibold text-white">{card.name}</p>
              <p className="text-sm text-slate-400">Leads avaliados: {card.total}</p>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <p className="text-3xl font-bold text-emerald-400">{card.score.toFixed(1)}</p>
                  <p className="text-xs uppercase text-slate-400">Score ponderado (1-5)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Temperatura dominante</p>
                  <p className="text-lg font-semibold text-white">{card.hottest}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
