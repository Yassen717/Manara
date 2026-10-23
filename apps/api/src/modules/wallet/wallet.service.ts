import { Injectable } from '@nestjs/common';
import { CitizenProfile, Transaction, Wallet } from '../../common/types';
import { nextId } from '../../data/seed';
import { TransactionsStore } from '../../data/transactions.store';
import { DEMO_WALLET, seedTransactions } from './data';
import { PayBillDto } from './dto/pay-bill.dto';

@Injectable()
export class WalletService {
  // Mock provider seam: swap for a real payment-rail integration later.
  getWallet(_citizen: CitizenProfile): Wallet {
    return { ...DEMO_WALLET };
  }

  listTransactions(_citizen: CitizenProfile): Transaction[] {
    if (TransactionsStore.all().length === 0) {
      TransactionsStore.seed(seedTransactions());
    }
    return TransactionsStore.all();
  }

  payBill(_citizen: CitizenProfile, dto: PayBillDto): Transaction {
    const tx: Transaction = {
      id: nextId('tx'),
      type: 'debit',
      amount: dto.amount ?? 95,
      currency: 'LYD',
      description: dto.description ?? 'Bill payment',
      descriptionAr: 'سداد فاتورة',
      at: new Date().toISOString(),
      category: 'bill_payment',
    };
    return TransactionsStore.add(tx);
  }
}
