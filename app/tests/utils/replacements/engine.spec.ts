import { describe, expect, it } from 'vitest';
import { OPERATORS, doReplacement, type Rule } from '../../../src/utils/replacements/engine';

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

describe('doReplacement', () => {
  it('returns null when there are no rules', () => {
    expect(doReplacement('Coffee', 5, [])).toBe(null);
  });

  it('returns null when the pattern does not match the item', () => {
    const rules:Rule[] = [{ pattern: 'Coffee', comparisons: [], replacement: 'Drinks' }];
    expect(doReplacement('Grocery', 5, rules)).toBe(null);
  });

  it('returns the replacement when the pattern matches and there are no comparisons', () => {
    const rules:Rule[] = [{ pattern: 'Coffee', comparisons: [], replacement: 'Drinks' }];
    expect(doReplacement('Coffee', 5, rules)).toBe('Drinks');
  });

  it('returns the replacement when the pattern and the item have different letter case', () => {
    const rules:Rule[] = [{ pattern: 'coffee', comparisons: [], replacement: 'Drinks' }];
    expect(doReplacement('COFFEE', 5, rules)).toBe('Drinks');
  });

  it('returns the replacement when the item contains the pattern', () => {
    const rules:Rule[] = [{ pattern: 'Coffee', comparisons: [], replacement: 'Drinks' }];
    expect(doReplacement('Blue Coffee Shop #12', 5, rules)).toBe('Drinks');
  });

  it('returns null when the pattern matches but the comparison fails', () => {
    const rules:Rule[] = [{
      pattern: 'Coffee',
      comparisons: [{ operator: '>', values: [10] }],
      replacement: 'Drinks',
    }];
    expect(doReplacement('Coffee', 5, rules)).toBe(null);
  });

  it('returns the replacement when the pattern matches and the comparison passes', () => {
    const rules:Rule[] = [{
      pattern: 'Coffee',
      comparisons: [{ operator: '>', values: [10] }],
      replacement: 'Drinks',
    }];
    expect(doReplacement('Coffee', 15, rules)).toBe('Drinks');
  });

  it('returns the second replacement when only the second rule matches', () => {
    const rules:Rule[] = [
      { pattern: 'Coffee', comparisons: [], replacement: 'Drinks' },
      { pattern: 'Grocery', comparisons: [], replacement: 'Food' },
    ];
    expect(doReplacement('Grocery', 5, rules)).toBe('Food');
  });

  it('returns the first replacement when both rules match', () => {
    const rules:Rule[] = [
      { pattern: 'Coffee', comparisons: [], replacement: 'Drinks' },
      { pattern: 'Coffee', comparisons: [], replacement: 'Cafe' },
    ];
    expect(doReplacement('Coffee', 5, rules)).toBe('Drinks');
  });

  it('returns null when only 1 of 2 comparisons passes', () => {
    const rules:Rule[] = [{
      pattern: 'Coffee',
      comparisons: [{ operator: '>', values: [10] }, { operator: '<', values: [20] }],
      replacement: 'Drinks',
    }];
    expect(doReplacement('Coffee', 25, rules)).toBe(null);
  });

  it('returns the replacement when 2 of 2 comparisons pass', () => {
    const rules:Rule[] = [{
      pattern: 'Coffee',
      comparisons: [{ operator: '>', values: [10] }, { operator: '<', values: [20] }],
      replacement: 'Drinks',
    }];
    expect(doReplacement('Coffee', 15, rules)).toBe('Drinks');
  });
});
