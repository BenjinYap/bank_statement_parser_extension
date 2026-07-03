import type { ParsedTransaction } from './ParsedTransaction';

export interface TransactionGroup {
  original: ParsedTransaction;
  current: ParsedTransaction[];
}

export function createTransactionGroup(transaction: ParsedTransaction): TransactionGroup {
  return { original: transaction, current: [{ ...transaction }] };
}
