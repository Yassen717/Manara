import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EducationService } from './education.service';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private readonly svc: EducationService) {}

  @Get('ping')
  ping() {
    return this.svc.ping();
  }
}
