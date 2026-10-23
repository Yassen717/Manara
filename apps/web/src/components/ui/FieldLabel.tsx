import React from 'react';

export function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <label className="mb-1.5 block">
      <span className="text-sm font-semibold text-ink-800">{children}</span>
      {hint ? <span className="ms-1 text-xs font-normal text-ink-400">({hint})</span> : null}
    </label>
  );
}
