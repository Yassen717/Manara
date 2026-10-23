'use client';

import React, { useEffect, useRef } from 'react';

// 6-digit one-time-code input rendered as individual boxes. Value is a
// contiguous digit string controlled by the parent.
export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  disabled?: boolean;
  length?: number;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const idx = Math.min(value.length, length - 1);
    refs.current[idx]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const insert = (i: number, digits: string) => {
    const next = (value.slice(0, i) + digits + value.slice(i + digits.length)).slice(0, length);
    onChange(next);
    if (next.length === length) {
      onComplete?.(next);
    } else {
      refs.current[Math.min(i + digits.length, length - 1)]?.focus();
    }
  };

  const handleChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) {
      onChange(value.slice(0, i) + value.slice(i + 1));
      return;
    }
    // Typing over a filled box: keep only the last typed digit.
    insert(i, value[i] && digits.length > 1 ? digits.slice(-1) : digits);
  };

  const handleKeyDown = (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      e.preventDefault();
      onChange(value.slice(0, i - 1) + value.slice(i));
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      e.preventDefault();
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!digits) return;
    onChange(digits);
    if (digits.length === length) onComplete?.(digits);
    else refs.current[digits.length]?.focus();
  };

  return (
    <div dir="ltr" className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={value[i] ?? ''}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste}
          aria-label={`Digit ${i + 1}`}
          className="h-12 w-10 rounded-xl border border-ink-200 bg-white text-center text-lg font-bold text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 disabled:opacity-50 sm:h-14 sm:w-12"
        />
      ))}
    </div>
  );
}
