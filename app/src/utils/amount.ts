import { calculate } from './calculator';

// Sales tax percentage applied to the resolved amount (13% => 1.13x).
export const TAX_PERCENT:number = 13;

// Resolves an amount input (evaluating any formula first) and, unless tax is
// skipped, multiplies it by the tax rate and rounds to the nearest cent.
export function resolveAmount(text:string, applyTax:boolean = true):number {
  let amount:number = calculate(text);
  if (applyTax) {
    // Apply tax in integer-cent arithmetic. Multiplying by 1.13 directly is
    // inexact (1.13 has no exact float), which rounds exact half-cents like
    // 42.5 -> 48.03 down a penny; using (100 + TAX_PERCENT) keeps it exact.
    const cents:number = Math.round(amount * 100);
    const taxedCents:number = Math.round((cents * (100 + TAX_PERCENT)) / 100);
    amount = taxedCents / 100;
  }
  return amount;
}
