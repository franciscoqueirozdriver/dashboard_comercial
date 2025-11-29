import type {
  AverageTimeAggregate,
  AverageTimeByOrigin,
  BusinessForecastByQualificationCountItem,
  BusinessForecastByQualificationValueItem,
  HarvestItem,
  MeetingQualityItem,
  MeetingQualitySQLItem,
  MonthlyDealForecastItem,
  PreSalesMetricsItem,
  QuestionnaireTemperature,
  SellersMetricsItem,
  SellerPerformanceItem
} from './types';
import { parseCurrencyBRLToNumber } from './parsers';

function toArray<T>(value: T[] | null | undefined): T[] {
  return value ?? [];
}

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
  const safeMetrics = toArray(metrics);

  if (!safeMetrics.length) return 0;

  const totals = safeMetrics.reduce(
    (acc, curr) => {
      acc.totalCalls += curr.totalCalls ?? 0;
      acc.answeredCalls += curr.answeredCalls ?? 0;
      return acc;
    },
    { totalCalls: 0, answeredCalls: 0 }
  );

  if (!totals.totalCalls) return 0;

  return (totals.answeredCalls / totals.totalCalls) * 100;
}

export function calculateShowRate(
  preSales: PreSalesMetricsItem[],
  sellers: SellersMetricsItem[]
): number {
  const safePreSales = toArray(preSales);
  const safeSellers = toArray(sellers);

  const totals = [...safePreSales, ...safeSellers].reduce(
    (acc, curr) => {
      acc.expectedMeetings += curr.expectedMeetings ?? 0;
      acc.completedMeetings += curr.completedMeetings ?? 0;
      return acc;
    },
    { expectedMeetings: 0, completedMeetings: 0 }
  );

  if (!totals.expectedMeetings) return 0;

  return (totals.completedMeetings / totals.expectedMeetings) * 100;
}

export function calculateMeetingQualityScore(
  meetingQuality: MeetingQualityItem | null
): number {
  if (!meetingQuality) return 0;

  const quantities = toArray(meetingQuality.quantities);

  if (!quantities.length) return 0;

  const totals = quantities.reduce(
    (acc, curr) => {
      const quantity = curr.quantity ?? 0;
      const score = curr.score ?? 0;

      acc.weightedScore += quantity * score;
      acc.totalMeetings += quantity;
      return acc;
    },
    { weightedScore: 0, totalMeetings: 0 }
  );

  if (!totals.totalMeetings) return 0;

  return totals.weightedScore / totals.totalMeetings;
}

export function aggregateForecastTotal(items: MonthlyDealForecastItem[]): number {
  const safeItems = toArray(items);

  if (!safeItems.length) return 0;

  return safeItems.reduce((acc, item) => {
    const forecasts = toArray(item.monthlyForecasts);

    const forecastValue = forecasts.reduce((innerAcc, forecast) => {
      const parsedValue = parseCurrencyBRLToNumber(forecast.forecastValue) ?? 0;
      return innerAcc + parsedValue;
    }, 0);

    return acc + forecastValue;
  }, 0);
}

export function calculateHealthScore(harvest: HarvestItem[]): number {
  const safeHarvest = toArray(harvest);

  if (!safeHarvest.length) return 0;

  const averageConversion =
    safeHarvest.reduce((acc, item) => {
      const conversionRate = item.conversionRate ?? 0;
      return acc + conversionRate;
    }, 0) / safeHarvest.length;

  return averageConversion;
}

