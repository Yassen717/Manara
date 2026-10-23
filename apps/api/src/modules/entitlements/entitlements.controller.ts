import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntitlementsService } from './entitlements.service';

@ApiTags('entitlements')
@Controller('entitlements')
export class EntitlementsController {
  constructor(private readonly svc: EntitlementsService) {}

  @Get('ping')
  ping() {
    return this.svc.ping();
  }
}
