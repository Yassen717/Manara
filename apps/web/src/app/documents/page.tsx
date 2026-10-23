'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, EmptyState, PageHeader, SectionTitle, SkeletonCard } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { api } from '@/lib/api';
import type { DigitalDocument } from '@/lib/types';
import { DocumentCard } from '@/components/docs/DocumentCard';
import { RequestDocumentModal } from '@/components/docs/RequestDocumentModal';

export default function DocumentsPage() {
  const { token, ready } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const [docs, setDocs] = useState<DigitalDocument[] | null>(null);
  const [freshId, setFreshId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, token, router]);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    api
      .documents(token)
      .then((d) => alive && setDocs(d))
      .catch(() => alive && setDocs([]));
    return () => {
      alive = false;
    };
  }, [token]);

  if (!ready || !token) {
    return (
      <div className="container-page py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const requestButton = (
    <Button onClick={() => setModalOpen(true)}>
      <Icon name="plus" className="h-4 w-4" />
      {pick(lang, 'Request a document', 'طلب مستند')}
    </Button>
  );

  return (
    <>
      <PageHeader
        title={pick(lang, 'Digital documents', 'المستندات الرقمية')}
        subtitle={pick(
          lang,
          'Verifiable e-documents issued to your national ID — each carries a scannable verification block.',
          'مستندات إلكترونية قابلة للتحقق صادرة على رقمك الوطني — يحمل كل منها رمز تحقق.',
        )}
      />
      <div className="container-page py-8">
        <SectionTitle
          title={pick(lang, 'Your documents', 'مستنداتك')}
          subtitle={
            docs
              ? pick(lang, `${docs.length} on record`, `${docs.length} في السجل`)
              : undefined
          }
          action={requestButton}
        />

        {docs === null ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <EmptyState
            title={pick(lang, 'No documents yet', 'لا مستندات بعد')}
            hint={pick(
              lang,
              'Request a certificate or renewal and it appears here the moment it is issued.',
              'اطلب شهادة أو تجديداً وسيظهر هنا فور صدوره.',
            )}
            action={requestButton}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((d) => (
              <DocumentCard key={d.id} doc={d} fresh={d.id === freshId} />
            ))}
          </div>
        )}
      </div>

      <RequestDocumentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onIssued={(doc) => {
          setDocs((prev) => [doc, ...(prev ?? [])]);
          setFreshId(doc.id);
        }}
      />
    </>
  );
}
