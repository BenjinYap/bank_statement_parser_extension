import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TransactionTable from '../../../src/components/EditorSection/TransactionTable.svelte';
import type { TransactionGroup } from '../../../src/models/TransactionGroup';

const baseTransaction = { date: '2024-01-15', category: 'Food', amount: 12.50 };

function matchesCellText(expected:string) {
  return (_:string, element:Element|null) => {
    return element?.tagName.toLowerCase() === 'td'
      && element.textContent?.replace(/\s+/g, ' ').trim() === expected;
  };
}

const groupWithReplacement:TransactionGroup = {
  original: { ...baseTransaction, item: 'Eating out', originalItem: 'NOODLEBOX WATERLOO ON' },
  current: [{ ...baseTransaction, item: 'Eating out' }],
};

const groupWithoutReplacement:TransactionGroup = {
  original: { ...baseTransaction, item: 'SOMETHING UNKNOWN' },
  current: [{ ...baseTransaction, item: 'SOMETHING UNKNOWN' }],
};

describe('TransactionTable', () => {
  it('shows replaced item with original in parentheses when originalItem is set', () => {
    const { getByText } = render(TransactionTable, {
      props: { transactionGroups: [groupWithReplacement], selectedGroup: undefined, onselect: vi.fn() },
    });

    expect(getByText(matchesCellText('Eating out (NOODLEBOX WATERLOO ON)'))).toBeInTheDocument();
  });

  it('shows just the item name when originalItem is not set', () => {
    const { getByText, queryByText } = render(TransactionTable, {
      props: { transactionGroups: [groupWithoutReplacement], selectedGroup: undefined, onselect: vi.fn() },
    });

    expect(getByText('SOMETHING UNKNOWN')).toBeInTheDocument();
    expect(queryByText(/\(/)).not.toBeInTheDocument();
  });

  it('shows the annotation on every granular transaction in a group', () => {
    const multiTransactionGroup:TransactionGroup = {
      original: { ...baseTransaction, item: 'Eating out', originalItem: 'NOODLEBOX WATERLOO ON' },
      current: [
        { ...baseTransaction, item: 'Eating out' },
        { ...baseTransaction, item: 'Snacks' },
      ],
    };

    const { getAllByText } = render(TransactionTable, {
      props: { transactionGroups: [multiTransactionGroup], selectedGroup: undefined, onselect: vi.fn() },
    });

    expect(getAllByText(matchesCellText('Eating out (NOODLEBOX WATERLOO ON)'))).toHaveLength(1);
    expect(getAllByText(matchesCellText('Snacks (NOODLEBOX WATERLOO ON)'))).toHaveLength(1);
  });

  it('calls onselect with the correct group when a transaction is clicked', async () => {
    const onselect = vi.fn();
    const { getByText } = render(TransactionTable, {
      props: { transactionGroups: [groupWithoutReplacement], selectedGroup: undefined, onselect },
    });
    await fireEvent.click(getByText('SOMETHING UNKNOWN'));
    expect(onselect).toHaveBeenCalledWith(groupWithoutReplacement);
  });

  it('shows the date only on the first transaction of a multi-transaction group', () => {
    const multiTransactionGroup:TransactionGroup = {
      original: { ...baseTransaction, item: 'Eating out' },
      current: [
        { ...baseTransaction, item: 'Eating out' },
        { ...baseTransaction, item: 'Snacks' },
      ],
    };
    const { getAllByText } = render(TransactionTable, {
      props: { transactionGroups: [multiTransactionGroup], selectedGroup: undefined, onselect: vi.fn() },
    });
    expect(getAllByText('2024-01-15')).toHaveLength(1);
  });

  it('formats the amount as $XX.XX', () => {
    const { getByText } = render(TransactionTable, {
      props: { transactionGroups: [groupWithoutReplacement], selectedGroup: undefined, onselect: vi.fn() },
    });
    expect(getByText('$12.50')).toBeInTheDocument();
  });
});
