'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

const links = [
  { href: '/services', key: 'nav.services' },
  { href: '/requests', key: 'nav.requests' },
  { href: '/documents', key: 'nav.documents' },
  { href: '/wallet', key: 'nav.wallet' },
  { href: '/health', key: 'nav.health' },
  { href: '/education', key: 'nav.education' },
  { href: '/utilities', key: 'nav.utilities' },
  { href: '/status', key: 'nav.status' },
] as const;

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="M12 3 4.5 20h15L12 3z" strokeLinejoin="round" />
          <path d="M12 3v17M7.5 14h9" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-base font-extrabold tracking-tight text-ink-900">Manara</span>
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary-700">
          منارة · Libya
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { token, citizen, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/80 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                pathname.startsWith(l.href)
                  ? 'bg-primary-50 text-primary-800'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              }`}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="btn-ghost !px-3 text-xs font-bold uppercase tracking-wide"
            aria-label="Switch language"
          >
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>

          {token ? (
            <>
              <Link href="/dashboard" className="btn-secondary hidden !px-4 sm:inline-flex">
                {citizen ? `${citizen.firstName} ${citizen.lastName}` : t('nav.dashboard')}
              </Link>
              <button onClick={logout} className="btn-ghost hidden !px-3 sm:inline-flex">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden !px-3 sm:inline-flex">
                {t('nav.login')}
              </Link>
              <Link href="/register" className="btn-primary !px-4">
                {t('nav.getstarted')}
              </Link>
            </>
          )}

          <button className="btn-ghost !p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              {open ? <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-ink-100 bg-white lg:hidden">
          <div className="container-page grid grid-cols-2 gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50"
              >
                {t(l.key)}
              </Link>
            ))}
            {token ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50">
                  {t('nav.dashboard')}
                </Link>
                <button onClick={() => { setOpen(false); logout(); }} className="rounded-lg px-3 py-2.5 text-start text-sm font-semibold text-ink-600 hover:bg-ink-50">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50">
                {t('nav.login')}
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
