import { Injectable, NotFoundException } from '@nestjs/common';
import { Application, CitizenProfile, ServiceDetail, ServiceSummary } from '../../common/types';
import { nextId } from '../../data/seed';
import { ApplicationsStore, nextApplicationReference } from './applications.store';
import { CATALOG, CATEGORY_LABELS, CategoryInfo } from './data';
import { ApplyServiceDto } from './dto/apply-service.dto';

function toSummary(s: ServiceDetail): ServiceSummary {
  const { longDescription, longDescriptionAr, requiredDocuments, steps, eligibility, ...summary } = s;
  return summary;
}

@Injectable()
export class ServicesService {
  list(filters: { category?: string; q?: string; popular?: string }): ServiceSummary[] {
    let items = CATALOG;
    if (filters.category) items = items.filter((s) => s.category === filters.category);
    if (filters.popular === 'true') items = items.filter((s) => s.popular);
    else if (filters.popular === 'false') items = items.filter((s) => !s.popular);
    const q = filters.q?.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.nameAr.includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.shortDescriptionAr.includes(q) ||
          s.longDescription.toLowerCase().includes(q) ||
          s.longDescriptionAr.includes(q),
      );
    }
    return items.map(toSummary);
  }

  categories(): CategoryInfo[] {
    return (Object.keys(CATEGORY_LABELS) as CategoryInfo['id'][]).map((id) => ({
      id,
      ...CATEGORY_LABELS[id],
      count: CATALOG.filter((s) => s.category === id).length,
    }));
  }

  getBySlug(slug: string): ServiceDetail {
    const svc = CATALOG.find((s) => s.slug === slug);
    if (!svc) throw new NotFoundException('Service not found');
    return svc;
  }

  listApplications(nin: string): Application[] {
    return ApplicationsStore.all(nin)
      .slice()
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }

  getApplication(nin: string, id: string): Application {
    const app = ApplicationsStore.all(nin).find((a) => a.id === id);
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  apply(slug: string, citizen: CitizenProfile, dto: ApplyServiceDto): Application {
    const svc = this.getBySlug(slug);
    const now = new Date().toISOString();
    return ApplicationsStore.add(citizen.nin, {
      id: nextId('app'),
      reference: nextApplicationReference(),
      serviceId: svc.id,
      serviceName: svc.name,
      serviceNameAr: svc.nameAr,
      status: 'submitted',
      submittedAt: now,
      updatedAt: now,
      timeline: [{ status: 'submitted', at: now, note: 'Application received digitally' }],
      delivery: 'digital',
    });
  }
}
