import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  ping() {
    return { module: 'documents', status: 'stub' };
  }
}
