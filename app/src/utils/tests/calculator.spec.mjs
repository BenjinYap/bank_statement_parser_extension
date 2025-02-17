import { calculate } from "../calculator.mjs";

describe('calculator', () => {
  test('1+1', () => {
    expect(calculate('1+1')).toBe(2);
  });
  
  test('1-1', () => {
    expect(calculate('1-1')).toBe(0);
  });

  test('1*3', () => {
    expect(calculate('1*3')).toBe(3);
  });
  
  test('1.5+2.5', () => {
    expect(calculate('1.5+2.5')).toBeCloseTo(4);
  });
  
  test('1.55-0.55', () => {
    expect(calculate('1.55-0.55')).toBeCloseTo(1);
  });
  
  test('1.1+2.2-3.3', () => {
    expect(calculate('1.1+2.2-3.3')).toBeCloseTo(0, 5);
  });
  
  test('.5*2', () => {
    expect(calculate('.5*2')).toBe(1);
  });
  
  test('1+2-3*4', () => {
    expect(calculate('1+2-3*4')).toBe(-9);
  });
  
  test('9-1*2+3', () => {
    expect(calculate('9-1*2+3')).toBe(10);
  });
  
  test('7*6+5-4', () => {
    expect(calculate('7*6+5-4')).toBe(43);
  });
  
  test('8-7+6*5', () => {
    expect(calculate('8-7+6*5')).toBe(31);
  });
  
  test('2+3-4*5', () => {
    expect(calculate('2+3-4*5')).toBe(-15);
  });
  
  test('9-8+7*6', () => {
    expect(calculate('9-8+7*6')).toBe(43);
  });
  
  test('5*4+3-2', () => {
    expect(calculate('5*4+3-2')).toBe(21);
  });
  
  test('6-5+4*3', () => {
    expect(calculate('6-5+4*3')).toBe(13);
  });
  
  test('1+2-3*4', () => {
    expect(calculate('1+2-3*4')).toBe(-9);
  });
  
  test('7*6-5+4', () => {
    expect(calculate('7*6-5+4')).toBe(41);
  });

});