export function summarizeQualificationCounts(
  counts: BusinessForecastByQualificationCountItem[],
  values: BusinessForecastByQualificationValueItem[]
) {
  const safeCounts = toArray(counts);
  const safeValues = toArray(values);

  const result: {
    veryHotCount: number;
    frozenCount: number;
    totalCount: number;
    veryHotValue: number;
    totalValue: number;
  } = {
    veryHotCount: 0,
    frozenCount: 0,
    totalCount: 0,
    veryHotValue: 0,
    totalValue: 0,
  };

  safeCounts.forEach((item) => {
    const qualifications = toArray(item.qualifications);

    qualifications.forEach((q) => {
      const value = Number(q.value ?? 0);

      if (q.key === 'Very hot') {
        result.veryHotCount += value;
      } else if (q.key === 'Frozen') {
        result.frozenCount += value;
      }

      if (q.key === 'Total') {
        result.totalCount += value;
      }
    });
  });

  safeValues.forEach((item) => {
    const qualifications = toArray(item.qualifications);

    qualifications.forEach((q) => {
      const numericValue = parseCurrencyBRLToNumber(q.value ?? 'R$ 0,00') ?? 0;

      if (q.key === 'Very hot') {
        result.veryHotValue += numericValue;
      }

      if (q.key === 'Total') {
        result.totalValue += numericValue;
      }
    });
  });

  return result;
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

export function calculateAverageTemperatureScore(
  questionnaires: QuestionnaireTemperature[]
): number {
  const safeQuestionnaires = toArray(questionnaires);

  if (!safeQuestionnaires.length) return 0;

  let totalScore = 0;
  let totalQuantity = 0;

  safeQuestionnaires.forEach((questionnaire) => {
    const temperatures = toArray(questionnaire.temperatures);

    temperatures.forEach((temperature) => {
      const quantity = temperature.quantity ?? 0;
      const rating = temperature.rating ?? 0;

      totalScore += quantity * rating;
      totalQuantity += quantity;
    });
  });

  if (!totalQuantity) return 0;

  return totalScore / totalQuantity;
}

export function calculatePreSalesRecoveryRate(
  metrics: PreSalesMetricsItem[]
): number {
  const safeMetrics = toArray(metrics);

  if (!safeMetrics.length) return 0;

  const totals = safeMetrics.reduce(
    (acc, curr) => {
      acc.recoveryRegistration += curr.recoveryRegistration ?? 0;
      acc.totalCalls += curr.totalCalls ?? 0;
      return acc;
    },
    { recoveryRegistration: 0, totalCalls: 0 }
  );

  if (!totals.totalCalls) return 0;

  return (totals.recoveryRegistration / totals.totalCalls) * 100;
}

export function calculateSellerPerformanceTotals(
  performance: SellersMetricsItem[]
) {
  const safePerformance = toArray(performance);

  return safePerformance.reduce(
    (acc, curr) => {
      acc.sales += curr.sales ?? 0;
      acc.sql += curr.sql ?? 0;
      acc.expectedMeetings += curr.expectedMeetings ?? 0;
      acc.completedMeetings += curr.completedMeetings ?? 0;
      return acc;
    },
    { sales: 0, sql: 0, expectedMeetings: 0, completedMeetings: 0 }
  );
}

export function calculateSalesActualValue(performance: SellerPerformanceItem[]) {
  const safePerformance = toArray(performance);

  return safePerformance.reduce((acc, seller) => {
    const monthlyValues = toArray(seller.monthlyValues);

    const totalSellerValue = monthlyValues.reduce((innerAcc, month) => {
      const [actualValue] = month.value.split('/').map((v) => v.trim());
      const parsedActual = parseCurrencyBRLToNumber(actualValue) ?? 0;
      return innerAcc + parsedActual;
    }, 0);

    return acc + totalSellerValue;
  }, 0);
}

export function averageTimeToSaleHours(averageTime: AverageTimeAggregate | null): number {
  if (!averageTime) {
    return 0;
  }
  return averageTimeInHours(averageTime.totalSale);
}


export function calculateSqlToSaleConversion(
  performance: SellersMetricsItem[]
): number {
  const safePerformance = toArray(performance);

  if (!safePerformance.length) return 0;

  const totals = safePerformance.reduce(
    (acc, curr) => {
      acc.sql += curr.sql ?? 0;
      acc.sales += curr.sales ?? 0;
      return acc;
    },
    { sql: 0, sales: 0 }
  );

  if (!totals.sql) return 0;

  return (totals.sales / totals.sql) * 100;
}
