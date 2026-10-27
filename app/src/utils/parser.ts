import { getFormattedDate } from './date';
import type { ParsedTransaction } from '../models/ParsedTransaction';
import { doReplacement, type Rule } from './replacements/engine';

const DATE_COL = '.mat-column-transactionDt';
const ITEM_COL = '.mat-column-transactionDescToDisplay';
const AMOUNT_COL = '.mat-column-debitedAmount';
const REQUIRED_COLS = [DATE_COL, ITEM_COL, AMOUNT_COL];

export function applyReplacements(
  itemRaw:string,
  amount:number,
  itemRules:Rule[],
  categoryRules:Rule[],
):Pick<ParsedTransaction, 'category'|'item'|'originalItem'> {
  const item = doReplacement(itemRaw, amount, itemRules) ?? itemRaw;
  const category = doReplacement(item, amount, categoryRules) ?? '';
  return {
    category,
    item,
    ...(item !== itemRaw ? { originalItem: itemRaw } : {}),
  };
}

export function parseDom(
  html:string,
  dateFrom:Date,
  dateTo:Date,
  itemRules:Rule[],
  categoryRules:Rule[],
):ParsedTransaction[] {
  const transactions:ParsedTransaction[] = [];
  const root = document.createElement('div');
  root.innerHTML = html;
  root.querySelectorAll('.mat-table, .mat-mdc-table').forEach((table) => {
    const headerCols = table.querySelector('thead')?.querySelectorAll(REQUIRED_COLS.join(','));
    if ((headerCols?.length ?? 0) < REQUIRED_COLS.length) {
      return;
    }
    if (!table.getAttribute('aria-label')) {
      return;
    }

    table.querySelectorAll('tbody tr:not(.uf-table-row-error)').forEach((row) => {
      const dateRaw = row.querySelector(DATE_COL)?.textContent?.trim();
      const itemRaw = row.querySelector(ITEM_COL)?.textContent?.trim();
      const amountRaw = row.querySelector(AMOUNT_COL)?.textContent?.trim();

      if (!dateRaw || !itemRaw) {
        return;
      }

      const date = new Date(dateRaw);
      if (date.getTime() < dateFrom.getTime() || date.getTime() > dateTo.getTime()) {
        return;
      }

      if (!amountRaw) {
        return;
      }

      const amountMatch = amountRaw.match(/(\d+(\.\d+)?)/);
      if (!amountMatch) {
        return;
      }

      const amount = Number(amountMatch[1]);
      transactions.push({
        date: getFormattedDate(date),
        amount,
        ...applyReplacements(itemRaw, amount, itemRules, categoryRules),
      });
    });
  });

  return transactions.sort((a, b) => a.date.localeCompare(b.date));
}
