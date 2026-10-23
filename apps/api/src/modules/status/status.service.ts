import { Injectable } from '@nestjs/common';
import { NationalStatus, OutageSchedule } from '../../common/types';
import { NATIONAL_STATUS, OUTAGES } from './data';

@Injectable()
export class StatusService {
  national(): NationalStatus {
    return { generatedAt: new Date().toISOString(), services: NATIONAL_STATUS.services };
  }

  outages(filters: { region?: string; utility?: string }): OutageSchedule[] {
    const region = filters.region?.toLowerCase();
    return OUTAGES.filter(
      (o) =>
        (!region || o.region.toLowerCase() === region) &&
        (!filters.utility || o.utility === filters.utility),
    );
  }
}
