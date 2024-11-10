<script>
  import IntroSection from "./components/sections/IntroSection.svelte";
  import { mock } from './mock.mjs';
  import MetaSection from "./components/sections/MetaSection.svelte";
  import { parseDom } from "./utils/parser.mjs";
  import ResultsSection from "./components/sections/ResultsSection.svelte";

  let date_include_left;
  let date_include_right = new Date();
  date_include_right.setHours(-1, 0, 0, 0);

  let table_stats;
  let all_success_rows;

  (async () => {
    let dom;

    await new Promise((resolve) => {
      // running in real extension mode
      // noinspection JSUnresolvedReference,JSDeprecatedSymbols
      if (chrome.runtime) {
        // noinspection JSUnresolvedReference,JSDeprecatedSymbols
        chrome.runtime.onMessage.addListener((req) => {
          if (req.action === 'tab_opened') {
            date_include_left = new Date(req.date_from);
            date_include_left.setHours(0, 0, 0, 0);
            dom = req.html;
            resolve();
          }
        });
      } else {  // local dev mode
        date_include_left = new Date('Sep 10, 2024');
        dom = mock;
        resolve();
      }
    });

    table_stats = parseDom(dom, date_include_left, date_include_right);
    // combine all rows into a flat array
    all_success_rows = table_stats.flatMap(table => table.success_rows);
    // sort by ascending date
    all_success_rows.sort((a, b) => new Date(a.date) > new Date(b.date) ? 1 : -1);
  })();
</script>

<svelte:head>
  <title>awd</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</svelte:head>

<IntroSection
  {date_include_left}
  {date_include_right}
/>

<MetaSection
  {table_stats}
/>

<ResultsSection
  rows={all_success_rows}
/>
