import { CATEGORY_REPLACEMENTS, doReplacement, ITEM_REPLACEMENTS } from "./replacements.mjs";
import { getFormattedDate } from "./date.mjs";

export function parseDom (html, date_include_left, date_include_right) {
  const table_stats = [];

  const top = document.createElement('div');
  top.innerHTML = html;

  // find all tables
  top.querySelectorAll('.mat-table').forEach((table) => {
    const date_col = '.mat-column-transactionDt';
    const item_col = '.mat-column-transactionDescToDisplay';
    const amount_col = '.mat-column-debitedAmount';
    const required_cols = [
      date_col,
      item_col,
      amount_col,
    ];

    // valid tables have all the expected columns
    if (table.querySelector('thead')?.querySelectorAll(required_cols.join(',')).length < required_cols.length) {
      return;
    }

    // valid tables have the aria-label attribute
    if (!table.attributes['aria-label']) {
      return;
    }

    const stats = {
      label: table.attributes['aria-label'].value,
      success_rows: [],
      error_rows: [],
    };
    table_stats.push(stats);

    table.querySelectorAll('tbody tr:not(.uf-table-row-error)').forEach((row) => {
      const date_raw = row.querySelector(date_col)?.textContent;
      const item_raw = row.querySelector(item_col)?.textContent;
      const amount_raw = row.querySelector(amount_col)?.textContent;

      // if date or item are false-y, flag it as a potential parsing bug
      if (!date_raw || !item_raw) {
        stats.error_rows.push({
          date: date_raw,
          item: item_raw,
          amount: amount_raw,
          error: 'Invalid Date or Item',
        });
        return;
      }

      const date = new Date(date_raw);

      // ignore rows that fall outside of the desired date range
      if (date.getTime() < date_include_left.getTime() || date.getTime() > date_include_right.getTime()) {
        return;
      }

      // ignore rows with an empty or zero amount cause that means no spending to track
      if (!amount_raw) {
        return;
      }

      // parse out the numbers only portion of the amount
      let amount = amount_raw.match(/(\d+(\.\d+)?)/);

      // if no number match, flag as error due to currency issues likely
      if (amount === null) {
        stats.error_rows.push({
          date: date_raw,
          item: item_raw,
          amount: amount_raw,
          error: 'Invalid Amount',
        });
        return;
      }

      // capture group
      amount = Number(amount[1]);

      const success_row = buildSuccessRow(date, item_raw, amount);
      stats.success_rows.push(success_row);
    });
  });

  return table_stats;
}

function buildSuccessRow(date, item_raw, amount) {
  const obj = {
    date: getFormattedDate(date),
    category: '',
    item: doReplacement(date, item_raw, amount, ITEM_REPLACEMENTS) ?? item_raw,
    amount: amount,
  };
  obj.category = doReplacement(date, obj.item, amount, CATEGORY_REPLACEMENTS) ?? '';

  // add original item if item was changed
  if (obj.item !== item_raw) {
    obj.original_item = item_raw;
  }
  return obj;
}
