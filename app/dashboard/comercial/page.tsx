'use client';

import { Suspense } from 'react';
import { MasterDashboardPage } from '@/components/dashboard/master-dashboard-page';

export default function ComercialDashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-300">Carregando dashboard comercial...</div>}>
      <MasterDashboardPage />
    </Suspense>
  );
}
