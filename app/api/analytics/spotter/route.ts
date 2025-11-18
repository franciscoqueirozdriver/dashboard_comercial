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
  fetchSellersProduction
} from '@/lib/spotter/client';
import type { SpotterAnalyticsDTO } from '@/lib/spotter/types';

type SettledResult<T> = PromiseSettledResult<T>;

function buildBaseParams(searchParams: URLSearchParams) {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const format = (date: Date) => date.toISOString().split('T')[0];

  const datainicial = searchParams.get('datainicial') ?? format(startOfMonth);
  const datafinal = searchParams.get('datafinal') ?? format(today);
  const collaborator = searchParams.get('colaborador');
  const origin = searchParams.get('origem');
  const questionnaire = searchParams.get('questionario');

  const params: Record<string, string> = {
    datainicial,
    datafinal
  };

  if (collaborator) {
    params.colaborador = collaborator;
  }

  if (origin) {
    params.origem = origin;
  }

  if (questionnaire) {
    params.questionario = questionnaire;
  }

  return params;
}

function unwrapSettled<T>(result: SettledResult<T>, fallback: T) {
  if (result.status === 'fulfilled') {
    return result.value;
  }

  console.error(result.reason);
  return fallback;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = buildBaseParams(url.searchParams);

  const [
    funnelActivityResult,
    harvestResult,
    sellerPerformanceResult,
    preSalesPerformanceResult,
    preSalesMetricsResult,
    sellersMetricsResult,
    preSalesProductionResult,
    sellersProductionResult,
    callFeedbacksSentResult,
    callFeedbackRequestsResult,
    meetingQualityResult,
    meetingQualitySQLResult,
    monthlyDealForecastResult,
    businessForecastCountResult,
    businessForecastValueResult,
    questionnaireTemperaturesResult,
    averageTimeResult
  ] = await Promise.allSettled([
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
    funnelActivity: unwrapSettled(funnelActivityResult, []),
    harvest: unwrapSettled(harvestResult, []),
    sellerPerformance: unwrapSettled(sellerPerformanceResult, []),
    preSalesPerformance: unwrapSettled(preSalesPerformanceResult, []),
    preSalesMetrics: unwrapSettled(preSalesMetricsResult, []),
    sellersMetrics: unwrapSettled(sellersMetricsResult, []),
    preSalesProduction: unwrapSettled(preSalesProductionResult, []),
    sellersProduction: unwrapSettled(sellersProductionResult, []),
    callFeedbacksSent: unwrapSettled(callFeedbacksSentResult, []),
    callFeedbackRequests: unwrapSettled(callFeedbackRequestsResult, []),
    meetingQuality: unwrapSettled(meetingQualityResult, null),
    meetingQualitySQL: unwrapSettled(meetingQualitySQLResult, null),
    monthlyDealForecast: unwrapSettled(monthlyDealForecastResult, []),
    businessForecastByQualificationCount: unwrapSettled(businessForecastCountResult, []),
    businessForecastByQualificationValue: unwrapSettled(businessForecastValueResult, []),
    questionnaireTemperatures: unwrapSettled(questionnaireTemperaturesResult, []),
    averageTime: unwrapSettled(averageTimeResult, null)
  };

  return NextResponse.json(payload);
}
