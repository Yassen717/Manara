'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import type { CitizenProfile } from '@/lib/types';
import { Button, FieldLabel, Input, Modal, Spinner } from '@/components/ui';
import { ErrorBanner } from '@/components/auth/ErrorBanner';

export function EditProfileModal({
  open,
  onClose,
  citizen,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  citizen: CitizenProfile;
  onSaved: (c: CitizenProfile) => void;
}) {
  const { lang } = useLanguage();
  const { token } = useAuth();
  const [phone, setPhone] = useState(citizen.phone);
  const [email, setEmail] = useState(citizen.email ?? '');
  const [address, setAddress] = useState(citizen.address);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setPhone(citizen.phone);
      setEmail(citizen.email ?? '');
      setAddress(citizen.address);
      setError(null);
    }
  }, [open, citizen]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await api.updateProfile(token, {
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : pick(lang, 'Could not save changes.', 'تعذر حفظ التعديلات.'),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={pick(lang, 'Edit profile', 'تعديل الملف الشخصي')}>
      <form onSubmit={save} className="space-y-4">
        <ErrorBanner message={error} />
        <div>
          <FieldLabel>{pick(lang, 'Phone number', 'رقم الهاتف')}</FieldLabel>
          <Input dir="ltr" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <FieldLabel hint={pick(lang, 'optional', 'اختياري')}>
            {pick(lang, 'Email', 'البريد الإلكتروني')}
          </FieldLabel>
          <Input
            dir="ltr"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>{pick(lang, 'Address', 'العنوان')}</FieldLabel>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            {pick(lang, 'Cancel', 'إلغاء')}
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? <Spinner className="!text-white" /> : null}
            {pick(lang, 'Save changes', 'حفظ التعديلات')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
