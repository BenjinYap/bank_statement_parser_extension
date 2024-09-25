(async () => {
  const CATEGORY_REPLACEMENTS = {
    'Food': [
      'drinks to go',
      'drinks for home',
      'eating out',
      'groceries',
      "haniya's fridge",
      'snacks',
    ],
    'Bills': [
      'amazon web services',
    ],
  };
  const ITEM_REPLACEMENTS = {
    'Eating out': [
      'noodlebox',
    ],
    'Drinks to go': [
      ['tim hortons', (d, i, a) => a === 3.14],
    ],
  };

  const date_include_right = new Date();
  date_include_right.setHours(-1, 0, 0, 0);

  const meta = document.querySelector('#meta');
  const t = document.querySelector('textarea');
  const result_table = document.querySelector('#result-table');
  document.querySelector('#csv-button').addEventListener('click', () => navigator.clipboard.writeText(t.value));
  document.querySelector('#date-include-right').innerHTML = getFormattedDate(date_include_right);

  document.querySelector('#parse-button').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, parseDom);
  });
  document.querySelector('button').click();

  function parseDom(resp) {
    // the starting date
    // const raw = document.querySelector('input[type=date]').value;
    const raw = '2024-08-10';
    const date_include_left = new Date(raw);

    const top = document.createElement('div');
    top.innerHTML = resp;

    const table_stats = [];

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

        const dwa = document.createElement('p');
        // dwa.textContent = `${date_raw} ${item_raw} ${amount}`;
        dwa.textContent = `${success_row.date} ${success_row.item} ${success_row.amount}`;
        // document.body.appendChild(dwa);
      });

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

      meta.appendChild(table_el);
    });

    // combine all rows into a flat array
    const all_success_rows = table_stats.flatMap(table => table.success_rows);
    // sort by ascending date
    all_success_rows.sort((a, b) => new Date(a.date) > new Date(b.date) ? 1 : -1);

    let csv = '';
    all_success_rows.forEach((r) => {
      csv += `${r.date},${r.category},${r.item},${r.amount}\n`;

      const item_class = r.original_item ? 'class="replaced"' : '';
      result_table.insertAdjacentHTML('beforeend', `<tr><td>${r.date}</td><td>${r.category}</td><td ${item_class}>${r.item}</td><td class="amount">${r.amount}</td></tr>`);
    });
    t.value = csv;

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

    function doReplacement(date, item_raw, amount, replacements) {
      for (const item_replace in replacements) {
        for (const condition of replacements[item_replace]) {
          // condition is just a regex string
          if (typeof condition === 'string') {
            const re = new RegExp(`.*${condition}.*`, 'i');
            if (item_raw.match(re)) {
              return item_replace;
            }
          } else {  // condition is a regex string plus a custom filter function
            const re = new RegExp(`.*${condition[0]}.*`, 'i');

            const filter = condition[1];
            if (filter(date, item_raw, amount) && item_raw.match(re)) {
              return item_replace;
            }
          }
        }
      }

      return null;
    }

    // const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // const month = monthNames[dateObj.getMonth()]; // Get month name
    // const day = dateObj.getDate(); // Get day of the month
    // const year = dateObj.getFullYear(); // Get full year
    // const formattedDate = `${month} ${day}, ${year}`;

    // t.value = formattedDate; // Outputs: "Jan 30, 2022"
  }

  function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return month + '/' + day + '/' + year;
  }
})();
