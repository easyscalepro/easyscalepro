"use client";

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { FavoritesPage } from '@/components/user/favorites-page';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function UserFavoritesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        <main className="container mx-auto px-6 py-8">
          <FavoritesPage />
        </main>
      </div>
    </ProtectedRoute>
  );
}