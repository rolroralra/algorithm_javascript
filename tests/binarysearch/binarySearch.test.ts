import { describe, expect, it } from 'vitest';
import { binarySearch } from '@/binarysearch/binarySearch';
import { mulberry32, randomInt } from '../helpers/random';

describe.each([
  ['iterative', false],
  ['recursive', true],
] as const)('binarySearch (%s) - found', (_label, recursive) => {
  it.each([1, 2, 3, 4, 5])('finds existing value %i', (target) => {
    const array = [1, 2, 3, 4, 5];
    expect(array[binarySearch(array, target, recursive)]).toBe(target);
  });

  it('handles a single-element array', () => {
    expect(binarySearch([42], 42, recursive)).toBe(0);
  });
});

describe.each([
  ['iterative', false],
  ['recursive', true],
] as const)('binarySearch (%s) - not found', (_label, recursive) => {
  it('returns a negative insertion point for a missing value', () => {
    const array = [1, 3, 5, 7, 9];

    const result = binarySearch(array, 4, recursive);

    const insertionPoint = -(result + 1);
    const withInserted = [...array.slice(0, insertionPoint), 4, ...array.slice(insertionPoint)];
    expect(withInserted).toEqual([...array, 4].sort((a, b) => a - b));
  });

  it('handles a value smaller than all elements', () => {
    expect(binarySearch([1, 2, 3], 0, recursive)).toBe(-1);
  });

  it('handles a value larger than all elements', () => {
    expect(binarySearch([1, 2, 3], 10, recursive)).toBe(-4);
  });

  it('handles an empty array', () => {
    expect(binarySearch([], 1, recursive)).toBe(-1);
  });
});

describe('binarySearch - randomized', () => {
  it.each(Array.from({ length: 10 }, (_, seed) => seed))(
    'iterative and recursive agree (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const array = Array.from({ length: 50 }, () => randomInt(random, 0, 100)).sort(
        (a, b) => a - b,
      );
      const target = randomInt(random, -10, 110);

      expect(binarySearch(array, target, false)).toBe(binarySearch(array, target, true));
    },
  );
});
