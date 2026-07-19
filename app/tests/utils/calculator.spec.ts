import { describe, expect, it } from 'vitest';
import { calculate } from '../../src/utils/calculator';

describe('calculate', () => {
  describe('plain numbers', () => {
    it('parses a plain number', () => {
      expect(calculate('42.5')).toBe(42.5);
    });

    it('returns 0 for text that is not a number', () => {
      expect(calculate('abc')).toBe(0);
    });
  });

  describe('formulas', () => {
    it('evaluates a formula when the text starts with an equal sign', () => {
      expect(calculate('=12.5 + 3 * 2')).toBe(18.5);
    });

    it('evaluates brackets with add, subtract, and multiply', () => {
      expect(calculate('=(10 - 2) * 3 + 1')).toBe(25);
    });

    it('rejects operators other than add, subtract, and multiply', () => {
      expect(calculate('=10 / 2')).toBe(0);
    });

    it('rejects a formula that calls a function', () => {
      expect(calculate('=sqrt(16)')).toBe(0);
    });

    it('returns 0 for an invalid formula', () => {
      expect(calculate('=1 +')).toBe(0);
    });
  });
});
