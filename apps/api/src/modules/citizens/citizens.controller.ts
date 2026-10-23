import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CitizensService } from './citizens.service';

@ApiTags('citizens')
@Controller('citizens')
export class CitizensController {
  constructor(private readonly svc: CitizensService) {}

  @Get('ping')
  ping() {
    return this.svc.ping();
  }
}
