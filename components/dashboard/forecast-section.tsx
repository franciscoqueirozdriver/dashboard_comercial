'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '@/components/ui/card';
import type {
  BusinessForecastByQualificationCountItem,
  BusinessForecastByQualificationValueItem,
  MonthlyDealForecastItem
} from '@/lib/spotter/types';
import { parseCurrencyBRLToNumber } from '@/lib/spotter/parsers';
import { summarizeQualificationCounts } from '@/lib/spotter/metrics';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

type ForecastSectionProps = {
  monthlyDealForecast: MonthlyDealForecastItem[];
  qualificationCount: BusinessForecastByQualificationCountItem[];
  qualificationValue: BusinessForecastByQualificationValueItem[];
};

export function ForecastSection({
  monthlyDealForecast,
  qualificationCount,
  qualificationValue
}: ForecastSectionProps) {
  const safeMonthlyDealForecast = monthlyDealForecast ?? [];

  const timelineData = useMemo(() => {
    const months = new Set<string>();
    safeMonthlyDealForecast.forEach((item) => {
      const safeForecasts = item.monthlyForecasts ?? [];
      safeForecasts.forEach((forecast) => months.add(forecast.periodName));
    });

    return Array.from(months)
      .sort((a, b) => a.localeCompare(b))
      .map((month) => {
        const total = safeMonthlyDealForecast.reduce((acc, seller) => {
          const safeForecasts = seller.monthlyForecasts ?? [];
          const monthValue = safeForecasts.find((value) => value.periodName === month);
          if (!monthValue) return acc;
          const parsed = parseCurrencyBRLToNumber(monthValue.forecastValue) ?? 0;
          return acc + parsed;
        }, 0);
        return { month, total };
      });
  }, [safeMonthlyDealForecast]);

  const perSellerData = useMemo(() => {
    const rows = safeMonthlyDealForecast.map((item) => {
      const safeForecasts = item.monthlyForecasts ?? [];

      const total = safeForecasts.reduce((acc, forecast) => {
        const parsedValue = parseCurrencyBRLToNumber(forecast.forecastValue) ?? 0;
        return acc + parsedValue;
      }, 0);

      return {
        userName: item.userName,
        total
      };
    });

    return rows.map((row) => ({
      name: row.userName,
      value: row.total
    }));
  }, [safeMonthlyDealForecast]);

  const qualificationSummary = useMemo(
    () => summarizeQualificationCounts(qualificationCount, qualificationValue),
    [qualificationCount, qualificationValue]
  );

  const qualificationData = useMemo(
    () => [
      {
        key: 'Muito Quente',
        count: qualificationSummary.veryHotCount,
        value: qualificationSummary.veryHotValue
      },
      {
        key: 'Congelada',
        count: qualificationSummary.frozenCount,
        value: 0
      },
      {
        key: 'Total',
        count: qualificationSummary.totalCount,
        value: qualificationSummary.totalValue
      }
    ],
    [qualificationSummary]
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card title="Forecast consolidado" description="Tendência mensal consolidada por vendedor e squad.">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => currencyFormatter.format(value)} />
              <Tooltip
                formatter={(value: number) => currencyFormatter.format(value)}
                labelFormatter={(label) => `Período ${label}`}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
              <Line type="monotone" dataKey="total" stroke="#34d399" strokeWidth={3} dot={false} name="Total" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perSellerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => currencyFormatter.format(value)} />
              <Tooltip
                formatter={(value: number) => currencyFormatter.format(value)}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
              <Bar dataKey="value" fill="#818cf8" name="Forecast acumulado" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Qualificação do pipeline" description="Volume e valor previstos por temperatura.">
        <div className="h-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={qualificationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="key" type="category" stroke="#94a3b8" width={100} />
              <Tooltip
                formatter={(value: number, key, payload) => {
                  if (payload?.dataKey === 'value') {
                    return currencyFormatter.format(value);
                  }
                  return value;
                }}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
              <Legend />
              <Bar dataKey="count" name="Contagem" fill="#34d399" />
              <Bar dataKey="value" name="Valor" fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
}
