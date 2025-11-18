'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import type {
  MeetingQualityItem,
  MeetingQualitySQLItem,
  PreSalesMetricsItem,
  QuestionnaireTemperature
} from '@/lib/spotter/types';
import {
  calculateAverageTemperatureScore,
  calculateConnectionRate,
  calculateMeetingQualityScore,
  calculateRejectionRate
} from '@/lib/spotter/metrics';

type PreSalesKpiCardsProps = {
  metrics: PreSalesMetricsItem[];
  meetingQuality: MeetingQualityItem | null;
  meetingQualitySQL: MeetingQualitySQLItem | null;
  questionnaireTemperatures: QuestionnaireTemperature[];
};

const percentage = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 });

export function PreSalesKpiCards({ metrics, meetingQuality, meetingQualitySQL, questionnaireTemperatures }: PreSalesKpiCardsProps) {
  const kpis = useMemo(() => {
    const totals = metrics.reduce(
      (acc, item) => {
        acc.totalCalls += item.totalCalls;
        acc.answeredCalls += item.answeredCalls;
        acc.scheduledMeetings += item.scheduledMeetings;
        acc.completedMeetings += item.completedMeetings;
        acc.sales += item.sales;
        return acc;
      },
      { totalCalls: 0, answeredCalls: 0, scheduledMeetings: 0, completedMeetings: 0, sales: 0 }
    );

    const connectionRate = calculateConnectionRate(metrics) / 100;
    const meetingScore = calculateMeetingQualityScore(meetingQuality);
    const rejectionRate = calculateRejectionRate(meetingQualitySQL) / 100;
    const temperature = calculateAverageTemperatureScore(questionnaireTemperatures);

    return [
      {
        label: 'Chamadas (respondidas/total)',
        value: `${totals.answeredCalls.toLocaleString('pt-BR')} / ${totals.totalCalls.toLocaleString('pt-BR')}`,
        sublabel: `Taxa de conexão ${percentage.format(connectionRate)}`
      },
      {
        label: 'Reuniões (agendadas/realizadas)',
        value: `${totals.scheduledMeetings.toLocaleString('pt-BR')} / ${totals.completedMeetings.toLocaleString('pt-BR')}`,
        sublabel: 'Pipeline ativo das SDRs'
      },
      {
        label: 'SQLs e rejeição',
        value: `${meetingQualitySQL?.sql ?? 0} SQLs`,
        sublabel: `Rejeição ${percentage.format(rejectionRate)}`
      },
      {
        label: 'Quality score médio',
        value: meetingScore.toFixed(1),
        sublabel: 'Escala 1-5'
      },
      {
        label: 'Temperatura média',
        value: temperature.toFixed(1),
        sublabel: '1 (frio) a 5 (muito quente)'
      },
      {
        label: 'Vendas originadas',
        value: totals.sales.toLocaleString('pt-BR'),
        sublabel: 'Conversões vindas da pré-venda'
      }
    ];
  }, [meetingQuality, meetingQualitySQL, metrics, questionnaireTemperatures]);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">{kpi.label}</p>
            <p className="text-3xl font-semibold text-white">{kpi.value}</p>
            <p className="text-sm text-slate-400">{kpi.sublabel}</p>
          </div>
        </Card>
      ))}
    </section>
  );
}
