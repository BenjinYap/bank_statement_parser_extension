import { describe, expect, it } from 'vitest';
import { doReplacement } from '../../src/utils/replacements';

const DATE = new Date('2024-01-15');

describe('doReplacement', () => {
  describe('string conditions', () => {
    it('returns the replacement when the string matches (case-insensitive)', () => {
      const map = { 'Food': ['noodlebox'] };
      expect(doReplacement(DATE, 'NOODLEBOX WATERLOO', 12.50, map)).toBe('Food');
    });

    it('returns the replacement when the string matches as a substring', () => {
      const map = { 'Food': ['noodlebox'] };
      expect(doReplacement(DATE, 'PURCHASE AT NOODLEBOX', 12.50, map)).toBe('Food');
    });

    it('returns null when no string condition matches', () => {
      const map = { 'Food': ['noodlebox'] };
      expect(doReplacement(DATE, 'STARBUCKS', 5.00, map)).toBeNull();
    });

    it('matches the first entry and stops', () => {
      const map = { 'A': ['foo'], 'B': ['foo'] };
      expect(doReplacement(DATE, 'foo', 1.00, map)).toBe('A');
    });
  });

  describe('tuple [string, filter] conditions', () => {
    it('returns the replacement when the regex matches and the filter returns true', () => {
      const map = { 'Drinks to go': [['esso circle', (date:Date, item:string, amount:number) => amount < 10] as [string, (d:Date, i:string, a:number) => boolean]] };
      expect(doReplacement(DATE, 'ESSO CIRCLE 123', 5.00, map)).toBe('Drinks to go');
    });

    it('returns null when the regex matches but the filter returns false', () => {
      const map = { 'Drinks to go': [['esso circle', (date:Date, item:string, amount:number) => amount < 10] as [string, (d:Date, i:string, a:number) => boolean]] };
      expect(doReplacement(DATE, 'ESSO CIRCLE 123', 15.00, map)).toBeNull();
    });

    it('returns null when the filter returns true but the regex does not match', () => {
      const map = { 'Drinks to go': [['esso circle', () => true] as [string, () => boolean]] };
      expect(doReplacement(DATE, 'TIM HORTONS', 3.14, map)).toBeNull();
    });

    it('falls through to the next condition when the tuple does not match', () => {
      const map = {
        'Drinks to go': [
          ['esso circle', (date:Date, item:string, amount:number) => amount < 10] as [string, (d:Date, i:string, a:number) => boolean],
          'tim hortons',
        ],
      };
      expect(doReplacement(DATE, 'TIM HORTONS', 3.14, map)).toBe('Drinks to go');
    });

    it('passes date and item to the filter', () => {
      let capturedDate:Date|undefined;
      let capturedItem:string|undefined;
      const map = {
        'X': [['foo', (d:Date, i:string) => { capturedDate = d; capturedItem = i; return true; }] as [string, (d:Date, i:string) => boolean]],
      };
      doReplacement(DATE, 'foo bar', 9.99, map);
      expect(capturedDate).toBe(DATE);
      expect(capturedItem).toBe('foo bar');
    });
  });
});
