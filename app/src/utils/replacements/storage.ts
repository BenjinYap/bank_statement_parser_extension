import type { Rule } from './engine';
import { sortLineItemNames, type LineItemName } from './lineItems';
import { getObject, putObject } from '../s3';

const REPLACEMENTS_KEY = 'replacements.json';

export type Replacements = { itemRules:Rule[]; categoryRules:Rule[]; lineItemNames:LineItemName[] };

export async function loadReplacements():Promise<Replacements> {
  const body:string = await getObject(REPLACEMENTS_KEY);
  const replacements:Partial<Replacements> = JSON.parse(body);
  // Files from before the line item names existed do not have the lineItemNames key.
  return {
    itemRules: replacements.itemRules ?? [],
    categoryRules: replacements.categoryRules ?? [],
    lineItemNames: sortLineItemNames(replacements.lineItemNames ?? []),
  };
}

export async function saveReplacements(replacements:Replacements) {
  await putObject(REPLACEMENTS_KEY, JSON.stringify(replacements, null, 2));
}
