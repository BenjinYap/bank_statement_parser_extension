import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, within } from '@testing-library/svelte';
import TransactionEditPanel from '../../../src/components/EditorSection/TransactionEditPanel.svelte';
import type { TransactionGroup } from '../../../src/models/TransactionGroup';

const mockGroup:TransactionGroup = {
  original: { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 },
  current: [{ date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 }],
};

const otherMockGroup:TransactionGroup = {
  original: { date: '2024-02-20', category: 'Travel', item: 'Flight', amount: 199.99 },
  current: [{ date: '2024-02-20', category: 'Travel', item: 'Flight', amount: 199.99 }],
};

describe('TransactionEditPanel', () => {
  it('renders the original item and formatted amount', () => {
    const { getByText, getAllByRole } = render(TransactionEditPanel, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });
    // 'Groceries' is unique to the original section (not in CATEGORIES)
    expect(getByText('Groceries')).toBeInTheDocument();
    // The granular grid's Total row can also read $42.50, so scope to the original table.
    const originalTable = getAllByRole('table')[0];
    expect(within(originalTable).getByText('$42.50')).toBeInTheDocument();
  });

  it('clicking Save calls onsave with the parsed transactions', async () => {
    const onsave = vi.fn();
    const { getByText } = render(TransactionEditPanel, {
      props: { selectedGroup: mockGroup, onsave },
    });
    await fireEvent.click(getByText('Save'));
    expect(onsave).toHaveBeenCalledWith([
      { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
  });

  it('pressing Ctrl+S calls onsave with the parsed transactions', async () => {
    const onsave = vi.fn();
    render(TransactionEditPanel, {
      props: { selectedGroup: mockGroup, onsave },
    });
    await fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    expect(onsave).toHaveBeenCalledWith([
      { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
  });

  it('focuses the first category dropdown on initial load', () => {
    const { getAllByRole } = render(TransactionEditPanel, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });
    expect(getAllByRole('combobox')[0]).toHaveFocus();
  });

  it('focuses the first category dropdown after switching to a different group', async () => {
    const { getAllByRole, rerender } = render(TransactionEditPanel, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });
    getAllByRole('combobox')[0].blur();
    await rerender({ selectedGroup: otherMockGroup, onsave: vi.fn() });
    expect(getAllByRole('combobox')[0]).toHaveFocus();
  });
});
