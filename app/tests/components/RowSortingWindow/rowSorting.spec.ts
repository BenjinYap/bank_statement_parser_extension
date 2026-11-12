import { describe, expect, it } from 'vitest';
import { sortRows } from '../../../src/components/RowSortingWindow/rowSorting';

describe('sortRows', () => {
  it('returns an empty array when rows is empty', () => {
    expect(sortRows([])).toEqual([]);
  });

  it('returns the same row when rows has one row', () => {
    expect(sortRows(['2024-03-15\tCoffee\t4.50'])).toEqual(['2024-03-15,Coffee,4.50']);
  });

  it('returns rows in ascending date order when rows start with a yyyy-mm-dd value', () => {
    const rows:string[] = [
      '2024-03-15\tCoffee\t4.50',
      '2024-01-02\tRent\t1200.00',
    ];

    expect(sortRows(rows)).toEqual([
      '2024-01-02,Rent,1200.00',
      '2024-03-15,Coffee,4.50',
    ]);
  });

  it('preserves the order of rows that have the same date', () => {
    const rows:string[] = [
      '2024-03-15\tFirst March\t1.00',
      '2024-01-02\tFirst January\t2.00',
      '2024-03-15\tSecond March\t3.00',
      '2024-01-02\tSecond January\t4.00',
    ];

    expect(sortRows(rows)).toEqual([
      '2024-01-02,First January,2.00',
      '2024-01-02,Second January,4.00',
      '2024-03-15,First March,1.00',
      '2024-03-15,Second March,3.00',
    ]);
  });

  it('returns rows without a valid starting yyyy-mm-dd value before rows with a date', () => {
    const rows:string[] = [
      '2024-01-02\tRent\t1200.00',
      'Date\tDescription\tAmount',
    ];

    expect(sortRows(rows)).toEqual([
      'Date,Description,Amount',
      '2024-01-02,Rent,1200.00',
    ]);
  });

  it('preserves the order of rows without a valid starting yyyy-mm-dd value', () => {
    const rows:string[] = [
      '2024-01-02\tRent\t1200.00',
      'Date\tDescription\tAmount',
      '15/03/2024\tCoffee\t4.50',
      'Total\t\t1204.50',
    ];

    expect(sortRows(rows)).toEqual([
      'Date,Description,Amount',
      '15/03/2024,Coffee,4.50',
      'Total,,1204.50',
      '2024-01-02,Rent,1200.00',
    ]);
  });

  it('returns rows in ascending date order when the dates are in different years', () => {
    const rows:string[] = [
      '2024-01-01\tNew Year\t10.00',
      '2023-12-31\tOld Year\t20.00',
    ];

    expect(sortRows(rows)).toEqual([
      '2023-12-31,Old Year,20.00',
      '2024-01-01,New Year,10.00',
    ]);
  });

  it('removes empty rows', () => {
    const rows:string[] = [
      '2024-01-02\tRent\t1200.00',
      '',
      '2024-03-15\tCoffee\t4.50',
      '',
    ];

    expect(sortRows(rows)).toEqual([
      '2024-01-02,Rent,1200.00',
      '2024-03-15,Coffee,4.50',
    ]);
  });

  it('returns a row before rows with a date when its first value has characters after the date', () => {
    const rows:string[] = [
      '2024-01-02\tRent\t1200.00',
      '2024-01-02x\tTypo\t5.00',
    ];

    expect(sortRows(rows)).toEqual([
      '2024-01-02x,Typo,5.00',
      '2024-01-02,Rent,1200.00',
    ]);
  });

  it('returns a row before rows with a date when its first value is not a real calendar date', () => {
    const rows:string[] = [
      '2024-01-02\tRent\t1200.00',
      '2024-13-45\tImpossible\t5.00',
    ];

    expect(sortRows(rows)).toEqual([
      '2024-13-45,Impossible,5.00',
      '2024-01-02,Rent,1200.00',
    ]);
  });

  it('does not modify the rows array of the caller', () => {
    const rows:string[] = [
      '2024-03-15\tCoffee\t4.50',
      '',
      '2024-01-02\tRent\t1200.00',
    ];

    sortRows(rows);

    expect(rows).toEqual([
      '2024-03-15\tCoffee\t4.50',
      '',
      '2024-01-02\tRent\t1200.00',
    ]);
  });
});
