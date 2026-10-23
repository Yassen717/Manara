import React from 'react';

export function Stat({
  value,
  label,
  hint,
  accent = false,
}: {
  value: React.ReactNode;
  label: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className={`card p-5 ${accent ? 'border-primary-200 bg-primary-50/40' : ''}`}>
      <div className="text-2xl font-bold tracking-tight text-ink-900">{value}</div>
      <div className="mt-1 text-sm font-medium text-ink-500">{label}</div>
      {hint ? <div className="mt-1 text-xs text-ink-400">{hint}</div> : null}
    </div>
  );
}
