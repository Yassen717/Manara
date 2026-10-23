import { Injectable, NotFoundException } from '@nestjs/common';
import { Bill, CitizenProfile } from '../../common/types';
import { nextId } from '../../data/seed';
import { TransactionsStore } from '../../data/transactions.store';
import { BILLS, StoredBill, UTILITY_LABELS } from './data';

@Injectable()
export class UtilitiesService {
  listBills(citizen: CitizenProfile): Bill[] {
    return BILLS.filter((b) => b.nin === citizen.nin).map((b) => this.toPublic(b));
  }

  payBill(citizen: CitizenProfile, id: string): Bill {
    const bill = BILLS.find((b) => b.id === id && b.nin === citizen.nin);
    if (!bill) throw new NotFoundException('Bill not found');
    if (bill.status !== 'paid') {
      bill.status = 'paid';
      const labels = UTILITY_LABELS[bill.utility];
      TransactionsStore.add({
        id: nextId('tx'),
        type: 'debit',
        amount: bill.amount,
        currency: bill.currency,
        description: `${labels.en} bill ${bill.period}`,
        descriptionAr: `فاتورة ${labels.ar} ${bill.period}`,
        at: new Date().toISOString(),
        category: 'bill_payment',
      });
    }
    return this.toPublic(bill);
  }

  private toPublic(b: StoredBill): Bill {
    const { nin: _nin, ...rest } = b;
    return rest;
  }
}
