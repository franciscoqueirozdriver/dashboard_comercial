import { NextResponse } from 'next/server';
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
  SellersProductionItem,
  SpotterAnalyticsDTO
} from '@/lib/spotter/types';

async function fetchFunnelActivity(): Promise<FunnelActivityItem[]> {
  return [
    {
      id: 1,
      name: 'Descoberta',
      conversionRate: 52,
      converted: 120,
      discarded: 30,
      questionnaire: 'Inbound',
      previousGate: null
    },
    {
      id: 2,
      name: 'Qualificação',
      conversionRate: 35,
      converted: 80,
      discarded: 22,
      questionnaire: 'Inbound',
      previousGate: 'Descoberta'
    }
  ];
}

async function fetchHarvest(): Promise<HarvestItem[]> {
  return [
    {
      id: 11,
      name: 'Contato Inicial',
      converted: 140,
      restarted: 12,
      conversionRate: 65,
      parked: 5,
      discarded: 10,
      total: 180,
      gateType: 'Call'
    },
    {
      id: 12,
      name: 'Reunião',
      converted: 80,
      restarted: 5,
      conversionRate: 45,
      parked: 8,
      discarded: 15,
      total: 150,
      gateType: 'Meeting'
    }
  ];
}

async function fetchSellerPerformance(): Promise<SellerPerformanceItem[]> {
  return [
    {
      id: 41,
      name: 'Carolina',
      monthlyValues: [
        { month: 'March/2025', value: 'R$ 14.000,00' },
        { month: 'April/2025', value: 'R$ 18.500,00' }
      ]
    }
  ];
}

async function fetchPreSalesPerformance(): Promise<PreSalesPerformanceItem[]> {
  return [
    {
      id: 31,
      name: 'Bruno',
      monthlyValues: [
        { month: 'March/2025', value: 'R$ 7.500,00' },
        { month: 'April/2025', value: 'R$ 9.000,00' }
      ]
    }
  ];
}

async function fetchPreSalesMetrics(): Promise<PreSalesMetricsItem[]> {
  return [
    {
      id: 51,
      userName: 'Bruno',
      answeredCalls: 210,
      totalCalls: 320,
      callDuration: 8500,
      scheduledMeetings: 65,
      rescheduledMeetings: 5,
      sales: 12,
      canceledMeetings: 4,
      expectedMeetings: 70,
      missedMeetings: 3,
      receivedFeedbacks: 15,
      pendingFeedbacks: 4,
      completedMeetings: 60,
      recoveryRegistration: 6
    },
    {
      id: 52,
      userName: 'Lívia',
      answeredCalls: 190,
      totalCalls: 300,
      callDuration: 9000,
      scheduledMeetings: 58,
      rescheduledMeetings: 6,
      sales: 11,
      canceledMeetings: 5,
      expectedMeetings: 62,
      missedMeetings: 4,
      receivedFeedbacks: 12,
      pendingFeedbacks: 5,
      completedMeetings: 55,
      recoveryRegistration: 8
    }
  ];
}

async function fetchSellersMetrics(): Promise<SellersMetricsItem[]> {
  return [
    {
      id: 61,
      userName: 'Carolina',
      callDuration: 6400,
      answeredCalls: 120,
      expectedMeetings: 48,
      scheduledMeetings: 45,
      completedMeetings: 40,
      rescheduledMeetings: 3,
      canceledMeetings: 2,
      missedMeetings: 1,
      receivedFeedbacks: 22,
      pendingFeedbacks: 2,
      sql: 32,
      sales: 18
    },
    {
      id: 62,
      userName: 'Igor',
      callDuration: 6800,
      answeredCalls: 110,
      expectedMeetings: 50,
      scheduledMeetings: 47,
      completedMeetings: 41,
      rescheduledMeetings: 4,
      canceledMeetings: 3,
      missedMeetings: 1,
      receivedFeedbacks: 18,
      pendingFeedbacks: 3,
      sql: 30,
      sales: 16
    }
  ];
}

async function fetchPreSalesProduction(): Promise<PreSalesProductionItem[]> {
  return [
    {
      id: 71,
      name: 'Bruno',
      steps: [
        { id: 1, value: 180 },
        { id: 2, value: 130 },
        { id: 3, value: 90 }
      ]
    },
    {
      id: 72,
      name: 'Lívia',
      steps: [
        { id: 1, value: 160 },
        { id: 2, value: 120 },
        { id: 3, value: 85 }
      ]
    }
  ];
}

async function fetchSellersProduction(): Promise<SellersProductionItem[]> {
  return [
    {
      id: 81,
      name: 'Carolina',
      steps: [
        { id: 1, value: 40 },
        { id: 2, value: 32 },
        { id: 3, value: 18 }
      ]
    },
    {
      id: 82,
      name: 'Igor',
      steps: [
        { id: 1, value: 38 },
        { id: 2, value: 30 },
        { id: 3, value: 16 }
      ]
    }
  ];
}

async function fetchCallFeedbacksSent(): Promise<CallFeedbackSentItem[]> {
  return [
    {
      id: 101,
      date: new Date().toISOString(),
      callHistoryId: 500,
      leadId: 700,
      lead: 'Acme',
      read: false,
      points: 8.2,
      resolved: false,
      userName: 'Bruno',
      authorFeedbackId: 2,
      criteria: [
        { id: 1, description: 'Apresentação', starCount: 4 },
        { id: 2, description: 'Diagnóstico', starCount: 4 }
      ]
    },
    {
      id: 102,
      date: new Date().toISOString(),
      callHistoryId: 501,
      leadId: 701,
      lead: 'Globex',
      read: true,
      points: 7.8,
      resolved: true,
      userName: 'Lívia',
      authorFeedbackId: 3,
      criteria: [
        { id: 1, description: 'Apresentação', starCount: 3 },
        { id: 2, description: 'Diagnóstico', starCount: 4 }
      ]
    }
  ];
}

