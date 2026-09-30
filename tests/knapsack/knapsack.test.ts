import { describe, expect, it } from 'vitest';
import { knapsack } from '../../src/knapsack/knapsack';

describe('0/1 knapsack', () => {
  it('solves the classic example', () => {
    const weights = [2, 3, 4, 5];
    const values = [3, 4, 5, 6];

    expect(knapsack(weights, values, 5, true)).toBe(7);
  });

  it('zero capacity yields zero value', () => {
    expect(knapsack([1, 2, 3], [10, 20, 30], 0, true)).toBe(0);
  });

  it('cannot take an item twice', () => {
    // Only one item of weight 5 fits; the sufficient-stock variant could take it twice.
    const weights = [5];
    const values = [10];

    expect(knapsack(weights, values, 10, true)).toBe(10);
  });

  it('takes all items when capacity allows', () => {
    const weights = [1, 2, 3];
    const values = [10, 20, 30];

    expect(knapsack(weights, values, 6, true)).toBe(60);
  });
});

describe('unbounded knapsack', () => {
  it('reuses the best item to fill capacity', () => {
    const weights = [5];
    const values = [10];

    expect(knapsack(weights, values, 23, false)).toBe(40);
  });

  it('zero capacity yields zero value', () => {
    expect(knapsack([1, 2, 3], [10, 20, 30], 0, false)).toBe(0);
  });

  it('solves the classic example', () => {
    const weights = [1, 3, 4, 5];
    const values = [1, 4, 5, 7];

    expect(knapsack(weights, values, 7, false)).toBe(9);
  });
});

describe('knapsack validation', () => {
  it('throws on mismatched lengths', () => {
    expect(() => knapsack([1, 2], [1], 5)).toThrow();
  });

  it('throws on negative capacity', () => {
    expect(() => knapsack([1], [1], -1)).toThrow();
  });
});
