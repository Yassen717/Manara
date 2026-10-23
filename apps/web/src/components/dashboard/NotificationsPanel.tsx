'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useLanguage, pick } from '@/lib/i18n';
import { timeAgo } from '@/lib/format';
import type { AppNotification } from '@/lib/types';
import { Badge, Card, EmptyState } from '@/components/ui';
import { Panel, PanelSkeleton } from './Panel';
import { statusLabel } from './labels';

export function NotificationsPanel({
  notifications,
  loading,
  onMarkedRead,
}: {
  notifications: AppNotification[];
  loading: boolean;
  onMarkedRead: (id: string) => void;
}) {
  const { lang } = useLanguage();
  const { token } = useAuth();
  const [marking, setMarking] = useState<string | null>(null);

  const sorted = [...notifications].sort(
    (a, b) => Number(a.read) - Number(b.read) || Date.parse(b.at) - Date.parse(a.at),
  );
  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    if (!token || marking) return;
    setMarking(id);
    try {
      await api.markRead(id, token);
      onMarkedRead(id);
    } catch {
      /* leave unread */
    } finally {
      setMarking(null);
    }
  };

  return (
    <Panel
      title={pick(lang, 'Notifications', 'الإشعارات')}
      action={unread > 0 ? <Badge tone="gold">{unread} {pick(lang, 'unread', 'غير مقروءة')}</Badge> : undefined}
    >
      {loading ? (
        <PanelSkeleton />
      ) : sorted.length === 0 ? (
        <EmptyState
          title={pick(lang, 'No notifications', 'لا توجد إشعارات')}
          hint={pick(
            lang,
            'Updates about your services and requests appear here.',
            'تحديثات خدماتك وبلاغاتك تظهر هنا.',
          )}
        />
      ) : (
        <Card className="divide-y divide-ink-100">
          {sorted.slice(0, 5).map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between gap-3 px-5 py-4 ${
                n.read ? 'opacity-70' : ''
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    n.read ? 'bg-ink-200' : 'bg-primary-500'
                  }`}
                />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-800">
                    {pick(lang, n.title, n.titleAr)}
                    <Badge tone={n.kind === 'alert' ? 'red' : n.kind === 'warning' ? 'amber' : n.kind === 'success' ? 'green' : 'blue'}>
                      {statusLabel(lang, n.kind)}
                    </Badge>
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-500">
                    {pick(lang, n.body, n.bodyAr)}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-400">{timeAgo(n.at, lang)}</p>
                </div>
              </div>
              {!n.read ? (
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  disabled={marking === n.id}
                  className="link shrink-0 text-xs disabled:opacity-50"
                >
                  {pick(lang, 'Mark read', 'تحديد كمقروء')}
                </button>
              ) : null}
            </div>
          ))}
        </Card>
      )}
    </Panel>
  );
}
