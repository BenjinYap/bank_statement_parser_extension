import type { Comparison, Rule } from './engine';

export type ItemPattern = { pattern:string; comparisons:Comparison[] };
export type ItemReplacement = { replacement:string; patterns:ItemPattern[] };

// The between operator uses 2 values. All other operators use 1 value.
function hasAllValues(comparison:Comparison):boolean {
  const requiredCount:number = comparison.operator === 'between' ? 2 : 1;
  const values:number[] = comparison.values.slice(0, requiredCount);
  return values.length === requiredCount && values.every(Number.isFinite);
}

// A pattern with no comparisons still has one table row.
export function getRowCount(itemPattern:ItemPattern):number {
  return Math.max(itemPattern.comparisons.length, 1);
}

// Rules with the same replacement go into one group, at the position of the first of those rules.
export function toItemReplacements(rules:Rule[]):ItemReplacement[] {
  const patternsByReplacement:Map<string, ItemPattern[]> = new Map();

  for (const rule of rules) {
    const patterns:ItemPattern[] = patternsByReplacement.get(rule.replacement) ?? [];
    patterns.push({ pattern: rule.pattern, comparisons: rule.comparisons });
    patternsByReplacement.set(rule.replacement, patterns);
  }

  return Array.from(patternsByReplacement, ([replacement, patterns]) => ({ replacement, patterns }));
}

// Skips empty replacements and empty patterns, because in the engine an empty pattern matches all items.
// Also skips comparisons that do not have all their values.
export function toRules(itemReplacements:ItemReplacement[]):Rule[] {
  return itemReplacements
    .filter(itemReplacement => itemReplacement.replacement !== '')
    .flatMap(itemReplacement => itemReplacement.patterns
      .filter(itemPattern => itemPattern.pattern !== '')
      .map(itemPattern => ({
        pattern: itemPattern.pattern,
        comparisons: itemPattern.comparisons.filter(hasAllValues),
        replacement: itemReplacement.replacement,
      })));
}
