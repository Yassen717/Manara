import React from 'react';

export function Card({
  className = '',
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={`card ${hover ? 'transition hover:-translate-y-0.5 hover:shadow-lift' : ''} ${className}`}
      {...props}
    />
  );
}
