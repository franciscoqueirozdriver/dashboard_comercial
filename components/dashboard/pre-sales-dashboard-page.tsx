'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PreSalesSection } from './pre-sales-section';
import { FunnelSection } from './funnel-section';
import { QualitySection } from './quality-section';
import { VelocitySection } from './velocity-section';
import { FilterToolbar } from './filter-toolbar';
import { PreSalesKpiCards } from './pre-sales-kpi-cards';
import { useSpotterAnalytics } from './use-spotter-analytics';
import type { DashboardFilters } from './use-spotter-analytics';
import { buildFiltersFromSearchParams, filtersToQueryString } from './filter-utils';

export function PreSalesDashboardPage() {
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => buildFiltersFromSearchParams(searchParams), [searchParams]);
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const { data, error, isLoading } = useSpotterAnalytics(filters);

  const safeData = useMemo(
    () => ({
      funnelActivity: data?.funnelActivity ?? [],
      harvest: data?.harvest ?? [],
      preSalesMetrics: data?.preSalesMetrics ?? [],
      preSalesProduction: data?.preSalesProduction ?? [],
      callFeedbacksSent: data?.callFeedbacksSent ?? [],
      callFeedbackRequests: data?.callFeedbackRequests ?? [],
      meetingQuality: data?.meetingQuality ?? null,
      meetingQualitySQL: data?.meetingQualitySQL ?? null,
      questionnaireTemperatures: data?.questionnaireTemperatures ?? [],
      averageTime: data?.averageTime ?? null
    }),
    [data]
  );

  const collaboratorOptions = useMemo(
    () => safeData.preSalesMetrics.map((metric) => metric.userName),
    [safeData.preSalesMetrics]
  );
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
      <div className="p-10 text-center text-slate-300">Carregando visão de pré-venda...</div>
    );
  }

  return (
    <main className="space-y-10 px-4 py-8 lg:px-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Pré-venda</p>
        <h1 className="text-3xl font-bold text-white">Painel de SDRs / Pré-vendas</h1>
        <p className="text-slate-400">
          Monitoramento das ligações, reuniões e qualidade das entregas da equipe de pré-venda.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href={`/dashboard/comercial?${filtersToQueryString(filters)}`}
            className="text-emerald-300 underline-offset-4 hover:underline"
          >
            Voltar para visão geral
          </Link>
          <Link
            href={`/dashboard/vendas?${filtersToQueryString(filters)}`}
            className="text-sky-300 underline-offset-4 hover:underline"
          >
            Ver painel de vendas
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

      <PreSalesKpiCards
        metrics={safeData.preSalesMetrics}
        meetingQuality={safeData.meetingQuality}
        meetingQualitySQL={safeData.meetingQualitySQL}
        questionnaireTemperatures={safeData.questionnaireTemperatures}
      />

      <PreSalesSection metrics={safeData.preSalesMetrics} production={safeData.preSalesProduction} />

      <FunnelSection harvest={safeData.harvest} funnelActivity={safeData.funnelActivity} />

      <QualitySection
        callFeedbacks={safeData.callFeedbacksSent}
        callFeedbackRequests={safeData.callFeedbackRequests}
        meetingQuality={safeData.meetingQuality}
        meetingQualitySQL={safeData.meetingQualitySQL}
      />

      <VelocitySection averageTime={safeData.averageTime} />
    </main>
  );
}
