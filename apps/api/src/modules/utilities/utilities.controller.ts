import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UtilitiesService } from './utilities.service';

@ApiTags('utilities')
@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly svc: UtilitiesService) {}

  @Get('ping')
  ping() {
    return this.svc.ping();
  }
}
