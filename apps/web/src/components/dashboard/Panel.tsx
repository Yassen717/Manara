import React from 'react';
import { Skeleton } from '@/components/ui';

// Compact section wrapper used for the dashboard's two-column panels.
export function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-ink-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// Skeleton rows matching the list rows inside a panel card.
export function PanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="card divide-y divide-ink-100">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2 h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
