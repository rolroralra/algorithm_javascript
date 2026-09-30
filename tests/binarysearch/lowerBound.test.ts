import { describe, expect, it } from 'vitest';
import { lowerBound } from '../../src/binarysearch/lowerBound';
import { bruteForceLowerBound } from '../helpers/bisect';
import { mulberry32, randomInt } from '../helpers/random';

describe('lowerBound', () => {
  it('returns the index of the first matching element', () => {
    expect(lowerBound([1, 2, 2, 2, 3], 2)).toBe(1);
  });

  it('returns 0 when the target is smaller than all elements', () => {
    expect(lowerBound([5, 6, 7], 1)).toBe(0);
  });

  it('returns the array length when the target is larger than all elements', () => {
    expect(lowerBound([5, 6, 7], 10)).toBe(3);
  });

  it('returns the next-greater index when the target sits between elements', () => {
    expect(lowerBound([1, 3, 5, 7], 4)).toBe(2);
  });

  it('returns 0 for an empty array', () => {
    expect(lowerBound([], 5)).toBe(0);
  });

  it.each(Array.from({ length: 10 }, (_, seed) => seed))(
    'matches the brute-force bisect_left (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const array = Array.from({ length: 50 }, () => randomInt(random, 0, 20)).sort(
        (a, b) => a - b,
      );
      const target = randomInt(random, -5, 25);

      expect(lowerBound(array, target)).toBe(bruteForceLowerBound(array, target));
    },
  );
});
