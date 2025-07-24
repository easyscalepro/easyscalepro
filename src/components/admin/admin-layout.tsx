"use client";

import React from 'react';
import { AdminSidebar } from './admin-sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-auto relative">
        <div className="min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
};