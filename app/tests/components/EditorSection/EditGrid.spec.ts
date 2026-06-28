import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditGrid from '../../../src/components/EditorSection/EditGrid.svelte';
import type { RowGroup } from '../../../src/models/RowGroup';

const mockGroup:RowGroup = {
  original: { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 },
  current: [
    { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 },
    { date: '2024-01-15', category: 'Transportation', item: 'Bus', amount: 3.20 },
  ],
};

describe('EditGrid', () => {
  it('renders item and amount inputs for all current rows', () => {
    const { getAllByRole } = render(EditGrid, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });
    // 2 rows × 2 text inputs (item + amount); category is a <select>
    expect(getAllByRole('textbox')).toHaveLength(4);
  });

  it('renders category as a select with the correct initial value', () => {
    const { container } = render(EditGrid, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });
    const selects = container.querySelectorAll('select') as NodeListOf<HTMLSelectElement>;
    expect(selects).toHaveLength(2);
    expect(selects[0].value).toBe('Food');
    expect(selects[1].value).toBe('Transportation');
  });

  it('adds a new row when Add row is clicked', async () => {
    const { getAllByRole, getByText } = render(EditGrid, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });
    await fireEvent.click(getByText('Add row'));
    // 3 rows × 2 text inputs = 6
    expect(getAllByRole('textbox')).toHaveLength(6);
  });

  it('save() calls onsave with parsed rows using the original date', () => {
    const onsave = vi.fn();
    const { component } = render(EditGrid, {
      props: { selectedGroup: mockGroup, onsave },
    });
    (component as unknown as { save(): void }).save();
    expect(onsave).toHaveBeenCalledWith([
      { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.5 },
      { date: '2024-01-15', category: 'Transportation', item: 'Bus', amount: 3.2 },
    ]);
  });
});
