import { describe, expect, it } from 'vitest';
import { Sort, type SortAlgorithm } from '../../src/sort/sorting';
import { mulberry32, randomInt } from '../helpers/random';

const IN_PLACE_ALGORITHMS: Record<string, SortAlgorithm> = {
  selectionSort: Sort.selectionSort,
  bubbleSort: Sort.bubbleSort,
  insertionSort: Sort.insertionSort,
  shellSort: Sort.shellSort,
  mergeSort: Sort.mergeSort,
  quickSort: Sort.quickSort,
  heapSort: Sort.heapSort,
  // bucketSort distributes by value magnitude, but sorts each bucket with
  // insertionSort, so it is comparison-based just like the others here.
  bucketSort: Sort.bucketSort,
};

const NON_COMPARISON_ALGORITHMS: Record<string, (array: number[]) => number[]> = {
  countingSort: Sort.countingSort,
  radixSort: Sort.radixSort,
};

describe.each(Object.entries(IN_PLACE_ALGORITHMS))('comparison-based sort: %s', (_name, algorithm) => {
  it('sorts ascending by default', () => {
    const array = [5, 3, 8, 1, 9, 2, 7];
    algorithm(array);
    expect(array).toEqual([1, 2, 3, 5, 7, 8, 9]);
  });

  it('sorts descending with a custom comparator', () => {
    const array = [5, 3, 8, 1, 9, 2, 7];
    algorithm(array, (a, b) => a < b);
    expect(array).toEqual([9, 8, 7, 5, 3, 2, 1]);
  });

  it('handles an empty array', () => {
    const array: number[] = [];
    algorithm(array);
    expect(array).toEqual([]);
  });

  it('handles a single-element array', () => {
    const array = [42];
    algorithm(array);
    expect(array).toEqual([42]);
  });

  it('handles an array with duplicates', () => {
    const array = [4, 2, 4, 1, 2, 4];
    algorithm(array);
    expect(array).toEqual([1, 2, 2, 4, 4, 4]);
  });

  it.each(Array.from({ length: 10 }, (_, seed) => seed))(
    'matches the built-in sort on random input (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const array = Array.from({ length: 60 }, () => randomInt(random, -50, 50));
      const expected = [...array].sort((a, b) => a - b);

      algorithm(array);

      expect(array).toEqual(expected);
    },
  );
});

describe.each(Object.entries(NON_COMPARISON_ALGORITHMS))('non-comparison sort: %s', (_name, algorithm) => {
  it('sorts ascending', () => {
    const array = [5, 3, 8, 1, 9, 2, 7];
    const result = algorithm(array);
    expect(result).toEqual([1, 2, 3, 5, 7, 8, 9]);
    expect(array).toEqual([1, 2, 3, 5, 7, 8, 9]);
  });

  it('handles an empty array', () => {
    expect(algorithm([])).toEqual([]);
  });

  it('handles a single-element array', () => {
    expect(algorithm([7])).toEqual([7]);
  });

  it('handles an array with negative numbers', () => {
    const array = [-3, 5, -1, 0, 2, -8];
    expect(algorithm(array)).toEqual([...array].sort((a, b) => a - b));
  });

  it.each(Array.from({ length: 10 }, (_, seed) => seed))(
    'matches the built-in sort on random input (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const array = Array.from({ length: 60 }, () => randomInt(random, -50, 50));

      expect(algorithm(array)).toEqual([...array].sort((a, b) => a - b));
    },
  );
});

describe('non-comparison sort edge cases', () => {
  it('countingSort rejects a huge value range', () => {
    expect(() => Sort.countingSort([0, 2_000_000])).toThrow();
  });

  it('radixSort rejects an invalid base', () => {
    expect(() => Sort.radixSort([1, 2, 3], 1)).toThrow();
  });
});

describe('Sort.sort dispatcher', () => {
  it('returns an empty list for a null array', () => {
    expect(Sort.sort(null)).toEqual([]);
  });

  it('defaults to ascending quick sort', () => {
    expect(Sort.sort([3, 1, 2])).toEqual([1, 2, 3]);
  });

  it('does not mutate the input array', () => {
    const original = [3, 1, 2];
    const result = Sort.sort(original, undefined, Sort.mergeSort);

    expect(result).toEqual([1, 2, 3]);
    expect(original).toEqual([3, 1, 2]);
  });

  it('dispatches to a comparison-based algorithm', () => {
    expect(Sort.sort([3, 1, 2], undefined, Sort.bubbleSort)).toEqual([1, 2, 3]);
  });

  it('dispatches to a non-comparison algorithm', () => {
    expect(Sort.sort([3, 1, 2], undefined, Sort.countingSort)).toEqual([1, 2, 3]);
  });

  it('dispatches with a custom comparator', () => {
    const result = Sort.sort([3, 1, 2], (a, b) => a < b, Sort.selectionSort);
    expect(result).toEqual([3, 2, 1]);
  });
});

describe('Sort.swap', () => {
  it('swaps two different indices', () => {
    const array = [1, 2, 3];
    Sort.swap(array, 0, 2);
    expect(array).toEqual([3, 2, 1]);
  });

  it('is a no-op when swapping the same index', () => {
    const array = [1, 2, 3];
    Sort.swap(array, 1, 1);
    expect(array).toEqual([1, 2, 3]);
  });
});
