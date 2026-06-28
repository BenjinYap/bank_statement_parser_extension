import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import RowEditPanel from '../../../src/components/EditorSection/RowEditPanel.svelte';
import type { RowGroup } from '../../../src/models/RowGroup';

const mockGroup:RowGroup = {
  original: { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 },
  current: [{ date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 }],
};

describe('RowEditPanel', () => {
  it('renders all four original row fields', () => {
    const { getByText } = render(RowEditPanel, {
      props: { selectedGroup: mockGroup, onsave: vi.fn() },
    });

    // Scope to the "Original" section to avoid matching EditGrid inputs
    const originalSection = getByText('Original').parentElement!;

    expect(originalSection.textContent).toContain('2024-01-15');
    expect(originalSection.textContent).toContain('Food');
    expect(originalSection.textContent).toContain('Groceries');
    expect(originalSection.textContent).toContain('$42.50');
  });
});
