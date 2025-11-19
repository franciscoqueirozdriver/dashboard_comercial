'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import type { SpotterAnalyticsDTO } from '@/lib/spotter/types';

type SpotterErrorResponse = {
  error: string;
  details?: string;
};

export type DashboardFilters = {
  startDate: string;
  endDate: string;
  collaborator?: string;
  origin?: string;
  questionnaireId?: string;
};

const fetcher = async (url: string): Promise<SpotterAnalyticsDTO> => {
  const response = await fetch(url);
  const json = (await response.json()) as SpotterAnalyticsDTO | SpotterErrorResponse;

  if (!response.ok) {
    const message = 'error' in json ? json.details ?? json.error : `Spotter API error (${response.status})`;
    throw new Error(message);
  }

  if ('error' in json) {
    throw new Error(json.details ?? json.error);
  }

  return json;
};

export function getCurrentMonthFilters(): DashboardFilters {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const format = (date: Date) => date.toISOString().split('T')[0];

  return {
    startDate: format(startOfMonth),
    endDate: format(endOfMonth)
  };
}

function buildSpotterQuery(filters: DashboardFilters) {
  const params = new URLSearchParams({
    datainicial: filters.startDate,
    datafinal: filters.endDate
  });

  if (filters.collaborator && filters.collaborator !== 'all') {
    params.set('colaborador', filters.collaborator);
  }

  if (filters.origin && filters.origin !== 'all') {
    params.set('origem', filters.origin);
  }

  if (filters.questionnaireId && filters.questionnaireId !== 'all') {
    params.set('questionario', filters.questionnaireId);
  }

  return params.toString();
}

export function useSpotterAnalytics(filters: DashboardFilters) {
  const query = useMemo(() => buildSpotterQuery(filters), [filters]);

  const { data, error, isLoading, mutate } = useSWR<SpotterAnalyticsDTO>(
    `/api/analytics/spotter?${query}`,
    fetcher,
    {
      refreshInterval: 60 * 1000,
      keepPreviousData: true
    }
  );

  return { data, error, isLoading, mutate };
}
