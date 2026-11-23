// Maps the text of a receipt line item from Textract to the item name that the user typed.
export type LineItemName = { lineItem:string; itemName:string };

function isSameLineItem(first:string, second:string):boolean {
  return first.trim().toLowerCase() === second.trim().toLowerCase();
}

// The match is exact and ignores case. Returns undefined when no entry matches.
export function findItemName(lineItemNames:LineItemName[], lineItem:string):string|undefined {
  return lineItemNames.find(entry => isSameLineItem(entry.lineItem, lineItem))?.itemName;
}

export function sortLineItemNames(lineItemNames:LineItemName[]):LineItemName[] {
  return [...lineItemNames].sort((first, second) => {
    return first.lineItem.localeCompare(second.lineItem, undefined, { sensitivity: 'base' });
  });
}

// A new entry replaces the old entry for the same line item. If newEntries has the same line item more than once,
// the last entry wins. The result is sorted by line item.
export function recordLineItemNames(lineItemNames:LineItemName[], newEntries:LineItemName[]):LineItemName[] {
  let result:LineItemName[] = lineItemNames;
  for (const newEntry of newEntries) {
    result = result.filter(entry => !isSameLineItem(entry.lineItem, newEntry.lineItem));
    result.push({ lineItem: newEntry.lineItem.trim(), itemName: newEntry.itemName });
  }
  return sortLineItemNames(result);
}
