import type { PropsWithChildren, ReactNode } from 'react';

export type CardProps = PropsWithChildren<{
  title?: ReactNode;
  description?: ReactNode;
}>;

export function Card({ title, description, children }: CardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
      {(title || description) && (
        <header className="mb-4">
          {typeof title === 'string' ? (
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          ) : (
            title
          )}
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </header>
      )}
      <div className="space-y-4 text-slate-200">{children}</div>
    </div>
  );
}
