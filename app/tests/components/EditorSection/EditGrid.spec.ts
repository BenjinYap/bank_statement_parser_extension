import { describe, expect, it } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditGrid from '../../../src/components/EditorSection/EditGrid.svelte';
import type { EditRow } from '../../../src/models/EditRow';

const mockRows:EditRow[] = [
  { category: 'Food', item: 'Groceries', amount: 42.5 },
  { category: 'Transportation', item: 'Bus', amount: 3.2 },
];

describe('EditGrid', () => {
  it('renders item and amount inputs for all rows', () => {
    const { getAllByRole } = render(EditGrid, {
      props: { editRows: mockRows },
    });
    // 2 rows × 2 text inputs (item + amount); category is a <select>
    expect(getAllByRole('textbox')).toHaveLength(4);
  });

  it('renders category as a select with the correct initial value', () => {
    const { container } = render(EditGrid, {
      props: { editRows: mockRows },
    });
    const selects = container.querySelectorAll('select') as NodeListOf<HTMLSelectElement>;
    expect(selects).toHaveLength(2);
    expect(selects[0].value).toBe('Food');
    expect(selects[1].value).toBe('Transportation');
  });

  it('pushes a new row onto editRows when Add row is clicked', async () => {
    const editRows:EditRow[] = [
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ];
    const { getByText } = render(EditGrid, {
      props: { editRows },
    });
    await fireEvent.click(getByText('Add row'));
    expect(editRows).toEqual([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
      { category: '', item: '', amount: 0 },
    ]);
  });
});
