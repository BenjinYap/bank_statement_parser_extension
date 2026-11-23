// Maps the text of a receipt line item from Textract to the item name that the user typed.
export type LineItemName = { lineItem:string; itemName:string };

// The match is exact and ignores case. It also ignores spaces at the start and the end of the text.
function toMatchKey(lineItem:string):string {
  return lineItem.trim().toLowerCase();
}

export function isSameLineItem(first:string, second:string):boolean {
  return toMatchKey(first) === toMatchKey(second);
}

// Returns undefined when no entry matches.
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
  const entriesByKey:Map<string, LineItemName> = new Map();
  for (const entry of lineItemNames) {
    entriesByKey.set(toMatchKey(entry.lineItem), entry);
  }
  for (const newEntry of newEntries) {
    entriesByKey.set(toMatchKey(newEntry.lineItem), { lineItem: newEntry.lineItem.trim(), itemName: newEntry.itemName });
  }
  return sortLineItemNames([...entriesByKey.values()]);
}
