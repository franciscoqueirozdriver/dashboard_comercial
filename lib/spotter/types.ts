export type FunnelActivityItem = {
  converted: number | null;
  discarded: number | null;
  conversionRate: number | null;
  name: string;
  questionnaire: string | null;
  previousGate: string | null;
  id: number;
};

export type HarvestItem = {
  name: string;
  converted: number | null;
  restarted: number | null;
  conversionRate: number | null;
  parked: number | null;
  discarded: number | null;
  total: number;
  gateType: string | null;
  id: number;
};

export type SellerPerformanceMonthlyValue = {
  month: string;
  value: string;
};

export type SellerPerformanceItem = {
  name: string;
  id: number;
  monthlyValues: SellerPerformanceMonthlyValue[];
};

export type PreSalesPerformanceMonthlyValue = {
  month: string;
  value: string;
};

export type PreSalesPerformanceItem = {
  name: string;
  id: number;
  monthlyValues: PreSalesPerformanceMonthlyValue[];
};

export type PreSalesMetricsItem = {
  userName: string;
  answeredCalls: number;
  totalCalls: number;
  callDuration: number;
  scheduledMeetings: number;
  rescheduledMeetings: number;
  sales: number;
  canceledMeetings: number;
  expectedMeetings: number;
  missedMeetings: number;
  receivedFeedbacks: number;
  pendingFeedbacks: number;
  completedMeetings: number;
  recoveryRegistration: number;
  id: number;
};

export type SellersMetricsItem = {
  userName: string;
  callDuration: number;
  answeredCalls: number;
  expectedMeetings: number;
  scheduledMeetings: number;
  completedMeetings: number;
  rescheduledMeetings: number;
  canceledMeetings: number;
  missedMeetings: number;
  receivedFeedbacks: number;
  pendingFeedbacks: number;
  sql: number;
  sales: number;
  id: number;
};

export type ProductionStep = {
  id: number;
  value: number;
};

export type PreSalesProductionItem = {
  name: string;
  id: number;
  steps: ProductionStep[];
};

export type SellersProductionItem = {
  name: string;
  id: number;
  steps: ProductionStep[];
};

export type CallFeedbackCriterion = {
  id: number;
  starCount: number;
  description: string;
};

export type CallFeedbackSentItem = {
  date: string;
  callHistoryId: number;
  leadId: number;
  lead: string;
  read: boolean;
  points: number;
  resolved: boolean;
  userName: string;
  authorFeedbackId: number;
  id: number;
  criteria: CallFeedbackCriterion[];
};

export type CallFeedbackRequestItem = {
  date: string;
  answered: boolean;
  lead: string;
  leadId: number;
  userName: string;
  callHistoryId: number;
  callFeedbackId: number | null;
  id: number;
};

export type MeetingQualityQuantity = {
  qualification: string;
  quantity: number;
  score: number;
};

export type MeetingQualityItem = {
  totalMeetings: number;
  pendingFeedbacks: number;
  completedFeedbacks: number;
  quantities: MeetingQualityQuantity[];
};

export type MeetingQualitySQLItem = {
  sql: number;
  rejected: number;
};

export type MonthlyDealForecastItem = {
  userName: string;
  id: number;
  monthlyForecasts: {
    periodName: string;
    forecastValue: string;
  }[];
};

export type ForecastQualificationCount = {
  key: string;
  value: string;
};

export type BusinessForecastByQualificationCountItem = {
  name: string;
  id: number;
  qualifications: ForecastQualificationCount[];
};

export type ForecastQualificationValue = {
  key: string;
  value: string;
};

export type BusinessForecastByQualificationValueItem = {
  name: string;
  id: number;
  qualifications: ForecastQualificationValue[];
};

export type TemperatureItem = {
  qualification: string;
  rating: number;
  quantity: number;
};

export type QuestionnaireTemperature = {
  questionnaireId: number;
  questionnaireName: string;
  temperatures: TemperatureItem[];
};

export type AverageTimeByOrigin = {
  name: string;
  call: number | null;
  scheduling: number | null;
  activity: number | null;
  sale: number | null;
  id: number;
};

export type AverageTimeAggregate = {
  totalCall: number;
  totalScheduling: number;
  totalActivity: number;
  totalSale: number;
  id: number;
  list: AverageTimeByOrigin[];
};

export type SpotterAnalyticsDTO = {
  funnelActivity: FunnelActivityItem[];
  harvest: HarvestItem[];
  sellerPerformance: SellerPerformanceItem[];
  preSalesPerformance: PreSalesPerformanceItem[];
  preSalesMetrics: PreSalesMetricsItem[];
  sellersMetrics: SellersMetricsItem[];
  preSalesProduction: PreSalesProductionItem[];
  sellersProduction: SellersProductionItem[];
  callFeedbacksSent: CallFeedbackSentItem[];
  callFeedbackRequests: CallFeedbackRequestItem[];
  meetingQuality: MeetingQualityItem | null;
  meetingQualitySQL: MeetingQualitySQLItem | null;
  monthlyDealForecast: MonthlyDealForecastItem[];
  businessForecastByQualificationCount: BusinessForecastByQualificationCountItem[];
  businessForecastByQualificationValue: BusinessForecastByQualificationValueItem[];
  questionnaireTemperatures: QuestionnaireTemperature[];
  averageTime: AverageTimeAggregate | null;
};
