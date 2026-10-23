'use client';

import React from 'react';

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="scroll-slim -mx-1 flex gap-1 overflow-x-auto rounded-2xl bg-ink-100/70 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
            active === t.id ? 'bg-white text-primary-800 shadow-card' : 'text-ink-500 hover:text-ink-800'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
