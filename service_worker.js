let new_tab_id;
let send_response;

// noinspection JSUnresolvedReference,JSDeprecatedSymbols
chrome.tabs.onUpdated.addListener((tab_id, changed) => {
  // check that the newly opened tab has completed loading
  if (tab_id === new_tab_id && changed.status === 'complete') {
    // do callback for the popup
    send_response();
  }
});

// noinspection JSUnresolvedReference,JSDeprecatedSymbols
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // got message from popup
    // figure out the current tab index
    if (request.action === 'new_tab') {
      // noinspection JSUnresolvedReference,JSIgnoredPromiseFromCall
      chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        if (tabs.length > 0) {
          const tab = tabs[0];

          // create the extension tab
          // noinspection JSUnresolvedReference
          const new_tab = await chrome.tabs.create({
            active: true,
            index: tab.index + 1,
            // url: chrome.runtime.getURL('tab/tab.html'),
            url: chrome.runtime.getURL('app/dist/index.html'),
          });

          // remember important things so we can call after tab loads
          new_tab_id = new_tab.id;
          send_response = sendResponse;
        }
      });
      return true;
    }
  }
);
