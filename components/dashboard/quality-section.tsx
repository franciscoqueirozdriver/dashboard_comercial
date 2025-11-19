'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '@/components/ui/card';
import type {
  CallFeedbackRequestItem,
  CallFeedbackSentItem,
  MeetingQualityItem,
  MeetingQualitySQLItem
} from '@/lib/spotter/types';

const palette = ['#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#c084fc'];

type QualitySectionProps = {
  callFeedbacks: CallFeedbackSentItem[];
  callFeedbackRequests: CallFeedbackRequestItem[];
  meetingQuality: MeetingQualityItem | null;
  meetingQualitySQL: MeetingQualitySQLItem | null;
};

export function QualitySection({
  callFeedbacks,
  callFeedbackRequests,
  meetingQuality,
  meetingQualitySQL
}: QualitySectionProps) {
  const safeCallFeedbacks = callFeedbacks ?? [];
  const safeCallFeedbackRequests = callFeedbackRequests ?? [];

  const averageByUser = useMemo(() => {
    const aggregates: Record<string, { total: number; count: number }> = {};
    safeCallFeedbacks.forEach((feedback) => {
      if (!aggregates[feedback.userName]) {
        aggregates[feedback.userName] = { total: 0, count: 0 };
      }
      aggregates[feedback.userName].total += feedback.points;
      aggregates[feedback.userName].count += 1;
    });
    return Object.entries(aggregates).map(([userName, data]) => ({
      userName,
      score: data.total / data.count
    }));
  }, [safeCallFeedbacks]);

  const criteriaDistribution = useMemo(() => {
    const result: Record<string, number> = {};
    safeCallFeedbacks.forEach((feedback) => {
      feedback.criteria.forEach((criterion) => {
        result[criterion.description] = (result[criterion.description] ?? 0) + criterion.starCount;
      });
    });
    return Object.entries(result).map(([criterion, value]) => ({ criterion, value }));
  }, [safeCallFeedbacks]);

  const meetingQualityData = useMemo(() => {
    return meetingQuality?.quantities ?? [];
  }, [meetingQuality]);

  const sqlDistribution = useMemo(() => {
    if (!meetingQualitySQL) {
      return [];
    }
    const approved = Math.max(meetingQualitySQL.sql - meetingQualitySQL.rejected, 0);
    return [
      { name: 'SQL aprovadas', value: approved },
      { name: 'Rejeitadas', value: meetingQualitySQL.rejected }
    ];
  }, [meetingQualitySQL]);

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <Card title="Feedback de chamadas" description="Notas médias e critérios avaliados.">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={averageByUser}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="userName" stroke="#94a3b8" />
              <YAxis domain={[0, 10]} stroke="#94a3b8" />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
              <Bar dataKey="score" fill="#34d399" name="Pontuação" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={criteriaDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="criterion" type="category" stroke="#94a3b8" width={120} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
              <Bar dataKey="value" fill="#60a5fa" name="Soma de estrelas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Qualidade das reuniões" description="Feedbacks por temperatura e status SQL.">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={meetingQualityData} dataKey="quantity" nameKey="qualification" innerRadius={60} outerRadius={100}>
                {meetingQualityData.map((entry, index) => (
                  <Cell key={entry.qualification} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sqlDistribution} dataKey="value" nameKey="name" outerRadius={100}>
                {sqlDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={['#22d3ee', '#f87171'][index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Pendências" description="Feedbacks de chamadas ainda aguardando resposta.">
        <ul className="space-y-4">
          {safeCallFeedbackRequests.map((request) => (
            <li key={request.id} className="rounded-xl border border-slate-800/60 p-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{request.lead}</span>
                <span>{new Date(request.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-white">{request.userName}</p>
              <p className="text-sm text-slate-400">
                {request.answered ? 'Feedback enviado' : 'Pendente de avaliação'}
              </p>
            </li>
          ))}
          {callFeedbackRequests.length === 0 && (
            <p className="text-sm text-slate-400">Nenhuma pendência registrada.</p>
          )}
        </ul>
      </Card>
    </section>
  );
}
