"use client";

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProfilePage } from '@/components/user/profile-page';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function UserProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
        <DashboardHeader />
        
        <main className="container mx-auto px-6 py-8">
          <ProfilePage />
        </main>
      </div>
    </ProtectedRoute>
  );
}