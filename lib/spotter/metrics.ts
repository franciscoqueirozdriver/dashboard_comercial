import type {
  AverageTimeByOrigin,
  BusinessForecastByQualificationCountItem,
  BusinessForecastByQualificationValueItem,
  HarvestItem,
  MeetingQualityItem,
  MeetingQualitySQLItem,
  MonthlyDealForecastItem,
  PreSalesMetricsItem,
  SellersMetricsItem
} from './types';
import { parseCurrencyBRLToNumber } from './parsers';

type NumericInput = number | null | undefined;

export function safeDivide(numerator: NumericInput, denominator: NumericInput): number {
  if (!numerator || !denominator) {
    return 0;
  }

  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

export function calculatePercentage(numerator: NumericInput, denominator: NumericInput): number {
  return safeDivide(numerator, denominator) * 100;
}

export function calculateRejectionRate(sql: MeetingQualitySQLItem | null): number {
  if (!sql) {
    return 0;
  }

  return calculatePercentage(sql.rejected, sql.sql);
}

export function calculateConnectionRate(metrics: PreSalesMetricsItem[]): number {
  const totals = metrics.reduce(
    (acc, metric) => {
      acc.answered += metric.answeredCalls;
      acc.total += metric.totalCalls;
      return acc;
    },
    { answered: 0, total: 0 }
  );

  return calculatePercentage(totals.answered, totals.total);
}

export function calculateShowRate(
  preSales: Pick<PreSalesMetricsItem, 'scheduledMeetings' | 'completedMeetings'>[],
  sellers: Pick<SellersMetricsItem, 'scheduledMeetings' | 'completedMeetings'>[]
): number {
  const totals = [...preSales, ...sellers].reduce(
    (acc, metric) => {
      acc.scheduled += metric.scheduledMeetings;
      acc.completed += metric.completedMeetings;
      return acc;
    },
    { scheduled: 0, completed: 0 }
  );

  return calculatePercentage(totals.completed, totals.scheduled);
}

export function calculateMeetingQualityScore(meetingQuality: MeetingQualityItem | null): number {
  if (!meetingQuality || meetingQuality.totalMeetings === 0) {
    return 0;
  }

  const weighted = meetingQuality.quantities.reduce((acc, item) => acc + item.quantity * item.score, 0);
  return safeDivide(weighted, meetingQuality.totalMeetings);
}

export function aggregateForecastTotal(items: MonthlyDealForecastItem[]): number {
  return items.reduce((acc, item) => {
    const forecastValue = item.monthlyForecasts.reduce((innerAcc, forecast) => {
      const parsed = parseCurrencyBRLToNumber(forecast.forecastValue);
      return innerAcc + (parsed ?? 0);
    }, 0);
    return acc + forecastValue;
  }, 0);
}

export function calculateHealthScore(harvest: HarvestItem[]): number {
  if (!harvest.length) {
    return 0;
  }

  const averageConversion = harvest.reduce((acc, item) => acc + (item.conversionRate ?? 0), 0) / harvest.length;
  const penalties = harvest.reduce((acc, item) => acc + (item.discarded ?? 0) + (item.parked ?? 0), 0);
  const normalizedPenalty = penalties / Math.max(harvest.length * 100, 1);
  return Math.max(0, averageConversion - normalizedPenalty * 100);
}

export function summarizeQualificationCounts(
  counts: BusinessForecastByQualificationCountItem[],
  values: BusinessForecastByQualificationValueItem[]
): { key: string; count: number; value: number }[] {
  const result: Record<string, { key: string; count: number; value: number }> = {};

  counts.forEach((item) => {
    item.qualifications.forEach((qualification) => {
      const count = Number.parseFloat(qualification.value);
      if (!Number.isNaN(count)) {
        result[qualification.key] = {
          key: qualification.key,
          count,
          value: result[qualification.key]?.value ?? 0
        };
      }
    });
  });

  values.forEach((item) => {
    item.qualifications.forEach((qualification) => {
      const parsed = parseCurrencyBRLToNumber(qualification.value) ?? 0;
      result[qualification.key] = {
        key: qualification.key,
        count: result[qualification.key]?.count ?? 0,
        value: parsed + (result[qualification.key]?.value ?? 0)
      };
    });
  });

  return Object.values(result);
}

export function averageTimeInHours(value: number | null): number {
  if (!value) {
    return 0;
  }
  return value / 3600;
}

export function buildLeadSpeedScore(origin: AverageTimeByOrigin): number {
  const total = (origin.call ?? 0) + (origin.scheduling ?? 0) + (origin.activity ?? 0) + (origin.sale ?? 0);
  if (total === 0) {
    return 0;
  }
  const maxReference = 7 * 24 * 3600;
  return Math.max(0, 100 - (total / maxReference) * 100);
}
