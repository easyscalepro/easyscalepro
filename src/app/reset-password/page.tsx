import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

function ResetPasswordFormWrapper() {
  return <ResetPasswordForm />;
}

function ResetPasswordLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md shadow-2xl border-0 bg-white dark:bg-gray-800 rounded-lg">
        <div className="text-center space-y-4 p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <ResetPasswordFormWrapper />
    </Suspense>
  );
}