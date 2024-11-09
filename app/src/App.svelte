<script>
  import IntroSection from "./components/sections/IntroSection.svelte";
  import { mock } from './mock.mjs';
  import MetaSection from "./components/sections/MetaSection.svelte";
  import { parseDom } from "./utils/parser.mjs";

  let date_include_left;
  let date_include_right = new Date();
  date_include_right.setHours(-1, 0, 0, 0);

  let table_stats;

  // running in real extension mode
  // noinspection JSUnresolvedReference,JSDeprecatedSymbols
  if (chrome.runtime) {
    // noinspection JSUnresolvedReference,JSDeprecatedSymbols
    chrome.runtime.onMessage.addListener((req) => {
      if (req.action === 'tab_opened') {
        date_include_left = new Date(req.date_from);
        date_include_left.setHours(0, 0, 0, 0);
        table_stats = parseDom(req.html, date_include_left, date_include_right);
        // console.log(JSON.stringify(req.html));
      }
    });
  } else {  // local dev mode
    date_include_left = new Date('Sep 10, 2024');
    table_stats = parseDom(mock, date_include_left, date_include_right);
  }
</script>

<svelte:head>
  <title>awd</title>
</svelte:head>

<IntroSection
  {date_include_left}
  {date_include_right}
/>

<MetaSection
  {table_stats}
/>
