import { describe, expect, it } from 'vitest';
import { applyReplacements, parseDom } from '../../src/utils/parser';
import type { Rule } from '../../src/utils/replacements/engine';

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

const ITEM_RULES:Rule[] = [
  { pattern: 'noodlebox', comparisons: [], replacement: 'Eating out' },
  { pattern: 'wok box', comparisons: [], replacement: 'Eating out' },
  { pattern: 'tim hortons', comparisons: [], replacement: 'Drinks to go' },
  { pattern: 'esso circle', comparisons: [{ operator: '<', values: [10] }], replacement: 'Drinks to go' },
];

const CATEGORY_RULES:Rule[] = [
  { pattern: 'eating out', comparisons: [], replacement: 'Food' },
  { pattern: 'drinks to go', comparisons: [], replacement: 'Food' },
];

describe('applyReplacements', () => {
  it('replaces a known item and derives its category', () => {
    const result = applyReplacements('NOODLEBOX WATERLOO ON', 12.50, ITEM_RULES, CATEGORY_RULES);
    expect(result.item).toBe('Eating out');
    expect(result.category).toBe('Food');
    expect(result.originalItem).toBe('NOODLEBOX WATERLOO ON');
  });

  it('sets originalItem only when the item was changed', () => {
    const result = applyReplacements('SOMETHING UNKNOWN', 10.00, ITEM_RULES, CATEGORY_RULES);
    expect(result.item).toBe('SOMETHING UNKNOWN');
    expect(result.originalItem).toBeUndefined();
  });

  it('leaves category empty when no category match exists', () => {
    const result = applyReplacements('SOMETHING UNKNOWN', 10.00, ITEM_RULES, CATEGORY_RULES);
    expect(result.category).toBe('');
  });

  it('applies the amount predicate: esso circle below $10 → Drinks to go', () => {
    const result = applyReplacements('ESSO CIRCLE 123', 5.00, ITEM_RULES, CATEGORY_RULES);
    expect(result.item).toBe('Drinks to go');
    expect(result.category).toBe('Food');
  });

  it('does not replace esso circle when amount is $10 or above', () => {
    const result = applyReplacements('ESSO CIRCLE 123', 15.00, ITEM_RULES, CATEGORY_RULES);
    expect(result.item).toBe('ESSO CIRCLE 123');
    expect(result.originalItem).toBeUndefined();
  });

  it('matches item replacements case-insensitively', () => {
    const result = applyReplacements('wok box waterloo', 18.00, ITEM_RULES, CATEGORY_RULES);
    expect(result.item).toBe('Eating out');
  });

  it('derives category from the replaced item name, not the raw input', () => {
    const result = applyReplacements('TIM HORTONS #1234', 3.00, ITEM_RULES, CATEGORY_RULES);
    expect(result.item).toBe('Drinks to go');
    expect(result.category).toBe('Food');
  });
});

describe('parseDom', () => {
  it('sorts the rows by date ascending', () => {
    const html = buildTableHtml([
      { date: '2024-01-15', item: 'THIRD', amount: '3.00' },
      { date: '2024-01-13', item: 'FIRST', amount: '1.00' },
      { date: '2024-01-14', item: 'SECOND', amount: '2.00' },
    ]);

    const result = parseDom(html, new Date('2024-01-01'), new Date('2024-01-31'), [], []);

    expect(result.map((transaction) => transaction.item)).toEqual(['FIRST', 'SECOND', 'THIRD']);
  });

  it('keeps the html order for rows sharing the same date', () => {
    const html = buildTableHtml([
      { date: '2024-01-14', item: 'SECOND', amount: '2.00' },
      { date: '2024-01-13', item: 'FIRST', amount: '1.00' },
      { date: '2024-01-14', item: 'THIRD', amount: '3.00' },
    ]);

    const result = parseDom(html, new Date('2024-01-01'), new Date('2024-01-31'), [], []);

    expect(result.map((transaction) => transaction.item)).toEqual(['FIRST', 'SECOND', 'THIRD']);
  });
});
