import type { EditTransaction } from '../../models/EditTransaction';
import type { LineItemResult } from '../textract';
import { applyTax } from '../amount';

// Groups the named line items by item name, in the order of the first assignment of each name.
// The category is empty, because the category rules set it later.
// itemNames maps a line item index to its item name. Line items without a name are not in the map.
export function toEditTransactions(lineItems:LineItemResult[], itemNames:Map<number, string>):EditTransaction[] {
  const centsByItem:Map<string, number> = new Map();

  for (const [index, item] of itemNames) {
    const lineItem:LineItemResult|undefined = lineItems[index];
    if (lineItem === undefined) {
      continue;
    }

    // Sum in integer cents, because float addition of prices is not exact.
    const cents:number = Math.round(lineItem.price.amount * 100);
    centsByItem.set(item, (centsByItem.get(item) ?? 0) + cents);
  }

  return Array.from(centsByItem, ([item, cents]) => {
    const amount:number = applyTax(cents / 100);
    return { category: '', item, amount };
  });
}
