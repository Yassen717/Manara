import { Certificate, ExamResult, Scholarship } from '../../common/types';
import { DEMO_CITIZEN, daysAgo } from '../../data/seed';

// Mock education data: e-certificates, secondary exam results lookup, and
// scholarship tracking. Mirrors real pain points — scholarship students
// abroad going 7+ months without stipends. Swap for a real Ministry of
// Education provider API later.

// Stored records carry the owning citizen's NIN internally; services strip
// it before returning data to callers.
export interface StoredCertificate extends Certificate {
  nin: string;
}

export interface StoredScholarship extends Scholarship {
  nin: string;
}

export const CERTIFICATES: StoredCertificate[] = [
  {
    id: 'cert_001',
    nin: DEMO_CITIZEN.nin,
    type: 'secondary',
    title: 'General Secondary Certificate',
    titleAr: 'شهادة إتمام مرحلة التعليم الثانوي',
    institution: 'Ministry of Education — Libya',
    issuedAt: '2006-07-15T00:00:00Z',
    reference: 'GSC-2006-184512',
    grade: 'Very Good',
  },
  {
    id: 'cert_002',
    nin: DEMO_CITIZEN.nin,
    type: 'bachelor',
    title: 'BSc Computer Engineering',
    titleAr: 'بكالوريوس هندسة الحاسوب',
    institution: 'University of Tripoli',
    issuedAt: '2010-06-30T00:00:00Z',
    reference: 'UOT-ENG-2010-003421',
    grade: 'Second Class Upper',
  },
  {
    id: 'cert_003',
    nin: DEMO_CITIZEN.nin,
    type: 'vocational',
    title: 'CCNA Routing & Switching',
    titleAr: 'شهادة سيسكو للتوجيه والتبديل',
    institution: 'Cisco Networking Academy',
    issuedAt: '2012-03-01T00:00:00Z',
    reference: 'CSCO-CCNA-2012-088417',
  },
  {
    id: 'cert_004',
    nin: DEMO_CITIZEN.nin,
    type: 'master',
    title: 'MSc Information Systems',
    titleAr: 'ماجستير نظم المعلومات',
    institution: 'University of Malaya',
    issuedAt: '2025-06-30T00:00:00Z',
    reference: 'UM-IS-2025-000219',
  },
];

function subjects(scores: number[]): { name: string; score: number; max: number }[] {
  const names = ['Arabic', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
  return names.map((name, i) => ({ name, score: scores[i], max: 100 }));
}

function result(
  seat: string,
  name: string,
  nameAr: string,
  term: string,
  passed: boolean,
  scores: number[],
): ExamResult {
  const subs = subjects(scores);
  return {
    seat,
    name,
    nameAr,
    year: 2026,
    term,
    stream: 'Scientific',
    passed,
    totalScore: subs.reduce((sum, s) => sum + s.score, 0),
    maxScore: subs.reduce((sum, s) => sum + s.max, 0),
    subjects: subs,
  };
}

export const EXAM_RESULTS: ExamResult[] = [
  result('2026-1001', 'Mohamed Ali Al-Farsi', 'محمد علي الفارسي', 'First Round', true, [85, 78, 92, 81, 88, 76]),
  result('2026-1002', 'Sara Khalifa Ibrahim', 'سارة خليفة إبراهيم', 'First Round', true, [92, 88, 95, 90, 91, 89]),
  result('2026-1003', 'Youssef Abdulrahman Al-Zentani', 'يوسف عبدالرحمن الزنتاني', 'First Round', false, [55, 61, 38, 47, 52, 40]),
  result('2026-1004', 'Fatima Omar Al-Warfalli', 'فاطمة عمر الورفلي', 'First Round', false, [64, 58, 45, 33, 49, 57]),
];

// Scholarship stipend stalled ~7 months ago — the documented failure mode
// where students abroad go unpaid while ministries pass the file around.
export const SCHOLARSHIPS: StoredScholarship[] = [
  {
    id: 'sch_001',
    nin: DEMO_CITIZEN.nin,
    country: 'Malaysia',
    university: 'University of Malaya',
    program: 'MSc Information Systems',
    degree: 'Master',
    stipendAmount: 650,
    currency: 'USD',
    status: 'active',
    lastPaymentAt: daysAgo(215),
    nextPaymentAt: daysAgo(185),
  },
];
