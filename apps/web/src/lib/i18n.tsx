'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Lang = 'en' | 'ar';

// Chrome-level dictionary (nav, footer, common UI). Page-specific text is
// inlined by page components via `lang === 'ar' ? '…' : '…'` or pick().
const dict = {
  'nav.services': { en: 'Services', ar: 'الخدمات' },
  'nav.requests': { en: 'Requests', ar: 'الطلبات' },
  'nav.documents': { en: 'Documents', ar: 'المستندات' },
  'nav.wallet': { en: 'Wallet', ar: 'المحفظة' },
  'nav.health': { en: 'Health', ar: 'الصحة' },
  'nav.education': { en: 'Education', ar: 'التعليم' },
  'nav.utilities': { en: 'Utilities', ar: 'المرافق' },
  'nav.status': { en: 'National Status', ar: 'حالة الخدمات' },
  'nav.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'nav.login': { en: 'Sign in', ar: 'تسجيل الدخول' },
  'nav.logout': { en: 'Sign out', ar: 'تسجيل الخروج' },
  'nav.getstarted': { en: 'Get started', ar: 'ابدأ الآن' },
  'brand.tagline': { en: 'Libya Digital Government', ar: 'حكومة ليبيا الرقمية' },
  'common.loading': { en: 'Loading…', ar: 'جارٍ التحميل…' },
  'common.viewAll': { en: 'View all', ar: 'عرض الكل' },
  'common.back': { en: 'Back', ar: 'رجوع' },
  'common.submit': { en: 'Submit', ar: 'إرسال' },
  'common.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'common.search': { en: 'Search', ar: 'بحث' },
  'common.lyd': { en: 'LYD', ar: 'د.ل' },
  'common.free': { en: 'Free', ar: 'مجاني' },
  'common.days': { en: 'days', ar: 'أيام' },
  'common.new': { en: 'New', ar: 'جديد' },
  'footer.rights': { en: 'Manara — a Government-as-a-Service concept platform for Libya', ar: 'منارة — منصة الحكومة كخدمة لدولة ليبيا' },
  'footer.services': { en: 'Services', ar: 'الخدمات' },
  'footer.platform': { en: 'Platform', ar: 'المنصة' },
  'footer.about': { en: 'About', ar: 'عن المنصة' },
  'footer.api': { en: 'API documentation', ar: 'وثائق الواجهة البرمجية' },
  'footer.status': { en: 'National service status', ar: 'حالة الخدمات الوطنية' },
} as const;

export type DictKey = keyof typeof dict;

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: DictKey) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  t: (k) => dict[k]?.en ?? k,
  isRtl: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('manara_lang') as Lang) ?? 'en';
    setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('manara_lang', l);
  }, []);

  const t = useCallback((k: DictKey) => dict[k]?.[lang] ?? String(k), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

// Helper for page-local bilingual strings
export function pick<T>(lang: Lang, en: T, ar: T): T {
  return lang === 'ar' ? ar : en;
}
