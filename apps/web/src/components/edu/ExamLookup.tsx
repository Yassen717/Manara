'use client';

import React, { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useLanguage, pick } from '@/lib/i18n';
import type { ExamResult } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Icon } from '@/components/ui/icons';

export function ExamLookup() {
  const { lang } = useLanguage();
  const [seat, setSeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    const s = seat.trim();
    if (!s) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setError('');
    try {
      setResult(await api.examResult(s));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        setError(
          pick(
            lang,
            'Lookup failed — the results service may be unreachable. Try again.',
            'فشل الاستعلام — قد تكون خدمة النتائج غير متاحة. حاول مرة أخرى.',
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const pct = result ? Math.round((result.totalScore / result.maxScore) * 100) : 0;

  return (
    <div>
      <form onSubmit={lookup} className="flex max-w-md gap-2">
        <Input
          value={seat}
          onChange={(e) => setSeat(e.target.value)}
          placeholder={pick(lang, 'Seat number — e.g. 2026-1001', 'رقم القعد — مثل 2026-1001')}
          dir="ltr"
          className="font-mono"
          aria-label={pick(lang, 'Seat number', 'رقم القعد')}
        />
        <Button type="submit" disabled={loading || !seat.trim()}>
          {loading ? <Spinner className="h-4 w-4 text-white" /> : <Icon name="search" className="h-4 w-4" />}
          {pick(lang, 'Look up', 'استعلام')}
        </Button>
      </form>
      <p className="mt-2 text-xs text-ink-400">
        {pick(
          lang,
          'No sign-in needed — results are public by seat number. Demo seats: 2026-1001 to 2026-1004.',
          'لا حاجة لتسجيل الدخول — النتائج عامة برقم القعد. أرقام تجريبية: 2026-1001 إلى 2026-1004.',
        )}
      </p>

      {notFound ? (
        <div className="mt-5">
          <EmptyState
            title={pick(lang, 'No result found', 'لم يتم العثور على نتيجة')}
            hint={pick(
              lang,
              'Check the seat number exactly as printed on the exam card.',
              'تأكد من رقم القعد كما هو مطبوع على بطاقة الامتحان.',
            )}
          />
        </div>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="card mt-5 overflow-hidden">
          <div
            className={`px-5 py-4 text-center text-lg font-extrabold tracking-wide text-white ${
              result.passed ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {result.passed
              ? pick(lang, 'PASSED', 'ناجح')
              : pick(lang, 'FAILED', 'راسب')}
          </div>
          <div className="p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-ink-900">
                  {pick(lang, result.name, result.nameAr)}
                </p>
                <p className="text-sm text-ink-500">{pick(lang, result.nameAr, result.name)}</p>
                <p className="mt-1 text-sm text-ink-600">
                  <span className="font-mono" dir="ltr">
                    {result.seat}
                  </span>{' '}
                  · {result.year} · {result.term} · {result.stream}
                </p>
              </div>
              <div className="text-end">
                <p className="text-3xl font-extrabold text-ink-900">{pct}%</p>
                <p className="text-xs font-semibold text-ink-500">
                  {result.totalScore} / {result.maxScore}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {result.subjects.map((s) => {
                const w = Math.round((s.score / s.max) * 100);
                return (
                  <div key={s.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink-700">{s.name}</span>
                      <span className="font-mono text-xs text-ink-500" dir="ltr">
                        {s.score}/{s.max}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                      <div
                        className={`h-full rounded-full ${
                          w >= 50 ? 'bg-primary-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
