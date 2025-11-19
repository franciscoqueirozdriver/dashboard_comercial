import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAverageTime,
  fetchBusinessForecastByQualificationCount,
  fetchBusinessForecastByQualificationValue,
  fetchCallFeedbackRequests,
  fetchCallFeedbacksSent,
  fetchFunnelActivity,
  fetchHarvest,
  fetchMeetingQuality,
  fetchMeetingQualitySQL,
  fetchMonthlyDealForecast,
  fetchPreSalesMetrics,
  fetchPreSalesPerformance,
  fetchPreSalesProduction,
  fetchQuestionnaireTemperatures,
  fetchSellerPerformance,
  fetchSellersMetrics,
  fetchSellersProduction,
  type SpotterQueryParams
} from '@/lib/spotter/client';
import type { SpotterAnalyticsDTO } from '@/lib/spotter/types';

export const dynamic = 'force-dynamic';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalizeDate(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return formatDate(parsed);
}

function getDefaultDateRange() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    dataInicial: formatDate(startOfMonth),
    dataFinal: formatDate(endOfMonth)
  };
}

function buildBaseParams(searchParams: URLSearchParams): SpotterQueryParams {
  const defaults = getDefaultDateRange();
  const dataInicial =
    normalizeDate(searchParams.get('datainicial') ?? searchParams.get('dataInicial')) ??
    defaults.dataInicial;
  const dataFinal =
    normalizeDate(searchParams.get('datafinal') ?? searchParams.get('dataFinal')) ??
    defaults.dataFinal;

  const params: SpotterQueryParams = {
    dataInicial,
    dataFinal
  };

  const collaborator = searchParams.get('colaborador');
  if (collaborator) {
    params.colaborador = collaborator;
  }

  const origin = searchParams.get('origem');
  if (origin) {
    params.origem = origin;
  }

  const questionnaire = searchParams.get('questionario');
  if (questionnaire) {
    params.questionario = questionnaire;
  }

  return params;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = buildBaseParams(url.searchParams);

    const [
      funnelActivity,
      harvest,
      sellerPerformance,
      preSalesPerformance,
      preSalesMetrics,
      sellersMetrics,
      preSalesProduction,
      sellersProduction,
      callFeedbacksSent,
      callFeedbackRequests,
      meetingQuality,
      meetingQualitySQL,
      monthlyDealForecast,
      businessForecastByQualificationCount,
      businessForecastByQualificationValue,
      questionnaireTemperatures,
      averageTime
    ] = await Promise.all([
      fetchFunnelActivity(params),
      fetchHarvest(params),
      fetchSellerPerformance(params),
      fetchPreSalesPerformance(params),
      fetchPreSalesMetrics(params),
      fetchSellersMetrics(params),
      fetchPreSalesProduction(params),
      fetchSellersProduction(params),
      fetchCallFeedbacksSent(params),
      fetchCallFeedbackRequests(params),
      fetchMeetingQuality(params),
      fetchMeetingQualitySQL(params),
      fetchMonthlyDealForecast(params),
      fetchBusinessForecastByQualificationCount(params),
      fetchBusinessForecastByQualificationValue(params),
      fetchQuestionnaireTemperatures(params),
      fetchAverageTime(params)
    ]);

    const payload: SpotterAnalyticsDTO = {
      funnelActivity,
      harvest,
      sellerPerformance,
      preSalesPerformance,
      preSalesMetrics,
      sellersMetrics,
      preSalesProduction,
      sellersProduction,
      callFeedbacksSent,
      callFeedbackRequests,
      meetingQuality,
      meetingQualitySQL,
      monthlyDealForecast,
      businessForecastByQualificationCount,
      businessForecastByQualificationValue,
      questionnaireTemperatures,
      averageTime
    };

    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('TokenRequired')) {
      console.error(
        'Spotter API error: TokenRequired – verifique EXACT_SPOTTER_TOKEN e o header token_exact',
        error
      );
      return NextResponse.json(
        {
          error: 'Falha na autenticação com a Spotter'
        },
        { status: 500 }
      );
    }

    console.error('Spotter API error', error);
    return NextResponse.json(
      {
        error: 'Spotter API error',
        details: message
      },
      { status: 500 }
    );
  }
}
