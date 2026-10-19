import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import EditorSection from '../../../src/components/EditorSection/EditorSection.svelte';
import type { TransactionGroup } from '../../../src/models/TransactionGroup';
import { reactiveArray } from '../../helpers/reactive.svelte';

const baseTransaction = { date: '2024-01-15', category: 'Food', amount: 12.50 };

const mockGroup:TransactionGroup = {
  original: { ...baseTransaction, item: 'Groceries' },
  current: [{ ...baseTransaction, item: 'Groceries' }],
  edited: false,
};

describe('EditorSection', () => {
  it('shows placeholder text when no group is selected', () => {
    const { getByText } = render(EditorSection, {
      props: { transactionGroups: [mockGroup] },
    });
    expect(getByText('Select a transaction to edit.')).toBeInTheDocument();
  });

  it('does not show the edit panel when no group is selected', () => {
    const { queryByText } = render(EditorSection, {
      props: { transactionGroups: [mockGroup] },
    });
    expect(queryByText('Edit Transaction')).not.toBeInTheDocument();
  });

  it('shows the edit panel after clicking a transaction', async () => {
    const { getByText, queryByText } = render(EditorSection, {
      props: { transactionGroups: [mockGroup] },
    });
    await fireEvent.click(getByText('Groceries'));
    await waitFor(() => expect(getByText('Edit Transaction')).toBeInTheDocument());
    expect(queryByText('Select a transaction to edit.')).not.toBeInTheDocument();
  });

  it('returns to placeholder text after saving', async () => {
    const { getByText, queryByText } = render(EditorSection, {
      props: { transactionGroups: [mockGroup] },
    });
    await fireEvent.click(getByText('Groceries'));
    await waitFor(() => expect(getByText('Edit Transaction')).toBeInTheDocument());
    await fireEvent.click(getByText('Save'));
    await waitFor(() => expect(getByText('Select a transaction to edit.')).toBeInTheDocument());
    expect(queryByText('Edit Transaction')).not.toBeInTheDocument();
  });

  it('marks the group as edited after saving', async () => {
    // transactionGroups must be reactive (like App's real $state array) so the
    // group EditorSection mutates on save is the same object referenced here.
    const groups:TransactionGroup[] = reactiveArray([{
      original: { ...baseTransaction, item: 'Groceries' },
      current: [{ ...baseTransaction, item: 'Groceries' }],
      edited: false,
    }]);
    const { getByText } = render(EditorSection, {
      props: { transactionGroups: groups },
    });

    expect(groups[0].edited).toBe(false);

    await fireEvent.click(getByText('Groceries'));
    await waitFor(() => expect(getByText('Edit Transaction')).toBeInTheDocument());
    await fireEvent.click(getByText('Save'));

    expect(groups[0].edited).toBe(true);
  });

  it('opens the edit panel immediately when initialSelectedGroup is provided', () => {
    const { getByText, queryByText } = render(EditorSection, {
      props: { transactionGroups: [mockGroup], initialSelectedGroup: mockGroup },
    });
    expect(getByText('Edit Transaction')).toBeInTheDocument();
    expect(queryByText('Select a transaction to edit.')).not.toBeInTheDocument();
  });

  it('copies all transaction data as headerless CSV when Copy CSV is clicked', async () => {
    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });

    const secondGroup:TransactionGroup = {
      original: { date: '2024-02-01', category: 'Rent', item: 'Apartment', amount: 1000 },
      current: [{ date: '2024-02-01', category: 'Rent', item: 'Apartment', amount: 1000 }],
      edited: false,
    };

    const { getByText } = render(EditorSection, {
      props: { transactionGroups: [mockGroup, secondGroup] },
    });

    await fireEvent.click(getByText('Copy CSV'));

    expect(writeText).toHaveBeenCalledWith(
      '2024-01-15,Food,Groceries,12.5\n2024-02-01,Rent,Apartment,1000'
    );
  });
});
