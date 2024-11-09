<script>
  import IntroSection from "./components/sections/IntroSection.svelte";
  import { mock } from './mock.mjs';

  let request;

  let date_include_left;
  let date_include_right = new Date();
  date_include_right.setHours(-1, 0, 0, 0);

  // running in real extension mode
  // noinspection JSUnresolvedReference,JSDeprecatedSymbols
  if (chrome.runtime) {
    // noinspection JSUnresolvedReference,JSDeprecatedSymbols
    chrome.runtime.onMessage.addListener((req) => {
      if (req.action === 'tab_opened') {
        date_include_left = new Date(request.date_from);
        date_include_left.setHours(0, 0, 0, 0);

        // console.log(JSON.stringify(req.html));
      }
    });
  } else {  // local dev mode
    date_include_left = new Date('Sep 10, 2024');
  }
</script>

<svelte:head>
  <title>awd</title>
</svelte:head>

<IntroSection
  {date_include_left}
  {date_include_right}
/>
