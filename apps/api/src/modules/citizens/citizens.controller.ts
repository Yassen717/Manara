import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { CitizenProfile } from '../../common/types';
import { CitizensService } from './citizens.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('citizens')
@Controller('citizens')
export class CitizensController {
  constructor(private readonly svc: CitizensService) {}

  @Get('me/profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated citizen profile' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  getProfile(@CurrentCitizen() citizen: CitizenProfile) {
    return this.svc.getProfile(citizen);
  }

  @Patch('me/profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contact details of the authenticated citizen' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  updateProfile(@CurrentCitizen() citizen: CitizenProfile, @Body() dto: UpdateProfileDto) {
    return this.svc.updateProfile(citizen, dto);
  }
}
