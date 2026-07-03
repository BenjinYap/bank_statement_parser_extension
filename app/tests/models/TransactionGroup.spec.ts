import { describe, expect, it } from 'vitest';
import { createTransactionGroup } from '../../src/models/TransactionGroup';
import type { ParsedTransaction } from '../../src/models/ParsedTransaction';

const transaction:ParsedTransaction = { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 };

describe('createTransactionGroup', () => {
  it('sets original to the same transaction reference', () => {
    const group = createTransactionGroup(transaction);
    expect(group.original).toBe(transaction);
  });

  it('sets current to a single-element array', () => {
    const group = createTransactionGroup(transaction);
    expect(group.current).toHaveLength(1);
  });

  it('current element has the same field values but is a different object', () => {
    const group = createTransactionGroup(transaction);
    expect(group.current[0]).toEqual(transaction);
    expect(group.current[0]).not.toBe(transaction);
  });
});
