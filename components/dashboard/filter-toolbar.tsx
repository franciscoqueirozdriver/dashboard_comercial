'use client';

import { useCallback } from 'react';
import type { DashboardFilters } from './use-spotter-analytics';

type FilterToolbarProps = {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
  collaboratorOptions?: string[];
  originOptions?: string[];
  questionnaireOptions?: { id: number; name: string }[];
  showQuestionnaire?: boolean;
};

export function FilterToolbar({
  filters,
  onChange,
  collaboratorOptions = [],
  originOptions = [],
  questionnaireOptions = [],
  showQuestionnaire = true
}: FilterToolbarProps) {
  const handleChange = useCallback(
    (next: Partial<DashboardFilters>) => {
      onChange({ ...filters, ...next });
    },
    [filters, onChange]
  );

  const uniqueCollaborators = [...new Set(collaboratorOptions)].sort();
  const uniqueOrigins = [...new Set(originOptions)].sort();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">Início</span>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            value={filters.startDate}
            onChange={(event) => handleChange({ startDate: event.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">Fim</span>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            value={filters.endDate}
            onChange={(event) => handleChange({ endDate: event.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">Colaborador</span>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            value={filters.collaborator ?? 'all'}
            onChange={(event) =>
              handleChange({ collaborator: event.target.value === 'all' ? undefined : event.target.value })
            }
          >
            <option value="all">Todos</option>
            {uniqueCollaborators.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">Origem</span>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            value={filters.origin ?? 'all'}
            onChange={(event) =>
              handleChange({ origin: event.target.value === 'all' ? undefined : event.target.value })
            }
          >
            <option value="all">Todas</option>
            {uniqueOrigins.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        {showQuestionnaire && (
          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wide text-slate-400">Questionário</span>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              value={filters.questionnaireId ?? 'all'}
              onChange={(event) =>
                handleChange({
                  questionnaireId: event.target.value === 'all' ? undefined : event.target.value
                })
              }
            >
              <option value="all">Todos</option>
              {questionnaireOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </section>
  );
}
