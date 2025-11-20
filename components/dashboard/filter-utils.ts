import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { DashboardFilters } from './use-spotter-analytics';
import { getCurrentMonthFilters } from './use-spotter-analytics';

export function buildFiltersFromSearchParams(searchParams: ReadonlyURLSearchParams): DashboardFilters {
  const defaults = getCurrentMonthFilters();
  return {
    startDate: searchParams.get('datainicial') ?? defaults.startDate,
    endDate: searchParams.get('datafinal') ?? defaults.endDate,
    collaborator: searchParams.get('colaborador') ?? undefined,
    origin: searchParams.get('origem') ?? undefined,
    questionnaireId: searchParams.get('questionario') ?? undefined
  };
}

export function filtersToQueryString(filters: DashboardFilters): string {
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
