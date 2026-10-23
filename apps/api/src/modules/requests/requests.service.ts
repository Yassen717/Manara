import { Injectable } from '@nestjs/common';
import { CitizenProfile, ServiceRequest } from '../../common/types';
import { nextId, reference } from '../../data/seed';
import { SEED_REQUESTS, StoredServiceRequest } from './data';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestsService {
  private readonly store: StoredServiceRequest[] = [...SEED_REQUESTS];

  listFor(citizen: CitizenProfile, filters: { status?: string; type?: string }): ServiceRequest[] {
    return this.store
      .filter((r) => r.ownerNin === citizen.nin || r.isPublic)
      .filter((r) => !filters.status || r.status === filters.status)
      .filter((r) => !filters.type || r.type === filters.type)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((r) => this.toPublic(r));
  }

  create(citizen: CitizenProfile, dto: CreateRequestDto): ServiceRequest {
    const now = new Date().toISOString();
    const urgent = dto.type === 'power_outage' && /hospital|critical/i.test(dto.description);
    const stored: StoredServiceRequest = {
      id: nextId('req'),
      reference: reference('REQ'),
      type: dto.type,
      title: dto.title,
      description: dto.description,
      municipality: dto.municipality,
      region: dto.region,
      status: 'received',
      priority: urgent ? 'urgent' : 'normal',
      createdAt: now,
      updatedAt: now,
      eta: null,
      timeline: [
        { status: 'received', at: now, note: 'Request received by Manara and routed to the responsible authority' },
      ],
      ownerNin: citizen.nin,
      isPublic: false,
    };
    this.store.unshift(stored);
    return this.toPublic(stored);
  }

  findFor(citizen: CitizenProfile, id: string): ServiceRequest | undefined {
    const found = this.store.find((r) => r.id === id && (r.ownerNin === citizen.nin || r.isPublic));
    return found ? this.toPublic(found) : undefined;
  }

  stats(): { total: number; byStatus: Record<string, number>; byType: Record<string, number> } {
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    for (const r of this.store) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
      byType[r.type] = (byType[r.type] ?? 0) + 1;
    }
    return { total: this.store.length, byStatus, byType };
  }

  private toPublic(r: StoredServiceRequest): ServiceRequest {
    const { ownerNin, isPublic, ...rest } = r;
    return rest;
  }
}
