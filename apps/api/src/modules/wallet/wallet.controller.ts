import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { CitizenProfile, Transaction, Wallet } from '../../common/types';
import { PayBillDto } from './dto/pay-bill.dto';
import { WalletService } from './wallet.service';

@ApiTags('wallet')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly svc: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Wallet balance, currency and linked card' })
  @ApiResponse({ status: 200, description: 'Wallet for the authenticated citizen' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  getWallet(@CurrentCitizen() citizen: CitizenProfile): Wallet {
    return this.svc.getWallet(citizen);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Shared transaction ledger (wallet activity + bill payments)' })
  @ApiResponse({ status: 200, description: 'Transactions newest-first' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  listTransactions(@CurrentCitizen() citizen: CitizenProfile): Transaction[] {
    return this.svc.listTransactions(citizen);
  }

  @Post('pay')
  @ApiOperation({ summary: 'Pay a bill from the wallet' })
  @ApiResponse({ status: 200, description: 'Created debit transaction' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  pay(@CurrentCitizen() citizen: CitizenProfile, @Body() dto: PayBillDto): Transaction {
    return this.svc.payBill(citizen, dto);
  }
}
