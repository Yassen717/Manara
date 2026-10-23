import React from 'react';

// Decorative pseudo-QR: a deterministic grid of dark squares generated from a
// seed string (document id + qrPayload) so every e-document looks verifiable.
const N = 9;
const FINDERS: [number, number][] = [
  [0, 0],
  [N - 3, 0],
  [0, N - 3],
];

const inFinder = (x: number, y: number) =>
  FINDERS.some(([fx, fy]) => x >= fx && x < fx + 3 && y >= fy && y < fy + 3);

function cellOn(seed: string, x: number, y: number): boolean {
  let h = 2166136261;
  const s = `${seed}|${x}:${y}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 5 < 2;
}

export function FakeQr({ seed, className = '' }: { seed: string; className?: string }) {
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!inFinder(x, y) && cellOn(seed, x, y)) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />);
      }
    }
  }
  return (
    <svg viewBox={`-0.5 -0.5 ${N + 1} ${N + 1}`} className={className} aria-hidden>
      <rect x={-0.5} y={-0.5} width={N + 1} height={N + 1} rx={0.8} fill="#fff" />
      {cells}
      {FINDERS.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <rect x={fx} y={fy} width={3} height={3} rx={0.5} fill="currentColor" />
          <rect x={fx + 1} y={fy + 1} width={1} height={1} fill="#fff" />
        </g>
      ))}
    </svg>
  );
}
