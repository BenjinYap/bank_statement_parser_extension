import { describe, expect, it } from 'vitest';
import { applyReplacements, parseDom } from '../../src/utils/parser';
import type { ReplacementMap } from '../../src/utils/replacements';

function buildTableHtml(rows:{ date:string, item:string, amount:string }[]):string {
  const rowsHtml = rows.map((row) => `
    <tr>
      <td class="mat-column-transactionDt">${row.date}</td>
      <td class="mat-column-transactionDescToDisplay">${row.item}</td>
      <td class="mat-column-debitedAmount">${row.amount}</td>
    </tr>
  `).join('');

  return `
    <table class="mat-table" aria-label="Transactions">
      <thead>
        <tr>
          <th class="mat-column-transactionDt"></th>
          <th class="mat-column-transactionDescToDisplay"></th>
          <th class="mat-column-debitedAmount"></th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

const DATE = new Date('2024-01-15');

const ITEM_MAP:ReplacementMap = {
  'Eating out': ['noodlebox', 'wok box'],
  'Drinks to go': [
    'tim hortons',
    ['esso circle', (date:Date, item:string, amount:number) => amount < 10],
  ],
};

const CATEGORY_MAP:ReplacementMap = {
  'Food': ['eating out', 'drinks to go'],
};

describe('applyReplacements', () => {
  it('replaces a known item and derives its category', () => {
    const result = applyReplacements(DATE, 'NOODLEBOX WATERLOO ON', 12.50, ITEM_MAP, CATEGORY_MAP);
    expect(result.item).toBe('Eating out');
    expect(result.category).toBe('Food');
    expect(result.originalItem).toBe('NOODLEBOX WATERLOO ON');
  });

  it('sets originalItem only when the item was changed', () => {
    const result = applyReplacements(DATE, 'SOMETHING UNKNOWN', 10.00, ITEM_MAP, CATEGORY_MAP);
    expect(result.item).toBe('SOMETHING UNKNOWN');
    expect(result.originalItem).toBeUndefined();
  });

  it('leaves category empty when no category match exists', () => {
    const result = applyReplacements(DATE, 'SOMETHING UNKNOWN', 10.00, ITEM_MAP, CATEGORY_MAP);
    expect(result.category).toBe('');
  });

  it('applies the amount predicate: esso circle below $10 → Drinks to go', () => {
    const result = applyReplacements(DATE, 'ESSO CIRCLE 123', 5.00, ITEM_MAP, CATEGORY_MAP);
    expect(result.item).toBe('Drinks to go');
    expect(result.category).toBe('Food');
  });

  it('does not replace esso circle when amount is $10 or above', () => {
    const result = applyReplacements(DATE, 'ESSO CIRCLE 123', 15.00, ITEM_MAP, CATEGORY_MAP);
    expect(result.item).toBe('ESSO CIRCLE 123');
    expect(result.originalItem).toBeUndefined();
  });

  it('matches item replacements case-insensitively', () => {
    const result = applyReplacements(DATE, 'wok box waterloo', 18.00, ITEM_MAP, CATEGORY_MAP);
    expect(result.item).toBe('Eating out');
  });

  it('derives category from the replaced item name, not the raw input', () => {
    const result = applyReplacements(DATE, 'TIM HORTONS #1234', 3.00, ITEM_MAP, CATEGORY_MAP);
    expect(result.item).toBe('Drinks to go');
    expect(result.category).toBe('Food');
  });
});

describe('parseDom', () => {
  it('reverses the row order so the result is chronological ascending', () => {
    const html = buildTableHtml([
      { date: '2024-01-15', item: 'THIRD', amount: '3.00' },
      { date: '2024-01-14', item: 'SECOND', amount: '2.00' },
      { date: '2024-01-13', item: 'FIRST', amount: '1.00' },
    ]);

    const result = parseDom(html, new Date('2024-01-01'), new Date('2024-01-31'));

    expect(result.map((transaction) => transaction.item)).toEqual(['FIRST', 'SECOND', 'THIRD']);
  });
});
