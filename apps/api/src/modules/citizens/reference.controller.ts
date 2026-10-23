import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CitizensService } from './citizens.service';

@ApiTags('reference')
@Controller('reference')
export class ReferenceController {
  constructor(private readonly svc: CitizensService) {}

  @Get('municipalities')
  @ApiOperation({ summary: 'List Libyan municipalities (public reference data)' })
  municipalities() {
    return this.svc.listMunicipalities();
  }

  @Get('regions')
  @ApiOperation({ summary: 'List Libyan regions (public reference data)' })
  regions() {
    return this.svc.listRegions();
  }
}
