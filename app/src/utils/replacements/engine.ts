export type Operator = '<'|'<='|'=='|'!='|'>='|'>'|'between';
// The between operator uses 2 values. All other operators use 1 value.
export type Comparison = { operator:Operator; values:number[] };
// A rule matches when the pattern matches and all comparisons are true. A rule with no comparisons matches on the pattern alone.
export type Rule = { pattern:string; comparisons:Comparison[]; replacement:string };

export const OPERATORS:Record<Operator, (amount:number, values:number[]) => boolean> = {
  '<': (amount, values) => amount < values[0],
  '<=': (amount, values) => amount <= values[0],
  '==': (amount, values) => amount === values[0],
  '!=': (amount, values) => amount !== values[0],
  '>=': (amount, values) => amount >= values[0],
  '>': (amount, values) => amount > values[0],
  'between': (amount, values) => {
    if (values.length < 2) {
      throw new Error('between needs 2 values');
    }
    return amount >= values[0] && amount <= values[1];
  },
};

function matchesRule(item:string, amount:number, rule:Rule):boolean {
  if (!item.toLowerCase().includes(rule.pattern.toLowerCase())) {
    return false;
  }

  return rule.comparisons.every(comparison => {
    return OPERATORS[comparison.operator](amount, comparison.values);
  });
}

// Returns the replacement of the first rule that matches, or null when no rule matches.
export function doReplacement(item:string, amount:number, rules:Rule[]):string|null {
  for (const rule of rules) {
    if (matchesRule(item, amount, rule)) {
      return rule.replacement;
    }
  }

  return null;
}