async function fetchCallFeedbackRequests(): Promise<CallFeedbackRequestItem[]> {
  return [
    {
      id: 201,
      date: new Date().toISOString(),
      answered: false,
      lead: 'Umbrella',
      leadId: 801,
      userName: 'Bruno',
      callHistoryId: 601,
      callFeedbackId: null
    }
  ];
}

async function fetchMeetingQuality(): Promise<MeetingQualityItem> {
  return {
    totalMeetings: 180,
    pendingFeedbacks: 20,
    completedFeedbacks: 160,
    quantities: [
      { qualification: 'Congelada', quantity: 10, score: 1 },
      { qualification: 'Fria', quantity: 20, score: 2 },
      { qualification: 'Morna', quantity: 45, score: 3 },
      { qualification: 'Quente', quantity: 60, score: 4 },
      { qualification: 'Muito Quente', quantity: 45, score: 5 }
    ]
  };
}

async function fetchMeetingQualitySQL(): Promise<MeetingQualitySQLItem> {
  return {
    sql: 120,
    rejected: 22
  };
}

async function fetchMonthlyDealForecast(): Promise<MonthlyDealForecastItem[]> {
  return [
    {
      id: 301,
      userName: 'Carolina',
      monthlyForecasts: [
        { periodName: 'March/2025', forecastValue: 'R$ 120.000,00' },
        { periodName: 'April/2025', forecastValue: 'R$ 150.000,00' }
      ]
    },
    {
      id: 302,
      userName: 'Igor',
      monthlyForecasts: [
        { periodName: 'March/2025', forecastValue: 'R$ 110.000,00' },
        { periodName: 'April/2025', forecastValue: 'R$ 140.000,00' }
      ]
    }
  ];
}

async function fetchForecastQualificationCount(): Promise<BusinessForecastByQualificationCountItem[]> {
  return [
    {
      id: 401,
      name: 'Squad A',
      qualifications: [
        { key: 'Very hot', value: '8' },
        { key: 'Hot', value: '10' },
        { key: 'Frozen', value: '5' },
        { key: 'Total', value: '23' }
      ]
    }
  ];
}

async function fetchForecastQualificationValue(): Promise<BusinessForecastByQualificationValueItem[]> {
  return [
    {
      id: 501,
      name: 'Squad A',
      qualifications: [
        { key: 'Very hot', value: 'R$ 220.000,00' },
        { key: 'Hot', value: 'R$ 180.000,00' },
        { key: 'Frozen', value: 'R$ 80.000,00' },
        { key: 'Total', value: 'R$ 480.000,00' }
      ]
    }
  ];
}

async function fetchQuestionnaireTemperatures(): Promise<QuestionnaireTemperature[]> {
  return [
    {
      questionnaireId: 601,
      questionnaireName: 'Inbound Form',
      temperatures: [
        { qualification: 'Congelada', rating: 1, quantity: 15 },
        { qualification: 'Fria', rating: 2, quantity: 25 },
        { qualification: 'Morna', rating: 3, quantity: 40 },
        { qualification: 'Quente', rating: 4, quantity: 35 },
        { qualification: 'Muito Quente', rating: 5, quantity: 25 }
      ]
    },
    {
      questionnaireId: 602,
      questionnaireName: 'Outbound Form',
      temperatures: [
        { qualification: 'Congelada', rating: 1, quantity: 20 },
        { qualification: 'Fria', rating: 2, quantity: 30 },
        { qualification: 'Morna', rating: 3, quantity: 30 },
        { qualification: 'Quente', rating: 4, quantity: 20 },
        { qualification: 'Muito Quente', rating: 5, quantity: 10 }
      ]
    }
  ];
}

async function fetchAverageTime(): Promise<AverageTimeAggregate> {
  return {
    id: 701,
    totalCall: 5200,
    totalScheduling: 7800,
    totalActivity: 8900,
    totalSale: 12000,
    list: [
      { id: 1, name: 'Anúncio', call: 5000, scheduling: 7000, activity: 9000, sale: 12000 },
      { id: 2, name: 'Indicação', call: 3000, scheduling: 4000, activity: 5000, sale: 7000 },
      { id: 3, name: 'Prospecção', call: 6000, scheduling: 6500, activity: 8000, sale: 10000 }
    ]
  };
}

export async function GET() {
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
    fetchFunnelActivity(),
    fetchHarvest(),
    fetchSellerPerformance(),
    fetchPreSalesPerformance(),
    fetchPreSalesMetrics(),
    fetchSellersMetrics(),
    fetchPreSalesProduction(),
    fetchSellersProduction(),
    fetchCallFeedbacksSent(),
    fetchCallFeedbackRequests(),
    fetchMeetingQuality(),
    fetchMeetingQualitySQL(),
    fetchMonthlyDealForecast(),
    fetchForecastQualificationCount(),
    fetchForecastQualificationValue(),
    fetchQuestionnaireTemperatures(),
    fetchAverageTime()
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
}
