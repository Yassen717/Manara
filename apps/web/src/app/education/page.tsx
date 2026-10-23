'use client';

import React from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { PageHeader, SectionTitle } from '@/components/ui/Typography';
import { CertificateGrid } from '@/components/edu/CertificateGrid';
import { ExamLookup } from '@/components/edu/ExamLookup';
import { ScholarshipCard } from '@/components/edu/ScholarshipCard';

export default function EducationPage() {
  const { lang } = useLanguage();

  return (
    <div>
      <PageHeader
        title={pick(lang, 'Education services', 'الخدمات التعليمية')}
        subtitle={pick(
          lang,
          'Certificates that can be re-issued anywhere, public exam results, and scholarship stipends tracked end-to-end.',
          'شهادات يمكن إعادة إصدارها من أي مكان، ونتائج امتحانات عامة، ومنح دراسية تُتبع مدفوعاتها من البداية للنهاية.',
        )}
      />
      <div className="container-page space-y-12 py-8">
        <section>
          <SectionTitle
            title={pick(lang, 'My certificates', 'شهاداتي')}
            subtitle={pick(
              lang,
              'Verifiable e-certificates tied to your identity — immune to loss, fire, or flood.',
              'شهادات إلكترونية موثقة مرتبطة بهويتك — محصّنة ضد الفقدان أو الحريق أو الفيضان.',
            )}
          />
          <CertificateGrid />
        </section>

        <section>
          <SectionTitle
            title={pick(lang, 'Exam results lookup', 'الاستعلام عن نتائج الامتحانات')}
            subtitle={pick(
              lang,
              'Public by seat number — no queuing at school gates for printed lists.',
              'عامة برقم القعد — بلا طوابير أمام بوابات المدارس لقوائم مطبوعة.',
            )}
          />
          <ExamLookup />
        </section>

        <section>
          <SectionTitle
            title={pick(lang, 'Scholarship abroad', 'المنحة الدراسية بالخارج')}
            subtitle={pick(
              lang,
              'Stipend payments tracked automatically — delays are visible, not whispered about.',
              'مدفوعات المنحة تُتبع تلقائيًا — التأخيرات ظاهرة للجميع لا همسًا في المكاتب.',
            )}
          />
          <ScholarshipCard />
        </section>
      </div>
    </div>
  );
}
