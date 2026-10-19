import { describe, expect, it } from 'vitest';
import { resolveAmount } from '../../src/utils/amount';

describe('resolveAmount', () => {
  it('adds tax to a plain number by default', () => {
    expect(resolveAmount('42.5')).toBe(48.03);
  });

  it('returns the raw amount when tax is skipped', () => {
    expect(resolveAmount('42.5', false)).toBe(42.5);
  });

  it('evaluates a formula and then adds tax', () => {
    expect(resolveAmount('=12.5 + 3 * 2')).toBe(20.91);
  });

  it('returns 0 for invalid input', () => {
    expect(resolveAmount('abc')).toBe(0);
    expect(resolveAmount('abc', false)).toBe(0);
  });
});
