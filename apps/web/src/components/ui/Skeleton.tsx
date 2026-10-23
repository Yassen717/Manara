import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-ink-100 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-5">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="mt-3 h-4 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  );
}
