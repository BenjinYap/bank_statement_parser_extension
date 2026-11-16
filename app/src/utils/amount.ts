import { calculate } from './calculator';

// Sales tax percentage applied to the resolved amount (13% => 1.13x).
export const TAX_PERCENT:number = 13;

// Adds TAX_PERCENT to the amount and rounds to the nearest cent.
export function applyTax(amount:number):number {
  // Apply tax in integer-cent arithmetic. Multiplying by 1.13 directly is
  // inexact (1.13 has no exact float), which rounds exact half-cents like
  // 42.5 -> 48.03 down a penny; using (100 + TAX_PERCENT) keeps it exact.
  const cents:number = Math.round(amount * 100);
  const taxedCents:number = Math.round((cents * (100 + TAX_PERCENT)) / 100);
  return taxedCents / 100;
}

// Evaluates the formula in the text. Applies tax unless shouldApplyTax is false.
export function resolveAmount(text:string, shouldApplyTax:boolean = true):number {
  const amount:number = calculate(text);
  if (!shouldApplyTax) {
    return amount;
  }

  return applyTax(amount);
}
