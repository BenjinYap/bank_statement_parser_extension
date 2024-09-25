chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    const awd = document.querySelector('.treetop').innerHTML;
    sendResponse(awd);
  }
);
