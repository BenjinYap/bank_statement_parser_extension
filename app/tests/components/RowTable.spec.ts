import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import RowTable from '../../src/components/RowTable.svelte';
import type { RowGroup } from '../../src/models/RowGroup';

const baseRow = { date: '2024-01-15', category: 'Food', amount: 12.50 };

const groupWithReplacement:RowGroup = {
  original: { ...baseRow, item: 'Eating out', originalItem: 'NOODLEBOX WATERLOO ON' },
  current: [{ ...baseRow, item: 'Eating out' }],
};

const groupWithoutReplacement:RowGroup = {
  original: { ...baseRow, item: 'SOMETHING UNKNOWN' },
  current: [{ ...baseRow, item: 'SOMETHING UNKNOWN' }],
};

describe('RowTable', () => {
  it('shows replaced item with original in parentheses when originalItem is set', () => {
    const { getByText } = render(RowTable, {
      props: { rowGroups: [groupWithReplacement], selectedGroup: undefined, onselect: vi.fn() },
    });

    expect(getByText('Eating out (NOODLEBOX WATERLOO ON)')).toBeInTheDocument();
  });

  it('shows just the item name when originalItem is not set', () => {
    const { getByText, queryByText } = render(RowTable, {
      props: { rowGroups: [groupWithoutReplacement], selectedGroup: undefined, onselect: vi.fn() },
    });

    expect(getByText('SOMETHING UNKNOWN')).toBeInTheDocument();
    expect(queryByText(/\(/)).not.toBeInTheDocument();
  });

  it('shows the annotation on every granular row in a group', () => {
    const multiRowGroup:RowGroup = {
      original: { ...baseRow, item: 'Eating out', originalItem: 'NOODLEBOX WATERLOO ON' },
      current: [
        { ...baseRow, item: 'Eating out' },
        { ...baseRow, item: 'Snacks' },
      ],
    };

    const { getAllByText } = render(RowTable, {
      props: { rowGroups: [multiRowGroup], selectedGroup: undefined, onselect: vi.fn() },
    });

    expect(getAllByText('Eating out (NOODLEBOX WATERLOO ON)')).toHaveLength(1);
    expect(getAllByText('Snacks (NOODLEBOX WATERLOO ON)')).toHaveLength(1);
  });
});
