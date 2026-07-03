import { describe, expect, it } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditGrid from '../../../../src/components/EditorSection/EditGrid/EditGrid.svelte';
import type { EditTransaction } from '../../../../src/models/EditTransaction';

const mockTransactions:EditTransaction[] = [
  { category: 'Food', item: 'Groceries', amount: 42.5 },
  { category: 'Transportation', item: 'Bus', amount: 3.2 },
];

describe('EditGrid', () => {
  it('renders item and amount inputs for all transactions', () => {
    const { getAllByRole } = render(EditGrid, {
      props: { editTransactions: mockTransactions },
    });
    // 2 transactions × 2 text inputs (item + amount); category is a <select>
    expect(getAllByRole('textbox')).toHaveLength(4);
  });

  it('renders category as a select with the correct initial value', () => {
    const { container } = render(EditGrid, {
      props: { editTransactions: mockTransactions },
    });
    const selects = container.querySelectorAll('select') as NodeListOf<HTMLSelectElement>;
    expect(selects).toHaveLength(2);
    expect(selects[0].value).toBe('Food');
    expect(selects[1].value).toBe('Transportation');
  });

  it('pushes a new transaction onto editTransactions when Add transaction is clicked', async () => {
    const editTransactions:EditTransaction[] = [
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ];
    const { getByText } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.click(getByText('Add transaction'));
    expect(editTransactions).toEqual([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
      { category: '', item: '', amount: 0 },
    ]);
  });
});
