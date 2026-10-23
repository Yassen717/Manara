import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly svc: WalletService) {}

  @Get('ping')
  ping() {
    return this.svc.ping();
  }
}
