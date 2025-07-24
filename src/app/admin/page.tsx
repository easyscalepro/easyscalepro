"use client";

import React from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { RecentActivity } from '@/components/admin/recent-activity';
import { UsageChart } from '@/components/admin/usage-chart';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0F1115] mb-2">
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600">
              Visão geral da plataforma EasyScale
            </p>
          </div>

          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UsageChart />
            <RecentActivity />
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}