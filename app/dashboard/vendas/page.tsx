'use client';

import { Suspense } from 'react';
import { SalesDashboardPage } from '@/components/dashboard/sales-dashboard-page';

export default function VendasDashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-300">Carregando painel de vendas...</div>}>
      <SalesDashboardPage />
    </Suspense>
  );
}
