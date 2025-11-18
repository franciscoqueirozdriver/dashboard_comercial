'use client';

import useSWR from 'swr';
import { KpiCards } from './kpi-cards';
import { FunnelSection } from './funnel-section';
import { PreSalesSection } from './pre-sales-section';
import { SellersSection } from './sellers-section';
import { QualitySection } from './quality-section';
import { ForecastSection } from './forecast-section';
import { TemperatureSection } from './temperature-section';
import { VelocitySection } from './velocity-section';
import type { SpotterAnalyticsDTO } from '@/lib/spotter/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<SpotterAnalyticsDTO>);

export function MasterDashboardPage() {
  const { data, error, isLoading } = useSWR<SpotterAnalyticsDTO>('/api/analytics/spotter', fetcher, {
    refreshInterval: 60 * 1000
  });

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

  return (
    <main className="space-y-10 px-4 py-8 lg:px-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Master dashboard</p>
        <h1 className="text-3xl font-bold text-white">Visão Comercial Consolidada</h1>
        <p className="text-slate-400">
          Indicadores em tempo real das operações de pré-vendas, vendas e qualidade das interações
          mapeados via Exact Spotter.
        </p>
      </header>

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
