import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { AppNotification, CitizenProfile } from '../../common/types';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "List the caller's notifications, newest first" })
  @ApiResponse({ status: 200, description: 'Notification[]' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  list(@CurrentCitizen() citizen: CitizenProfile): AppNotification[] {
    return this.svc.listFor(citizen.nin);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all of the caller\'s notifications as read' })
  @ApiResponse({ status: 200, description: '{ updated: number }' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  readAll(@CurrentCitizen() citizen: CitizenProfile): { updated: number } {
    return this.svc.markAllRead(citizen.nin);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark one notification as read' })
  @ApiResponse({ status: 200, description: 'Notification' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  read(@CurrentCitizen() citizen: CitizenProfile, @Param('id') id: string): AppNotification {
    const notification = this.svc.markRead(citizen.nin, id);
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }
}
