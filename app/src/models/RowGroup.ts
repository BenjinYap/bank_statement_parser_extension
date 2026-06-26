import type { ParsedRow } from './ParsedRow';

export interface RowGroup {
  original: ParsedRow;
  current: ParsedRow[];
}

export function createRowGroup(row: ParsedRow): RowGroup {
  return { original: row, current: [{ ...row }] };
}
