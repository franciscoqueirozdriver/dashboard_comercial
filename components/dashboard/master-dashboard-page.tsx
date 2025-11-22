'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { KpiCards } from './kpi-cards';
import { FunnelSection } from './funnel-section';
import { PreSalesSection } from './pre-sales-section';
import { SellersSection } from './sellers-section';
import { QualitySection } from './quality-section';
import { ForecastSection } from './forecast-section';
import { TemperatureSection } from './temperature-section';
import { VelocitySection } from './velocity-section';
import { FilterToolbar } from './filter-toolbar';
import { useSpotterAnalytics } from './use-spotter-analytics';
import type { DashboardFilters } from './use-spotter-analytics';
import { buildFiltersFromSearchParams, filtersToQueryString } from './filter-utils';

export function MasterDashboardPage() {
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => buildFiltersFromSearchParams(searchParams), [searchParams]);
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const { data, error, isLoading } = useSpotterAnalytics(filters);

  const collaboratorOptions = useMemo(() => {
    if (!data) {
      return [];
    }
    const names = [
      ...data.preSalesMetrics.map((metric) => metric.userName),
      ...data.sellersMetrics.map((metric) => metric.userName)
    ];
    return Array.from(new Set(names));
  }, [data]);

  const originOptions = useMemo(() => data?.averageTime?.list.map((item) => item.name) ?? [], [data]);

  const questionnaireOptions = useMemo(
    () =>
      data?.questionnaireTemperatures.map((questionnaire) => ({
        id: questionnaire.questionnaireId,
        name: questionnaire.questionnaireName
      })) ?? [],
    [data]
  );

  if (error) {
    return (
      <div className="p-10 text-center text-red-300">
        Ocorreu um erro ao carregar o dashboard. Tente novamente em instantes.
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="p-10 text-center text-slate-300">
        Carregando indicadores comerciais...
      </div>
    );
  }

  const query = filtersToQueryString(filters);

  return (
    <main className="space-y-10 px-4 py-8 lg:px-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Master dashboard</p>
        <h1 className="text-3xl font-bold text-white">Visão Comercial Consolidada</h1>
        <p className="text-slate-400">
          Indicadores em tempo real das operações de pré-vendas, vendas e qualidade das interações mapeados via
          Exact Spotter.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href={`/dashboard/pre-venda?${query}`}
            className="text-emerald-300 underline-offset-4 hover:underline"
          >
            Ir para Pré-venda
          </Link>
          <Link href={`/dashboard/vendas?${query}`} className="text-sky-300 underline-offset-4 hover:underline">
            Ir para Vendas
          </Link>
        </div>
      </header>

      <FilterToolbar
        filters={filters}
        onChange={setFilters}
        collaboratorOptions={collaboratorOptions}
        originOptions={originOptions}
        questionnaireOptions={questionnaireOptions}
      />

      <KpiCards
        meetingQuality={data.meetingQuality}
        meetingQualitySQL={data.meetingQualitySQL}
        preSalesMetrics={data.preSalesMetrics}
        sellersMetrics={data.sellersMetrics}
        harvest={data.harvest}
        monthlyDealForecast={data.monthlyDealForecast}
      />

      <FunnelSection harvest={data.harvest} funnelActivity={data.funnelActivity} />

      <PreSalesSection metrics={data.preSalesMetrics} production={data.preSalesProduction} />

      <SellersSection metrics={data.sellersMetrics} production={data.sellersProduction} />

      <QualitySection
        callFeedbacks={data.callFeedbacksSent}
        callFeedbackRequests={data.callFeedbackRequests}
        meetingQuality={data.meetingQuality}
        meetingQualitySQL={data.meetingQualitySQL}
      />

      <ForecastSection
        monthlyDealForecast={data.monthlyDealForecast}
        qualificationCount={data.businessForecastByQualificationCount}
        qualificationValue={data.businessForecastByQualificationValue}
      />

      <TemperatureSection questionnaireTemperatures={data.questionnaireTemperatures} />

      <VelocitySection averageTime={data.averageTime} />
    </main>
  );
}

export default MasterDashboardPage;
