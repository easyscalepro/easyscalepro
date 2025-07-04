"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { CommandForm } from '@/components/admin/command-form';

export default function EditCommandPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const commandId = params.id as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <CommandForm mode="edit" commandId={commandId} />
      </div>
    </AdminLayout>
  );
}