import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TransactionEditPanel from '../../../src/components/EditorSection/TransactionEditPanel.svelte';
import type { TransactionGroup } from '../../../src/models/TransactionGroup';

const mockGroup:TransactionGroup = {
  original: { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 },
  current: [{ date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 }],
};

describe('TransactionEditPanel', () => {
  it('renders the original item and formatted amount', () => {
    const { getByText } = render(TransactionEditPanel, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });
    // 'Groceries' is unique to the original section (not in CATEGORIES)
    expect(getByText('Groceries')).toBeInTheDocument();
    expect(getByText('$42.50')).toBeInTheDocument();
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

  it('pressing Ctrl+Plus adds a new blank row to the grid', async () => {
    const { getAllByRole } = render(TransactionEditPanel, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });
    expect(getAllByRole('combobox')).toHaveLength(1);
    await fireEvent.keyDown(window, { key: '+', ctrlKey: true });
    expect(getAllByRole('combobox')).toHaveLength(2);
  });
});
