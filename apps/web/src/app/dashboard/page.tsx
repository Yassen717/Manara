'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Spinner } from '@/components/ui';
import { DashboardHome } from '@/components/dashboard/DashboardHome';

export default function DashboardPage() {
  const router = useRouter();
  const { ready, token } = useAuth();

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, token, router]);

  if (!ready || !token) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  return <DashboardHome />;
}
