<script>
  import IntroSection from "./components/sections/IntroSection.svelte";
  import { mock } from './mock.mjs';
  import MetaSection from "./components/sections/MetaSection.svelte";
  import { parseDom } from "./utils/parser.mjs";
  import ResultsSection from "./components/sections/ResultsSection.svelte";
  import { ParsedRow } from "./models/ParsedRow.mjs";
  import { getFormattedDate } from "./utils/date.mjs";
  import { CATEGORY_REPLACEMENTS, doReplacement } from "./utils/replacements.mjs";
  import { SettingsSvelte } from "./models/Settings.svelte.js";
  import SettingsSection from "./components/sections/SettingsSection.svelte";

  let date_include_left;
  let date_include_right = new Date();
  date_include_right.setHours(-1, 0, 0, 0);

  let table_stats;
  let all_success_rows = $state(undefined);
  let settings = new SettingsSvelte();

  (async () => {
    let dom;
    
    // await settings.save();
    // await settings.load();
    
    const dev_mode = !chrome.runtime;

    await new Promise((resolve) => {
      // running in real extension mode
      // noinspection JSUnresolvedReference,JSDeprecatedSymbols
      if (!dev_mode) {
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
        setTimeout(() => resolve(), 100);
        // resolve();
      }
    });

    table_stats = parseDom(dom, date_include_left, date_include_right);
    // combine all rows into a flat array
    all_success_rows = table_stats.flatMap(table => table.success_rows);
    // sort by ascending date
    all_success_rows.sort((a, b) => new Date(a.date) > new Date(b.date) ? 1 : -1);
    
    if (dev_mode) {
      all_success_rows = all_success_rows.slice(0, 5);
    }
  })();
</script>

<svelte:head>
  <title>awd</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</svelte:head>

<div class="flex flex-col items-stretch gap-2 py-2 max-w-[1000px] w-full">  
  <IntroSection
    {date_include_left}
    {date_include_right}
  />
  
<!--  <MetaSection-->
<!--    {table_stats}-->
<!--  />-->
  
<!--  <SettingsSection-->
<!--    {settings}-->
<!--  />-->
  
  <ResultsSection
    rows={all_success_rows}
  />
</div>