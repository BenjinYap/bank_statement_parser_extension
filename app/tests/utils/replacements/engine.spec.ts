import { describe, expect, it } from 'vitest';
import { OPERATORS } from '../../../src/utils/replacements/engine';

describe('OPERATORS', () => {
  describe('<', () => {
    it('returns true when the amount is less than the value', () => {
      expect(OPERATORS['<'](5, [10])).toBe(true);
    });

    it('returns false when the amount is equal to the value', () => {
      expect(OPERATORS['<'](10, [10])).toBe(false);
    });
  });

  describe('<=', () => {
    it('returns true when the amount is equal to the value', () => {
      expect(OPERATORS['<='](10, [10])).toBe(true);
    });

    it('returns false when the amount is greater than the value', () => {
      expect(OPERATORS['<='](11, [10])).toBe(false);
    });
  });

  describe('==', () => {
    it('returns true when the amount is equal to the value', () => {
      expect(OPERATORS['=='](6.22, [6.22])).toBe(true);
    });

    it('returns false when the amount is not equal to the value', () => {
      expect(OPERATORS['=='](6.23, [6.22])).toBe(false);
    });
  });

  describe('!=', () => {
    it('returns true when the amount is not equal to the value', () => {
      expect(OPERATORS['!='](6.23, [6.22])).toBe(true);
    });

    it('returns false when the amount is equal to the value', () => {
      expect(OPERATORS['!='](6.22, [6.22])).toBe(false);
    });
  });

  describe('>=', () => {
    it('returns true when the amount is equal to the value', () => {
      expect(OPERATORS['>='](10, [10])).toBe(true);
    });

    it('returns false when the amount is less than the value', () => {
      expect(OPERATORS['>='](9, [10])).toBe(false);
    });
  });

  describe('>', () => {
    it('returns true when the amount is greater than the value', () => {
      expect(OPERATORS['>'](11, [10])).toBe(true);
    });

    it('returns false when the amount is equal to the value', () => {
      expect(OPERATORS['>'](10, [10])).toBe(false);
    });
  });

  describe('between', () => {
    it('returns true when the amount is between the values', () => {
      expect(OPERATORS['between'](7, [5, 10])).toBe(true);
    });

    it('returns false when the amount is greater than the upper value', () => {
      expect(OPERATORS['between'](11, [5, 10])).toBe(false);
    });

    it('throws an error when there are fewer than 2 values', () => {
      expect(() => OPERATORS['between'](7, [5])).toThrow();
    });
  });
});
