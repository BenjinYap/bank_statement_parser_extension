import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditGrid from '../../src/components/EditGrid.svelte';
import type { RowGroup } from '../../src/models/RowGroup';

const mockGroup:RowGroup = {
  original: { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 },
  current: [
    { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 },
    { date: '2024-01-15', category: 'Transport', item: 'Bus', amount: 3.20 },
  ],
};

describe('EditGrid', () => {
  it('renders all current rows', () => {
    const { getAllByRole } = render(EditGrid, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });

    // 2 rows × 3 columns = 6 inputs
    expect(getAllByRole('textbox')).toHaveLength(6);
  });

  it('adds a new row when Add row is clicked', async () => {
    const { getAllByRole, getByText } = render(EditGrid, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });

    await fireEvent.click(getByText('Add row'));

    // 3 rows × 3 columns = 9 inputs
    expect(getAllByRole('textbox')).toHaveLength(9);
  });
});
