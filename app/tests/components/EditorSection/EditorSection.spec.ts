import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import EditorSection from '../../../src/components/EditorSection/EditorSection.svelte';
import type { TransactionGroup } from '../../../src/models/TransactionGroup';

const baseTransaction = { date: '2024-01-15', category: 'Food', amount: 12.50 };

const mockGroup:TransactionGroup = {
  original: { ...baseTransaction, item: 'Groceries' },
  current: [{ ...baseTransaction, item: 'Groceries' }],
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

  it('opens the edit panel immediately when initialSelectedGroup is provided', () => {
    const { getByText, queryByText } = render(EditorSection, {
      props: { transactionGroups: [mockGroup], initialSelectedGroup: mockGroup },
    });
    expect(getByText('Edit Transaction')).toBeInTheDocument();
    expect(queryByText('Select a transaction to edit.')).not.toBeInTheDocument();
  });
});
