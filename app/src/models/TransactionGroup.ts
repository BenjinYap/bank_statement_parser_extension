import type { ParsedTransaction } from './ParsedTransaction';

export interface TransactionGroup {
  original: ParsedTransaction;
  current: ParsedTransaction[];
  edited: boolean;
}

export function createTransactionGroup(transaction: ParsedTransaction): TransactionGroup {
  return { original: transaction, current: [{ ...transaction }], edited: false };
}
