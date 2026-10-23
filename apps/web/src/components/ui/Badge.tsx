import React from 'react';
import { statusTone } from '@/lib/format';

type Tone = 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'gold';

const tones: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  blue: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  gray: 'bg-ink-50 text-ink-600 ring-1 ring-ink-200',
  gold: 'bg-gold-300/30 text-gold-700 ring-1 ring-gold-400/50',
};

const dots: Record<Tone, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-sky-500',
  gray: 'bg-ink-400',
  gold: 'bg-gold-500',
};

export function Badge({ tone = 'gray', children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`chip ${tones[tone]}`}>{children}</span>;
}

export function StatusPill({ status, label }: { status: string; label?: string }) {
  const tone = statusTone(status);
  return (
    <span className={`chip ${tones[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />
      {label ?? status.replace(/_/g, ' ')}
    </span>
  );
}
