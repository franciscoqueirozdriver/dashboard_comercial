'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import type {
  HarvestItem,
  MeetingQualityItem,
  MeetingQualitySQLItem,
  MonthlyDealForecastItem,
  PreSalesMetricsItem,
  SellersMetricsItem
} from '@/lib/spotter/types';
import {
  aggregateForecastTotal,
  calculateConnectionRate,
  calculateHealthScore,
  calculateMeetingQualityScore,
  calculateRejectionRate,
  calculateShowRate
} from '@/lib/spotter/metrics';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 1
});

type KpiCardsProps = {
  meetingQuality: MeetingQualityItem | null;
  meetingQualitySQL: MeetingQualitySQLItem | null;
  preSalesMetrics: PreSalesMetricsItem[];
  sellersMetrics: SellersMetricsItem[];
  harvest: HarvestItem[];
  monthlyDealForecast: MonthlyDealForecastItem[];
};

export function KpiCards({
  meetingQuality,
  meetingQualitySQL,
  preSalesMetrics,
  sellersMetrics,
  harvest,
  monthlyDealForecast
}: KpiCardsProps) {
  const kpis = useMemo(() => {
    const sqls = meetingQualitySQL?.sql ?? 0;
    const rejectionRate = calculateRejectionRate(meetingQualitySQL) / 100;
    const totalMeetings = meetingQuality?.totalMeetings ?? 0;
    const feedbackRate = meetingQuality
      ? (meetingQuality.completedFeedbacks / Math.max(meetingQuality.totalMeetings, 1))
      : 0;
    const qualityScore = calculateMeetingQualityScore(meetingQuality);
    const connectionRate = calculateConnectionRate(preSalesMetrics) / 100;
    const showRate = calculateShowRate(preSalesMetrics, sellersMetrics) / 100;
    const forecastTotal = aggregateForecastTotal(monthlyDealForecast);
    const healthScore = calculateHealthScore(harvest);

    return [
      {
        label: 'SQLs Geradas',
        value: sqls.toLocaleString('pt-BR'),
        sublabel: `Rejeição ${(rejectionRate).toLocaleString('pt-BR', {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        })}`
      },
      {
        label: 'Reuniões',
        value: totalMeetings.toLocaleString('pt-BR'),
        sublabel: `Feedback em ${percentageFormatter.format(feedbackRate)}`
      },
      {
        label: 'Qualidade das Reuniões',
        value: qualityScore.toFixed(1),
        sublabel: 'Índice 1-5'
      },
      {
        label: 'Taxa de Conexão PV',
        value: percentageFormatter.format(connectionRate),
        sublabel: 'Answered Calls / Total'
      },
      {
        label: 'Taxa de Show Geral',
        value: percentageFormatter.format(showRate),
        sublabel: 'Meetings completadas'
      },
      {
        label: 'Forecast Próximo Mês',
        value: currencyFormatter.format(forecastTotal),
        sublabel: `Health Score ${healthScore.toFixed(0)}%`
      }
    ];
  }, [
    harvest,
    meetingQuality,
    meetingQualitySQL,
    monthlyDealForecast,
    preSalesMetrics,
    sellersMetrics
  ]);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-slate-400">{kpi.label}</p>
            <p className="text-3xl font-bold text-white">{kpi.value}</p>
            <p className="text-sm text-slate-400">{kpi.sublabel}</p>
          </div>
        </Card>
      ))}
    </section>
  );
}
