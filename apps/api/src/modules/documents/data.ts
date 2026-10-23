import { DigitalDocument } from '../../common/types';
import { DEMO_CITIZEN } from '../../data/seed';

// In-memory per-citizen document wallet (nin -> DigitalDocument[]).
// The demo citizen is seeded; other citizens start empty and accumulate
// documents they request through POST /documents/request.

// Arabic labels for document types that can be requested or seeded.
export const DOCUMENT_TYPE_AR: Record<string, string> = {
  national_id: 'بطاقة الرقم الوطني',
  birth_certificate: 'شهادة ميلاد',
  marriage_certificate: 'شهادة زواج',
  death_certificate: 'شهادة وفاة',
  family_record: 'مستخرج القيد العائلي',
  passport: 'جواز سفر',
  drivers_license: 'رخصة قيادة',
  criminal_record: 'صحيفة الحالة الجنائية',
};

// Document references: DOC-XXXXX, incrementing. Seed uses 00101–00105.
let refSeq = 106;
export function nextDocumentReference(): string {
  return `DOC-${String(refSeq++).padStart(5, '0')}`;
}

export const DOCUMENTS_BY_NIN = new Map<string, DigitalDocument[]>([
  [
    DEMO_CITIZEN.nin,
    [
      {
        id: 'doc_00101',
        type: 'national_id',
        typeAr: DOCUMENT_TYPE_AR.national_id,
        reference: 'DOC-00101',
        issuedAt: '2024-03-11T10:00:00Z',
        expiresAt: '2034-03-11T10:00:00Z',
        holderName: 'Ahmed Al-Mansouri',
        status: 'active',
        qrPayload: 'MNR-VERIFY:DOC-00101:119880123456',
        data: {
          nin: '119880123456',
          dateOfBirth: '1988-04-15',
          gender: 'male',
          municipality: 'Tripoli',
          issuingOffice: 'Tripoli Civil Registry — Hay Al-Andalus',
        },
      },
      {
        id: 'doc_00102',
        type: 'birth_certificate',
        typeAr: DOCUMENT_TYPE_AR.birth_certificate,
        reference: 'DOC-00102',
        issuedAt: '2024-06-02T09:30:00Z',
        holderName: 'Ahmed Al-Mansouri',
        status: 'active',
        qrPayload: 'MNR-VERIFY:DOC-00102:119880123456',
        data: {
          nin: '119880123456',
          registryEntry: 'TRP-1988-01452',
          dateOfBirth: '1988-04-15',
          placeOfBirth: 'Tripoli',
          registrar: 'Tripoli Center Civil Registry',
        },
      },
      {
        id: 'doc_00103',
        type: 'passport',
        typeAr: DOCUMENT_TYPE_AR.passport,
        reference: 'DOC-00103',
        issuedAt: '2023-09-15T11:15:00Z',
        expiresAt: '2031-09-15T11:15:00Z',
        holderName: 'Ahmed Al-Mansouri',
        status: 'active',
        qrPayload: 'MNR-VERIFY:DOC-00103:119880123456',
        data: {
          nin: '119880123456',
          passportNumber: 'LYB-4C88K2',
          passportType: 'Ordinary',
          issuingOffice: 'Passport Authority — Tripoli',
        },
      },
      {
        id: 'doc_00104',
        type: 'drivers_license',
        typeAr: DOCUMENT_TYPE_AR.drivers_license,
        reference: 'DOC-00104',
        issuedAt: '2022-01-20T08:45:00Z',
        expiresAt: '2032-01-20T08:45:00Z',
        holderName: 'Ahmed Al-Mansouri',
        status: 'active',
        qrPayload: 'MNR-VERIFY:DOC-00104:119880123456',
        data: {
          nin: '119880123456',
          licenseNumber: 'DL-88-44321',
          category: 'B',
          issuingOffice: 'Traffic Department — Tripoli',
        },
      },
      {
        id: 'doc_00105',
        type: 'criminal_record',
        typeAr: DOCUMENT_TYPE_AR.criminal_record,
        reference: 'DOC-00105',
        issuedAt: '2026-09-28T12:00:00Z',
        expiresAt: '2027-03-28T12:00:00Z',
        holderName: 'Ahmed Al-Mansouri',
        status: 'active',
        qrPayload: 'MNR-VERIFY:DOC-00105:119880123456',
        data: {
          nin: '119880123456',
          purpose: 'Employment',
          issuingAuthority: 'Ministry of Justice — Judicial Record Office',
        },
      },
    ],
  ],
]);
