'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-auto border-t border-ink-100 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-ink-900">Manara <span className="text-primary-700">منارة</span></p>
          <p className="mt-2 max-w-xs text-sm text-ink-500">{t('footer.rights')}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-ink-800">{t('footer.services')}</p>
          <ul className="space-y-2 text-sm text-ink-500">
            <li><Link className="hover:text-primary-700" href="/services">{t('nav.services')}</Link></li>
            <li><Link className="hover:text-primary-700" href="/documents">{t('nav.documents')}</Link></li>
            <li><Link className="hover:text-primary-700" href="/requests">{t('nav.requests')}</Link></li>
            <li><Link className="hover:text-primary-700" href="/wallet">{t('nav.wallet')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-ink-800">{t('footer.platform')}</p>
          <ul className="space-y-2 text-sm text-ink-500">
            <li><Link className="hover:text-primary-700" href="/about">{t('footer.about')}</Link></li>
            <li><Link className="hover:text-primary-700" href="/status">{t('footer.status')}</Link></li>
            <li><a className="hover:text-primary-700" href="http://localhost:24020/api/docs" target="_blank" rel="noreferrer">{t('footer.api')}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100 py-4 text-center text-xs text-ink-400">
        Manara · Libya GaaS concept · {new Date().getFullYear()}
      </div>
    </footer>
  );
}
