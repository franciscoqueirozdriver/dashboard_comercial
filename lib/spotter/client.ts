import type {
  AverageTimeAggregate,
  BusinessForecastByQualificationCountItem,
  BusinessForecastByQualificationValueItem,
  CallFeedbackRequestItem,
  CallFeedbackSentItem,
  FunnelActivityItem,
  HarvestItem,
  MeetingQualityItem,
  MeetingQualitySQLItem,
  MonthlyDealForecastItem,
  PreSalesMetricsItem,
  PreSalesPerformanceItem,
  PreSalesProductionItem,
  QuestionnaireTemperature,
  SellersMetricsItem,
  SellerPerformanceItem,
  SellersProductionItem
} from '@/lib/spotter/types';

export type SpotterQueryParams = Record<string, string>;

function buildBaseUrl() {
  const rawBaseUrl = process.env.EXACT_SPOTTER_BASE_URL ?? 'https://api.exactspotter.com/v3';
  const sanitizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
  const apiVersion = process.env.EXACT_SPOTTER_API_VERSION?.replace(/^\/+|\/+$/g, '');

  if (apiVersion && !sanitizedBaseUrl.toLowerCase().endsWith(`/${apiVersion.toLowerCase()}`)) {
    return `${sanitizedBaseUrl}/${apiVersion}/`;
  }

  return `${sanitizedBaseUrl}/`;
}

async function spotterFetch<T>(path: string, searchParams?: SpotterQueryParams): Promise<T> {
  const baseWithTrailingSlash = buildBaseUrl();
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, baseWithTrailingSlash);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.EXACT_SPOTTER_TOKEN ?? ''}`,
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }
    console.error('Spotter API error response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorBody
    });
    throw new Error(`Spotter API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as { value: T };
  return json.value;
}

export function fetchFunnelActivity(params: SpotterQueryParams) {
  return spotterFetch<FunnelActivityItem[]>('/FunnelActivity', params);
}

export function fetchHarvest(params: SpotterQueryParams) {
  return spotterFetch<HarvestItem[]>('/Harvest', params);
}

export function fetchSellerPerformance(params: SpotterQueryParams) {
  return spotterFetch<SellerPerformanceItem[]>('/SellerPerformance', params);
}

export function fetchPreSalesPerformance(params: SpotterQueryParams) {
  return spotterFetch<PreSalesPerformanceItem[]>('/PreSalesPerformance', params);
}

export function fetchPreSalesMetrics(params: SpotterQueryParams) {
  return spotterFetch<PreSalesMetricsItem[]>('/PreSalesMetrics', params);
}

export function fetchSellersMetrics(params: SpotterQueryParams) {
  return spotterFetch<SellersMetricsItem[]>('/SellersMetrics', params);
}

export function fetchPreSalesProduction(params: SpotterQueryParams) {
  return spotterFetch<PreSalesProductionItem[]>('/PreSalesProduction', params);
}

export function fetchSellersProduction(params: SpotterQueryParams) {
  return spotterFetch<SellersProductionItem[]>('/SellersProduction', params);
}

export function fetchCallFeedbacksSent(params: SpotterQueryParams) {
  return spotterFetch<CallFeedbackSentItem[]>('/CallFeedbacksSent', params);
}

export function fetchCallFeedbackRequests(params: SpotterQueryParams) {
  return spotterFetch<CallFeedbackRequestItem[]>('/CallFeedbackRequests', params);
}

export function fetchMeetingQuality(params: SpotterQueryParams) {
  return spotterFetch<MeetingQualityItem>('/MeetingQuality', params);
}

export function fetchMeetingQualitySQL(params: SpotterQueryParams) {
  return spotterFetch<MeetingQualitySQLItem>('/MeetingQualitySQL', params);
}

export function fetchMonthlyDealForecast(params: SpotterQueryParams) {
  return spotterFetch<MonthlyDealForecastItem[]>('/MonthlyDealForecast', params);
}

export function fetchBusinessForecastByQualificationCount(params: SpotterQueryParams) {
  return spotterFetch<BusinessForecastByQualificationCountItem[]>(
    '/BusinessForecastByQualificationCount',
    params
  );
}

export function fetchBusinessForecastByQualificationValue(params: SpotterQueryParams) {
  return spotterFetch<BusinessForecastByQualificationValueItem[]>(
    '/BusinessForecastByQualificationValue',
    params
  );
}

export function fetchQuestionnaireTemperatures(params: SpotterQueryParams) {
  return spotterFetch<QuestionnaireTemperature[]>('/Temperatures', params);
}

export function fetchAverageTime(params: SpotterQueryParams) {
  return spotterFetch<AverageTimeAggregate>('/AverageTime', params);
}
