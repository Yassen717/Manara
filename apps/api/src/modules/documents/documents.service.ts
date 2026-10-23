import { Injectable, NotFoundException } from '@nestjs/common';
import { CitizenProfile, DigitalDocument } from '../../common/types';
import { nextId } from '../../data/seed';
import { DOCUMENT_TYPE_AR, DOCUMENTS_BY_NIN, nextDocumentReference } from './data';
import { RequestDocumentDto } from './dto/request-document.dto';

@Injectable()
export class DocumentsService {
  private wallet(nin: string): DigitalDocument[] {
    let docs = DOCUMENTS_BY_NIN.get(nin);
    if (!docs) {
      docs = [];
      DOCUMENTS_BY_NIN.set(nin, docs);
    }
    return docs;
  }

  list(nin: string): DigitalDocument[] {
    return DOCUMENTS_BY_NIN.get(nin) ?? [];
  }

  getById(nin: string, id: string): DigitalDocument {
    const doc = (DOCUMENTS_BY_NIN.get(nin) ?? []).find((d) => d.id === id);
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  request(citizen: CitizenProfile, dto: RequestDocumentDto): DigitalDocument {
    const reference = nextDocumentReference();
    const data: Record<string, string> = {
      nin: citizen.nin,
      municipality: citizen.municipality,
    };
    for (const [k, v] of Object.entries(dto.details ?? {})) {
      if (v !== null && v !== undefined) data[k] = String(v);
    }
    const doc: DigitalDocument = {
      id: nextId('doc'),
      type: dto.type,
      typeAr: DOCUMENT_TYPE_AR[dto.type] ?? 'مستند رسمي',
      reference,
      issuedAt: new Date().toISOString(),
      holderName: `${citizen.firstName} ${citizen.lastName}`,
      status: 'active',
      qrPayload: `MNR-VERIFY:${reference}:${citizen.nin}`,
      data,
    };
    this.wallet(citizen.nin).push(doc);
    return doc;
  }
}
