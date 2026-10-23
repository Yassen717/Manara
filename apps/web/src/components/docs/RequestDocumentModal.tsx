'use client';

import React, { useState } from 'react';
import { Button, FieldLabel, Modal, Select, Spinner } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { api } from '@/lib/api';
import type { DigitalDocument } from '@/lib/types';

const DOC_TYPES = [
  { value: 'birth_certificate', en: 'Birth certificate', ar: 'شهادة ميلاد' },
  { value: 'marriage_certificate', en: 'Marriage certificate', ar: 'شهادة زواج' },
  { value: 'death_certificate', en: 'Death certificate', ar: 'شهادة وفاة' },
  { value: 'criminal_record_renewal', en: 'Criminal record renewal', ar: 'تجديد صحيفة الحالة الجنائية' },
  { value: 'driving_license_renewal', en: 'Driving license renewal', ar: 'تجديد رخصة القيادة' },
  { value: 'national_id_replacement', en: 'National ID replacement', ar: 'إصدار بدل فاقد للبطاقة الشخصية' },
];

export function RequestDocumentModal({
  open,
  onClose,
  onIssued,
}: {
  open: boolean;
  onClose: () => void;
  onIssued: (doc: DigitalDocument) => void;
}) {
  const { lang } = useLanguage();
  const { token } = useAuth();
  const [type, setType] = useState(DOC_TYPES[0].value);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!token || busy) return;
    setBusy(true);
    setError('');
    try {
      const trimmed = note.trim();
      const doc = await api.requestDocument(type, trimmed ? { note: trimmed } : {}, token);
      onIssued(doc);
      setType(DOC_TYPES[0].value);
      setNote('');
      onClose();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : pick(lang, 'Request failed. Try again.', 'فشل الطلب. حاول مجدداً.'),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={pick(lang, 'Request a document', 'طلب مستند')}>
      <div className="space-y-4">
        <div>
          <FieldLabel>{pick(lang, 'Document type', 'نوع المستند')}</FieldLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            {DOC_TYPES.map((d) => (
              <option key={d.value} value={d.value}>
                {pick(lang, d.en, d.ar)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel hint={pick(lang, 'optional', 'اختياري')}>
            {pick(lang, 'Details', 'تفاصيل')}
          </FieldLabel>
          <textarea
            className="input"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={pick(
              lang,
              'Anything the civil registry should know…',
              'أي ملاحظات يجب أن يعرفها السجل المدني…',
            )}
          />
        </div>
        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {pick(lang, 'Cancel', 'إلغاء')}
          </Button>
          <Button onClick={submit} disabled={busy || !token}>
            {busy ? <Spinner className="h-4 w-4 !text-white" /> : null}
            {pick(lang, 'Submit request', 'إرسال الطلب')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
