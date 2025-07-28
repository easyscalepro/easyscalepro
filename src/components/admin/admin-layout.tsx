"use client";

import React, { useState } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Mobile Header */}
        <div className="bg-[#0F1115] text-white p-4 flex items-center justify-between sticky top-0 z-50">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};