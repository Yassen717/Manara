'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useLanguage, pick } from '@/lib/i18n';
import type {
  AppNotification,
  Application,
  DigitalDocument,
  Entitlement,
  ServiceRequest,
  Transaction,
} from '@/lib/types';
import { SectionTitle } from '@/components/ui';
import { GreetingHeader } from './GreetingHeader';
import { StatsRow } from './StatsRow';
import { ProfileCard } from './ProfileCard';
import { RecentApplications } from './RecentApplications';
import { RecentRequests } from './RecentRequests';
import { EntitlementsPanel } from './EntitlementsPanel';
import { TransactionsPanel } from './TransactionsPanel';
import { NotificationsPanel } from './NotificationsPanel';
import { QuickActions } from './QuickActions';
import { DashboardSkeleton } from './DashboardSkeleton';

interface DashboardData {
  applications: Application[];
  requests: ServiceRequest[];
  documents: DigitalDocument[];
  entitlements: Entitlement[];
  transactions: Transaction[];
  notifications: AppNotification[];
}

const EMPTY: DashboardData = {
  applications: [],
  requests: [],
  documents: [],
  entitlements: [],
  transactions: [],
  notifications: [],
};

const OPEN_APP = new Set(['submitted', 'in_review']);
const OPEN_REQ = new Set(['received', 'dispatched', 'in_progress']);

export function DashboardHome() {
  const { lang } = useLanguage();
  const { token, citizen, refresh } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!token) return;
    let live = true;
    Promise.all([
      api.applications(token).catch(() => [] as Application[]),
      api.requests(token).catch(() => [] as ServiceRequest[]),
      api.documents(token).catch(() => [] as DigitalDocument[]),
      api.entitlements(token).catch(() => [] as Entitlement[]),
      api.transactions(token).catch(() => [] as Transaction[]),
      api.notifications(token).catch(() => [] as AppNotification[]),
    ]).then(([applications, requests, documents, entitlements, transactions, notifications]) => {
      if (live)
        setData({ applications, requests, documents, entitlements, transactions, notifications });
    });
    return () => {
      live = false;
    };
  }, [token]);

  if (!citizen) return null;

  const loading = data === null;
  const d = data ?? EMPTY;

  // citizen is available as soon as auth resolves — greet immediately and let
  // each panel render its own skeleton rows while the lists load.
  const onMarkedRead = (id: string) =>
    setData((prev) =>
      prev
        ? {
            ...prev,
            notifications: prev.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n,
            ),
          }
        : prev,
    );

  return (
    <div className="container-page space-y-8 py-10">
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <GreetingHeader citizen={citizen} />
          <StatsRow
            loading={false}
            openApplications={d.applications.filter((a) => OPEN_APP.has(a.status)).length}
            openRequests={d.requests.filter((r) => OPEN_REQ.has(r.status)).length}
            documents={d.documents.length}
            unreadNotifications={d.notifications.filter((n) => !n.read).length}
          />
          <ProfileCard citizen={citizen} onSaved={() => refresh()} />
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentApplications applications={d.applications} loading={loading} />
        <RecentRequests requests={d.requests} loading={loading} />
        <EntitlementsPanel entitlements={d.entitlements} loading={loading} />
        <TransactionsPanel transactions={d.transactions} loading={loading} />
        <NotificationsPanel
          notifications={d.notifications}
          loading={loading}
          onMarkedRead={onMarkedRead}
        />
      </div>

      <section>
        <SectionTitle title={pick(lang, 'Quick actions', 'إجراءات سريعة')} />
        <QuickActions />
      </section>
    </div>
  );
}
