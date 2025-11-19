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

  const safeData = useMemo(
    () => ({
      funnelActivity: data?.funnelActivity ?? [],
      harvest: data?.harvest ?? [],
      sellerPerformance: data?.sellerPerformance ?? [],
      preSalesPerformance: data?.preSalesPerformance ?? [],
      preSalesMetrics: data?.preSalesMetrics ?? [],
      sellersMetrics: data?.sellersMetrics ?? [],
      preSalesProduction: data?.preSalesProduction ?? [],
      sellersProduction: data?.sellersProduction ?? [],
      callFeedbacksSent: data?.callFeedbacksSent ?? [],
      callFeedbackRequests: data?.callFeedbackRequests ?? [],
      meetingQuality: data?.meetingQuality ?? null,
      meetingQualitySQL: data?.meetingQualitySQL ?? null,
      monthlyDealForecast: data?.monthlyDealForecast ?? [],
      businessForecastByQualificationCount: data?.businessForecastByQualificationCount ?? [],
      businessForecastByQualificationValue: data?.businessForecastByQualificationValue ?? [],
      questionnaireTemperatures: data?.questionnaireTemperatures ?? [],
      averageTime: data?.averageTime ?? null
    }),
    [data]
  );

  const collaboratorOptions = useMemo(() => {
    if (!data) {
      return [];
    }
    const names = [
      ...safeData.preSalesMetrics.map((metric) => metric.userName),
      ...safeData.sellersMetrics.map((metric) => metric.userName)
    ];
    return Array.from(new Set(names));
  }, [data, safeData.preSalesMetrics, safeData.sellersMetrics]);

  const originOptions = useMemo(() => {
    const list = safeData.averageTime?.list ?? [];
    return list.map((item) => item.name);
  }, [safeData.averageTime]);

  const questionnaireOptions = useMemo(() => {
    const temperatures = safeData.questionnaireTemperatures ?? [];
    return temperatures.map((questionnaire) => ({
      id: questionnaire.questionnaireId,
      name: questionnaire.questionnaireName
    }));
  }, [safeData.questionnaireTemperatures]);

  if (error) {
    return (
      <div className="p-10 text-center text-red-300">
        Não foi possível carregar os dados do Spotter. Tente novamente mais tarde.
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
        meetingQuality={safeData.meetingQuality}
        meetingQualitySQL={safeData.meetingQualitySQL}
        preSalesMetrics={safeData.preSalesMetrics}
        sellersMetrics={safeData.sellersMetrics}
        harvest={safeData.harvest}
        monthlyDealForecast={safeData.monthlyDealForecast}
      />

      <FunnelSection harvest={safeData.harvest} funnelActivity={safeData.funnelActivity} />

      <PreSalesSection metrics={safeData.preSalesMetrics} production={safeData.preSalesProduction} />

      <SellersSection metrics={safeData.sellersMetrics} production={safeData.sellersProduction} />

      <QualitySection
        callFeedbacks={safeData.callFeedbacksSent}
        callFeedbackRequests={safeData.callFeedbackRequests}
        meetingQuality={safeData.meetingQuality}
        meetingQualitySQL={safeData.meetingQualitySQL}
      />

      <ForecastSection
        monthlyDealForecast={safeData.monthlyDealForecast}
        qualificationCount={safeData.businessForecastByQualificationCount}
        qualificationValue={safeData.businessForecastByQualificationValue}
      />

      <TemperatureSection questionnaireTemperatures={safeData.questionnaireTemperatures} />

      <VelocitySection averageTime={safeData.averageTime} />
    </main>
  );
}

export default MasterDashboardPage;
