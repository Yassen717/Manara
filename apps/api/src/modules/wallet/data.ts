import { Transaction, Wallet } from '../../common/types';
import { daysAgo, nextId } from '../../data/seed';

// Mock wallet for the demo citizen. A real provider resolves balance/card
// from the payment rail (LYPay / OnePay / Sadad) keyed by NIN.
export const DEMO_WALLET: Wallet = {
  balance: 3450.75,
  currency: 'LYD',
  cardLast4: '4412',
  monthlyLimit: 8000,
};

function tx(
  type: 'credit' | 'debit',
  amount: number,
  description: string,
  descriptionAr: string,
  category: string,
  daysBack: number,
): Transaction {
  return {
    id: nextId('tx'),
    type,
    amount,
    currency: 'LYD',
    description,
    descriptionAr,
    at: daysAgo(daysBack),
    category,
  };
}

// ~60 days of bilingual ledger history for the demo citizen. Seeded lazily
// into the shared TransactionsStore on the first /wallet/transactions call;
// other modules (utilities, payments) append to the same ledger afterwards.
export function seedTransactions(): Transaction[] {
  return [
    tx('debit', 400, 'ATM cash withdrawal — Jumhouria Bank, Andalus branch', 'سحب نقدي — مصرف الجمهورية، فرع الأندلس', 'cash_withdrawal', 57),
    tx('credit', 300, 'Fuel subsidy compensation transfer', 'تحويل تعويض الدعم على الوقود', 'subsidy_transfer', 52),
    tx('debit', 38.75, 'Water bill — August 2026', 'فاتورة المياه — أغسطس 2026', 'bill_payment', 45),
    tx('credit', 2200, 'Monthly salary — Ministry of Education', 'المرتب الشهري — وزارة التربية', 'salary', 35),
    tx('debit', 75, 'Secondary certificate exam fee', 'رسوم امتحان الشهادة الثانوية', 'education', 30),
    tx('debit', 300, 'Transfer to Fatima Al-Mansouri', 'تحويل إلى فاطمة المنصوري', 'transfer', 26),
    tx('credit', 450, 'Family and children grant', 'منحة الزوجة والأبناء', 'family_grant', 21),
    tx('debit', 64.5, 'Medicines — Al-Shifa Pharmacy', 'أدوية — صيدلية الشفاء', 'health', 18),
    tx('credit', 500, 'Wallet top-up — card •4412', 'شحن المحفظة — بطاقة •4412', 'top_up', 15),
    tx('debit', 95.4, 'Electricity bill — September 2026', 'فاتورة الكهرباء — سبتمبر 2026', 'bill_payment', 12),
    tx('debit', 50, 'Libyana mobile recharge', 'شحن رصيد ليبيانا', 'telecom', 9),
    tx('debit', 180, 'Groceries — Al-Naseem Market, Tripoli', 'مشتريات بقالة — سوق النسيم، طرابلس', 'groceries', 7),
    tx('credit', 2200, 'Monthly salary — Ministry of Education', 'المرتب الشهري — وزارة التربية', 'salary', 4),
  ];
}
