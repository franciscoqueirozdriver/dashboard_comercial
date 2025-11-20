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
import type {
  BusinessForecastByQualificationCountItem,
  BusinessForecastByQualificationValueItem,
  SpotterAnalyticsDTO
} from '@/lib/spotter/types';

export const dynamic = 'force-dynamic';

type SpotterErrorEntry = { resource: string; message: string };
type SpotterAnalyticsResponse = SpotterAnalyticsDTO & { errors?: SpotterErrorEntry[] };

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

function buildBaseParams(searchParams: URLSearchParams): SpotterQueryParams | null {
  const dataInicial = normalizeDate(
    searchParams.get('datainicial') ?? searchParams.get('dataInicial')
  );
  const dataFinal = normalizeDate(searchParams.get('datafinal') ?? searchParams.get('dataFinal'));

  if (!dataInicial || !dataFinal) {
    return null;
  }

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

function unwrapResult<T>(
  result: PromiseSettledResult<T>,
  resource: string,
  errors: SpotterErrorEntry[],
  fallback: T
): T {
  if (result.status === 'fulfilled') {
    return result.value;
  }

  const message = result.reason instanceof Error ? result.reason.message : String(result.reason);
  errors.push({ resource, message });
  return fallback;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = buildBaseParams(url.searchParams);

    if (!params) {
      return NextResponse.json(
        { error: 'Parâmetros datainicial e datafinal são obrigatórios no formato YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    const etapaId = url.searchParams.get('etapaId') ?? url.searchParams.get('etapaid');
    const shouldCallQualificationForecast = Boolean(etapaId);
    const qualificationParams = shouldCallQualificationForecast
      ? { ...params, etapaid: etapaId as string }
      : null;

    const qualificationCountPromise: Promise<BusinessForecastByQualificationCountItem[]> =
      shouldCallQualificationForecast
        ? fetchBusinessForecastByQualificationCount(qualificationParams!)
        : Promise.resolve([] as BusinessForecastByQualificationCountItem[]);

    const qualificationValuePromise: Promise<BusinessForecastByQualificationValueItem[]> =
      shouldCallQualificationForecast
        ? fetchBusinessForecastByQualificationValue(qualificationParams!)
        : Promise.resolve([] as BusinessForecastByQualificationValueItem[]);

    const requests = [
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
      qualificationCountPromise,
      qualificationValuePromise,
      fetchQuestionnaireTemperatures(params),
      fetchAverageTime(params)
    ] as const satisfies readonly [
      ReturnType<typeof fetchFunnelActivity>,
      ReturnType<typeof fetchHarvest>,
      ReturnType<typeof fetchSellerPerformance>,
      ReturnType<typeof fetchPreSalesPerformance>,
      ReturnType<typeof fetchPreSalesMetrics>,
      ReturnType<typeof fetchSellersMetrics>,
      ReturnType<typeof fetchPreSalesProduction>,
      ReturnType<typeof fetchSellersProduction>,
      ReturnType<typeof fetchCallFeedbacksSent>,
      ReturnType<typeof fetchCallFeedbackRequests>,
      ReturnType<typeof fetchMeetingQuality>,
      ReturnType<typeof fetchMeetingQualitySQL>,
      ReturnType<typeof fetchMonthlyDealForecast>,
      Promise<BusinessForecastByQualificationCountItem[]>,
      Promise<BusinessForecastByQualificationValueItem[]>,
      ReturnType<typeof fetchQuestionnaireTemperatures>,
      ReturnType<typeof fetchAverageTime>
    ];

    const results = await Promise.allSettled(requests);

    const errors: SpotterErrorEntry[] = [];

    const funnelActivity = unwrapResult(results[0], 'FunnelActivity', errors, []);
    const harvest = unwrapResult(results[1], 'Harvest', errors, []);
    const sellerPerformance = unwrapResult(results[2], 'SellerPerformance', errors, []);
    const preSalesPerformance = unwrapResult(results[3], 'PreSalesPerformance', errors, []);
    const preSalesMetrics = unwrapResult(results[4], 'PreSalesMetrics', errors, []);
    const sellersMetrics = unwrapResult(results[5], 'SellersMetrics', errors, []);
    const preSalesProduction = unwrapResult(results[6], 'PreSalesProduction', errors, []);
    const sellersProduction = unwrapResult(results[7], 'SellersProduction', errors, []);
    const callFeedbacksSent = unwrapResult(results[8], 'CallFeedbacksSent', errors, []);
    const callFeedbackRequests = unwrapResult(results[9], 'CallFeedbackRequests', errors, []);
    const meetingQuality = unwrapResult(results[10], 'MeetingQuality', errors, null);
    const meetingQualitySQL = unwrapResult(results[11], 'MeetingQualitySQL', errors, null);
    const monthlyDealForecast = unwrapResult(results[12], 'MonthlyDealForecast', errors, []);
    const businessForecastByQualificationCount = unwrapResult(
      results[13],
      'BusinessForecastByQualificationCount',
      errors,
      []
    );
    const businessForecastByQualificationValue = unwrapResult(
      results[14],
      'BusinessForecastByQualificationValue',
      errors,
      []
    );
    const questionnaireTemperatures = unwrapResult(
      results[15],
      'Temperatures',
      errors,
      []
    );
    const averageTime = unwrapResult(results[16], 'AverageTime', errors, null);

    const payload: SpotterAnalyticsResponse = {
      funnelActivity: funnelActivity ?? [],
      harvest: harvest ?? [],
      sellerPerformance: sellerPerformance ?? [],
      preSalesPerformance: preSalesPerformance ?? [],
      preSalesMetrics: preSalesMetrics ?? [],
      sellersMetrics: sellersMetrics ?? [],
      preSalesProduction: preSalesProduction ?? [],
      sellersProduction: sellersProduction ?? [],
      callFeedbacksSent: callFeedbacksSent ?? [],
      callFeedbackRequests: callFeedbackRequests ?? [],
      meetingQuality,
      meetingQualitySQL,
      monthlyDealForecast: monthlyDealForecast ?? [],
      businessForecastByQualificationCount: businessForecastByQualificationCount ?? [],
      businessForecastByQualificationValue: businessForecastByQualificationValue ?? [],
      questionnaireTemperatures: questionnaireTemperatures ?? [],
      averageTime,
      errors: errors.length ? errors : undefined
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
