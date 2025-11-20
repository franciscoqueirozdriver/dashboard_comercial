'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import type {
  AverageTimeAggregate,
  BusinessForecastByQualificationValueItem,
  MeetingQualitySQLItem,
  MonthlyDealForecastItem,
  SellerPerformanceItem,
  SellersMetricsItem
} from '@/lib/spotter/types';
import {
  aggregateForecastTotal,
  averageTimeToSaleHours,
  calculateSalesActualValue,
  calculateSqlToSaleConversion,
  calculateRejectionRate
} from '@/lib/spotter/metrics';
import { parseCurrencyBRLToNumber } from '@/lib/spotter/parsers';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 });

function extractVeryHotValue(items: BusinessForecastByQualificationValueItem[]): number {
  return items.reduce((acc, item) => {
    const veryHot = item.qualifications.find((q) => q.key.toLowerCase() === 'very hot');
    if (!veryHot) {
      return acc;
    }
    return acc + (parseCurrencyBRLToNumber(veryHot.value) ?? 0);
  }, 0);
}

export function SalesKpiCards({
  sellersMetrics,
  sellerPerformance,
  meetingQualitySQL,
  monthlyDealForecast,
  qualificationValues,
  averageTime
}: {
  sellersMetrics: SellersMetricsItem[];
  sellerPerformance: SellerPerformanceItem[];
  meetingQualitySQL: MeetingQualitySQLItem | null;
  monthlyDealForecast: MonthlyDealForecastItem[];
  qualificationValues: BusinessForecastByQualificationValueItem[];
  averageTime: AverageTimeAggregate | null;
}) {
  const kpis = useMemo(() => {
    const totals = sellersMetrics.reduce(
      (acc, item) => {
        acc.sales += item.sales;
        acc.scheduled += item.scheduledMeetings;
        acc.completed += item.completedMeetings;
        acc.sql += item.sql;
        return acc;
      },
      { sales: 0, scheduled: 0, completed: 0, sql: 0 }
    );

    const salesValue = calculateSalesActualValue(sellerPerformance);
    const forecastTotal = aggregateForecastTotal(monthlyDealForecast);
    const veryHotValue = extractVeryHotValue(qualificationValues);
    const showRate = totals.scheduled === 0 ? 0 : totals.completed / totals.scheduled;
    const sqlToSale = calculateSqlToSaleConversion(sellersMetrics) / 100;
    const rejectionRate = calculateRejectionRate(meetingQualitySQL) / 100;
    const avgSaleHours = averageTimeToSaleHours(averageTime);

    return [
      {
        label: 'Vendas (R$ / #)',
        value: `${currency.format(salesValue)} / ${totals.sales.toLocaleString('pt-BR')}`,
        sublabel: 'Performance consolidada do mês'
      },
      {
        label: 'Conversão SQL → Venda',
        value: percent.format(sqlToSale),
        sublabel: `${totals.sales.toLocaleString('pt-BR')} vendas de ${totals.sql.toLocaleString('pt-BR')} SQLs`
      },
      {
        label: 'Show rate de reuniões',
        value: percent.format(showRate),
        sublabel: `${totals.completed.toLocaleString('pt-BR')} / ${totals.scheduled.toLocaleString('pt-BR')}`
      },
      {
        label: 'Forecast do mês',
        value: currency.format(forecastTotal),
        sublabel: 'Previsão consolidada dos vendedores'
      },
      {
        label: 'Pipeline Very hot',
        value: currency.format(veryHotValue),
        sublabel: 'Valor somado da temperatura Very hot'
      },
      {
        label: 'Velocidade até fechar',
        value: `${(avgSaleHours / 24).toFixed(1)} dias`,
        sublabel: `Rejeição de SQL ${percent.format(rejectionRate)}`
      }
    ];
  }, [averageTime, meetingQualitySQL, monthlyDealForecast, qualificationValues, sellerPerformance, sellersMetrics]);

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
