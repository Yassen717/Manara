import React from 'react';
import { Skeleton } from '@/components/ui';
import { PanelSkeleton } from './Panel';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-3 h-4 w-52" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="card p-5">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </div>
        ))}
      </div>
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="flex-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </div>
        <Skeleton className="mt-6 h-px w-full" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <PanelSkeleton />
        <PanelSkeleton />
        <PanelSkeleton />
        <PanelSkeleton />
      </div>
    </div>
  );
}
