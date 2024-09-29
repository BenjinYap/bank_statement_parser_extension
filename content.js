

let parse_date_str;

// create the popup
const popup = document.createElement('div');
popup.classList.add('banker', 'hidden');

// date span
const popup_date = document.createElement('span');

// button
const popup_button = document.createElement('button');
popup_button.textContent = 'Parse';
popup_button.addEventListener('click', handleClick);

popup.append('Starting from', popup_date, popup_button);

// wait for dom load
window.addEventListener('load', () => {
  // popup styles
  const style = document.createElement('style');
  style.innerText = `
    .banker {
      position:absolute;
      display:flex;
      border:1px solid #c3c3c3;
      gap:5px;
      padding:10px;
      align-items:center;
      background:white;
      border-radius:3px;
    }

    .banker.hidden {
      visibility:hidden;
    }
  `;
  document.head.appendChild(style);
  // add the popup to page, it's invisible by default
  document.body.appendChild(popup);

  // detect whenever highlight changes
  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    // whether the highlight is constrained within the table cell we want
    const valid_selection = selection.type === 'Range'
                            // this is to detect highlight via dragging vs via double clicking the text
                            && (selection.anchorNode === selection.focusNode || selection.focusOffset === 0);

    // if valid, check if it's a date
    if (valid_selection) {
      const match = selection.toString().match(/^\s*((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec) (\d+), (\d\d\d\d))\s*$/i);

      // if it's a date, show the popup
      if (match) {
        showPopup(selection.anchorNode.parentElement, selection.toString());
      }
    } else {
      // invalid selection, hide the popup
      popup.classList.add('hidden');
    }
  });
});

function showPopup (target, date_str) {
  // position the popup relative to the highlighted area
  const rect = target.getBoundingClientRect();
  popup.style.top = rect.top + window.scrollY - rect.height + 'px';
  popup.style.left = rect.left + window.scrollX + 'px';

  // set the date in the popup
  parse_date_str = date_str;
  popup_date.textContent = parse_date_str;

  popup.classList.remove('hidden');
}

function handleClick() {
  // send message to service worker to create the new tab
  chrome.runtime.sendMessage({
    action: 'new_tab',
  }, () => {
    // tab has been created
    chrome.runtime.sendMessage({
      bob: 'uncle',
    });
  });
}
