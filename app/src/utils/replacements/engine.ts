export type Operator = '<'|'<='|'=='|'!='|'>='|'>'|'between';
// The between operator uses 2 values. All other operators use 1 value.
export type Comparison = { operator:Operator; values:number[] };
// A filter is true when all of its comparisons are true.
export type AmountFilter = { comparisons:Comparison[] };
// A rule matches when the pattern matches and one filter is true. A rule with no filters matches on the pattern alone.
export type Rule = { pattern:string; filters:AmountFilter[]; replacement:string };

function notImplemented():never {
  throw new Error('Not implemented');
}

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
  return notImplemented();
}

// Returns the replacement of the first rule that matches, or null when no rule matches.
export function doReplacement(item:string, amount:number, rules:Rule[]):string|null {
  return notImplemented();
}
