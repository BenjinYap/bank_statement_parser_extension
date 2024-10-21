import { getFormattedDate } from "./js/date.mjs";
import { parseDom } from "./js/parser.mjs";

// noinspection JSUnresolvedReference,JSDeprecatedSymbols
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'tab_opened') {
    work(request);
  }
});

function work (request) {
  const t = document.querySelector('textarea');
  const result_table_el = document.querySelector('#result-table');
  document.querySelector('#csv-button').addEventListener('click', () => navigator.clipboard.writeText(t.value));

  const date_include_left = new Date(request.date_from);
  date_include_left.setHours(0, 0, 0, 0);
  const date_include_right = new Date();
  date_include_right.setHours(-1, 0, 0, 0);

  document.querySelector('#date-include-left').textContent = getFormattedDate(date_include_left);
  document.querySelector('#date-include-right').textContent = getFormattedDate(date_include_right);

  const table_stats = parseDom(request.html, date_include_left, date_include_right);

  displayMeta(table_stats);

  // combine all rows into a flat array
  const all_success_rows = table_stats.flatMap(table => table.success_rows);
  // sort by ascending date
  all_success_rows.sort((a, b) => new Date(a.date) > new Date(b.date) ? 1 : -1);

  let csv = '';
  all_success_rows.forEach((r) => {
    csv += `${r.date},${r.category},${r.item},${r.amount}\n`;

    const item_class = r.original_item ? 'replaced' : '';
    result_table_el.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${r.date}</td>
        <td>${r.category}</td>
        <td class="item ${item_class}">${r.item}${r.original_item ? `<span class="original">(${r.original_item})</span> <span title="Modified by parsing rules" class="material-symbols-outlined">more_horiz</span>` : ''}</td>
        <td class="amount">${r.amount.toFixed(2)}</td>
      </tr>
    `);
  });
  t.value = csv;
}

function displayMeta (table_stats) {
  const meta_el = document.querySelector('#meta');

  table_stats.forEach((stats) => {
    // summary of the parsed table
    const table_el = document.createElement('table');
    table_el.insertAdjacentHTML('beforeend', `<tr class="label"><th colspan="4">${stats.label}</th></tr>`);
    table_el.insertAdjacentHTML('beforeend', `<tr class="success"><th>Success Rows</th><td colspan="4">${stats.success_rows.length}</td></tr>`);

    if (stats.error_rows.length > 0) {
      table_el.insertAdjacentHTML('beforeend', `<tr class="error-label"><th colspan="4">Error Rows</th></tr>`);
      stats.error_rows.forEach((row) => {
        table_el.insertAdjacentHTML('beforeend', `<tr class="error"><td>${row.date}</td><td>${row.item}</td><td>${row.amount}</td><td>${row.error}</td></tr>`);
      });
    }

    meta_el.appendChild(table_el);
  });
}







