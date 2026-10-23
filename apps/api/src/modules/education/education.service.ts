import { Injectable, NotFoundException } from '@nestjs/common';
import { Certificate, CitizenProfile, ExamResult, Scholarship } from '../../common/types';
import { CERTIFICATES, EXAM_RESULTS, SCHOLARSHIPS } from './data';

@Injectable()
export class EducationService {
  listCertificates(citizen: CitizenProfile): Certificate[] {
    return CERTIFICATES.filter((c) => c.nin === citizen.nin).map(
      ({ nin: _nin, ...rest }) => rest,
    );
  }

  examResultBySeat(seat: string): ExamResult {
    const found = EXAM_RESULTS.find((r) => r.seat === seat);
    if (!found) throw new NotFoundException('No result for this seat number');
    return found;
  }

  scholarshipFor(citizen: CitizenProfile): Scholarship | null {
    const found = SCHOLARSHIPS.find((s) => s.nin === citizen.nin);
    if (!found) return null;
    const { nin: _nin, ...rest } = found;
    return rest;
  }
}
