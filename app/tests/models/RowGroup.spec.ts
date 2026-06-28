import { describe, expect, it } from 'vitest';
import { createRowGroup } from '../../src/models/RowGroup';
import type { ParsedRow } from '../../src/models/ParsedRow';

const row:ParsedRow = { date: '2024-01-15', category: 'Food', item: 'Groceries', amount: 42.50 };

describe('createRowGroup', () => {
  it('sets original to the same row reference', () => {
    const group = createRowGroup(row);
    expect(group.original).toBe(row);
  });

  it('sets current to a single-element array', () => {
    const group = createRowGroup(row);
    expect(group.current).toHaveLength(1);
  });

  it('current element has the same field values but is a different object', () => {
    const group = createRowGroup(row);
    expect(group.current[0]).toEqual(row);
    expect(group.current[0]).not.toBe(row);
  });
});
