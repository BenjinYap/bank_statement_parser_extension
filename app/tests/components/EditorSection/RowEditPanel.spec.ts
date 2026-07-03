import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import RowEditPanel from '../../../src/components/EditorSection/RowEditPanel.svelte';
import type { RowGroup } from '../../../src/models/RowGroup';

const mockGroup:RowGroup = {
  original: { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 },
  current: [{ date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 }],
};

describe('RowEditPanel', () => {
  it('renders the original item and formatted amount', () => {
    const { getByText } = render(RowEditPanel, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });
    // 'Groceries' is unique to the original section (not in CATEGORIES)
    expect(getByText('Groceries')).toBeInTheDocument();
    expect(getByText('$42.50')).toBeInTheDocument();
  });

  it('clicking Save calls onsave with the parsed rows', async () => {
    const onsave = vi.fn();
    const { getByText } = render(RowEditPanel, {
      props: { selectedGroup: mockGroup, onsave },
    });
    await fireEvent.click(getByText('Save'));
    expect(onsave).toHaveBeenCalledWith([
      { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
  });
});
