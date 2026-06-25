import { getFormattedDate } from './date';
import type { ParsedRow } from '../models/ParsedRow';

const DATE_COL = '.mat-column-transactionDt';
const ITEM_COL = '.mat-column-transactionDescToDisplay';
const AMOUNT_COL = '.mat-column-debitedAmount';
const REQUIRED_COLS = [DATE_COL, ITEM_COL, AMOUNT_COL];

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

      rows.push({
        date: getFormattedDate(date),
        category: '',
        item: itemRaw,
        amount: Number(amountMatch[1]),
      });
    });
  });

  return rows;
}
