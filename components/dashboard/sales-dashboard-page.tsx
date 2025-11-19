'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SellersSection } from './sellers-section';
import { ForecastSection } from './forecast-section';
import { FunnelSection } from './funnel-section';
import { VelocitySection } from './velocity-section';
import { FilterToolbar } from './filter-toolbar';
import { SalesKpiCards } from './sales-kpi-cards';
import { useSpotterAnalytics } from './use-spotter-analytics';
import type { DashboardFilters } from './use-spotter-analytics';
import { buildFiltersFromSearchParams, filtersToQueryString } from './filter-utils';

export function SalesDashboardPage() {
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => buildFiltersFromSearchParams(searchParams), [searchParams]);
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const { data, error, isLoading } = useSpotterAnalytics(filters);

  const safeData = useMemo(
    () => ({
      funnelActivity: data?.funnelActivity ?? [],
      harvest: data?.harvest ?? [],
      sellerPerformance: data?.sellerPerformance ?? [],
      sellersMetrics: data?.sellersMetrics ?? [],
      sellersProduction: data?.sellersProduction ?? [],
      meetingQualitySQL: data?.meetingQualitySQL ?? null,
      monthlyDealForecast: data?.monthlyDealForecast ?? [],
      businessForecastByQualificationCount: data?.businessForecastByQualificationCount ?? [],
      businessForecastByQualificationValue: data?.businessForecastByQualificationValue ?? [],
      averageTime: data?.averageTime ?? null
    }),
    [data]
  );

  const collaboratorOptions = useMemo(
    () => safeData.sellersMetrics.map((metric) => metric.userName),
    [safeData.sellersMetrics]
  );
  const originOptions = useMemo(() => {
    const list = safeData.averageTime?.list ?? [];
    return list.map((item) => item.name);
  }, [safeData.averageTime]);

  if (error) {
    return (
      <div className="p-10 text-center text-red-300">
        Não foi possível carregar os dados do Spotter. Tente novamente mais tarde.
      </div>
    );
  }

  if (isLoading || !data) {
    return <div className="p-10 text-center text-slate-300">Carregando visão de vendas...</div>;
  }

  return (
    <main className="space-y-10 px-4 py-8 lg:px-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-400">Vendas</p>
        <h1 className="text-3xl font-bold text-white">Painel dos Closers</h1>
        <p className="text-slate-400">
          Forecast, pipeline e indicadores de conversão dos vendedores conectados ao Spotter.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href={`/dashboard/comercial?${filtersToQueryString(filters)}`}
            className="text-emerald-300 underline-offset-4 hover:underline"
          >
            Visão geral
          </Link>
          <Link
            href={`/dashboard/pre-venda?${filtersToQueryString(filters)}`}
            className="text-sky-300 underline-offset-4 hover:underline"
          >
            Ver painel de pré-venda
          </Link>
        </div>
      </header>

      <FilterToolbar
        filters={filters}
        onChange={setFilters}
        collaboratorOptions={collaboratorOptions}
        originOptions={originOptions}
        showQuestionnaire={false}
      />

      <SalesKpiCards
        sellersMetrics={safeData.sellersMetrics}
        sellerPerformance={safeData.sellerPerformance}
        meetingQualitySQL={safeData.meetingQualitySQL}
        monthlyDealForecast={safeData.monthlyDealForecast}
        qualificationValues={safeData.businessForecastByQualificationValue}
        averageTime={safeData.averageTime}
      />

      <SellersSection metrics={safeData.sellersMetrics} production={safeData.sellersProduction} />

      <FunnelSection harvest={safeData.harvest} funnelActivity={safeData.funnelActivity} />

      <ForecastSection
        monthlyDealForecast={safeData.monthlyDealForecast}
        qualificationCount={safeData.businessForecastByQualificationCount}
        qualificationValue={safeData.businessForecastByQualificationValue}
      />

      <VelocitySection averageTime={safeData.averageTime} />
    </main>
  );
}
