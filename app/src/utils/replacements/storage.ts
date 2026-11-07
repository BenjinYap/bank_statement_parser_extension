import type { Rule } from './engine';
import { getObject, putObject } from '../s3';

const REPLACEMENTS_KEY = 'replacements.json';

export type Replacements = { itemRules:Rule[]; categoryRules:Rule[] };

export async function loadReplacements():Promise<Replacements> {
  const body:string = await getObject(REPLACEMENTS_KEY);
  return JSON.parse(body) as Replacements;
}

export async function saveReplacements(replacements:Replacements) {
  await putObject(REPLACEMENTS_KEY, JSON.stringify(replacements, null, 2));
}
