import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { CitizenProfile, DigitalDocument } from '../../common/types';
import { DocumentsService } from './documents.service';
import { RequestDocumentDto } from './dto/request-document.dto';

@ApiTags('documents')
@Controller('documents')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly svc: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: "List the caller's digital documents" })
  list(@CurrentCitizen() citizen: CitizenProfile): DigitalDocument[] {
    return this.svc.list(citizen.nin);
  }

  // 'request' is a POST and does not conflict with GET ':id'.
  @Post('request')
  @ApiOperation({ summary: 'Request instant issuance of a digital document' })
  request(@CurrentCitizen() citizen: CitizenProfile, @Body() dto: RequestDocumentDto): DigitalDocument {
    return this.svc.request(citizen, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one of the caller’s digital documents' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  byId(@CurrentCitizen() citizen: CitizenProfile, @Param('id') id: string): DigitalDocument {
    return this.svc.getById(citizen.nin, id);
  }
}
