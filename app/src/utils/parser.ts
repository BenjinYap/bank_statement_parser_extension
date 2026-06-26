import { getFormattedDate } from './date';
import type { ParsedRow } from '../models/ParsedRow';
import { doReplacement, ITEM_REPLACEMENTS, CATEGORY_REPLACEMENTS, type ReplacementMap } from './replacements';

const DATE_COL = '.mat-column-transactionDt';
const ITEM_COL = '.mat-column-transactionDescToDisplay';
const AMOUNT_COL = '.mat-column-debitedAmount';
const REQUIRED_COLS = [DATE_COL, ITEM_COL, AMOUNT_COL];

export function applyReplacements(date:Date, itemRaw:string, amount:number, itemReplacements:ReplacementMap, categoryReplacements:ReplacementMap):Pick<ParsedRow, 'category'|'item'|'originalItem'> {
  const item = doReplacement(date, itemRaw, amount, itemReplacements) ?? itemRaw;
  const category = doReplacement(date, item, amount, categoryReplacements) ?? '';
  return {
    category,
    item,
    ...(item !== itemRaw ? { originalItem: itemRaw } : {}),
  };
}

export function parseDom(html:string, dateFrom:Date, dateTo:Date):ParsedRow[] {
  const rows:ParsedRow[] = [];
  const root = document.createElement('div');
  root.innerHTML = html;

  root.querySelectorAll('.mat-table').forEach((table) => {
    const headerCols = table.querySelector('thead')?.querySelectorAll(REQUIRED_COLS.join(','));
    if ((headerCols?.length ?? 0) < REQUIRED_COLS.length) return;
    if (!table.getAttribute('aria-label')) return;

    table.querySelectorAll('tbody tr:not(.uf-table-row-error)').forEach((row) => {
      const dateRaw = row.querySelector(DATE_COL)?.textContent?.trim();
      const itemRaw = row.querySelector(ITEM_COL)?.textContent?.trim();
      const amountRaw = row.querySelector(AMOUNT_COL)?.textContent?.trim();

      if (!dateRaw || !itemRaw) return;

      const date = new Date(dateRaw);
      if (date.getTime() < dateFrom.getTime() || date.getTime() > dateTo.getTime()) return;

      if (!amountRaw) return;

      const amountMatch = amountRaw.match(/(\d+(\.\d+)?)/);
      if (!amountMatch) return;

      const amount = Number(amountMatch[1]);
      rows.push({
        date: getFormattedDate(date),
        amount,
        ...applyReplacements(date, itemRaw, amount, ITEM_REPLACEMENTS, CATEGORY_REPLACEMENTS),
      });
    });
  });

  return rows;
}
