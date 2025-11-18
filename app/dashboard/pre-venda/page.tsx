'use client';

import { Suspense } from 'react';
import { PreSalesDashboardPage } from '@/components/dashboard/pre-sales-dashboard-page';

export default function PreVendasDashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-300">Carregando painel de pré-venda...</div>}>
      <PreSalesDashboardPage />
    </Suspense>
  );
}
