import { evaluate } from 'mathjs';

// Only allow digits, decimals, whitespace, brackets, and the +, -, * operators.
const ARITHMETIC_ONLY:RegExp = /^[\d\s.+\-*()]+$/;

// Resolves an amount input into a number. If the text starts with an equal
// sign, everything after it is treated as an arithmetic formula; otherwise the
// text is parsed as a plain number. Invalid input resolves to 0.
export function calculate(text:string):number {
  if (text.startsWith('=')) {
    const formula:string = text.slice(1);
    if (!ARITHMETIC_ONLY.test(formula)) {
      return 0;
    }
    try {
      const result:unknown = evaluate(formula);
      return typeof result === 'number' && isFinite(result) ? result : 0;
    } catch {
      return 0;
    }
  }
  return parseFloat(text) || 0;
}
