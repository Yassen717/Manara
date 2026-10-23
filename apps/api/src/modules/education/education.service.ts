import { Injectable } from '@nestjs/common';

@Injectable()
export class EducationService {
  ping() {
    return { module: 'education', status: 'stub' };
  }
}
