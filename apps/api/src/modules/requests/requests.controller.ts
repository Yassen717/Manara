import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestsService } from './requests.service';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly svc: RequestsService) {}

  @Get('ping')
  ping() {
    return this.svc.ping();
  }
}
