import { Transaction } from '../common/types';

// Shared transaction log: wallet seeds base history; other modules (utilities,
// payments) append entries so /wallet/transactions reflects all money movement.
// Replace with a real ledger persistence later.

const transactions: Transaction[] = [];

export const TransactionsStore = {
  all(): Transaction[] {
    return [...transactions].sort((a, b) => b.at.localeCompare(a.at));
  },
  add(tx: Transaction): Transaction {
    transactions.push(tx);
    return tx;
  },
  seed(list: Transaction[]) {
    if (transactions.length === 0) transactions.push(...list);
  },
};
