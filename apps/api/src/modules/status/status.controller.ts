import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private readonly svc: StatusService) {}

  @Get('ping')
  ping() {
    return this.svc.ping();
  }
}
