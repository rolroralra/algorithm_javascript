import { describe, expect, it, vi } from 'vitest';
import { SegmentTree, type BinaryOperator } from '@/segment_tree/segmentTree';
import { mulberry32, randomInt } from '../helpers/random';

const THRESHOLD = SegmentTree.LOOP_THRESHOLD_SIZE;

/**
 * The tree picks its update/query strategy from `size`, so every behavioral test runs
 * once per strategy. `capacity` is the tree size that forces that strategy; values are
 * written to the front of the tree and the remaining slots stay at `identity`.
 */
const STRATEGIES = [
  { name: 'recursive', capacity: THRESHOLD },
  { name: 'loop', capacity: THRESHOLD + 1 },
] as const;

function buildTree<T>(
  capacity: number,
  values: readonly T[],
  operator?: BinaryOperator<T>,
  identity?: T,
): SegmentTree<T> {
  const tree = new SegmentTree<T>(capacity, operator, identity);
  values.forEach((value, index) => tree.update(index, value));
  return tree;
}

function bruteForce<T>(values: readonly T[], start: number, end: number, operator: BinaryOperator<T>, identity: T): T {
  // Wrap `operator`: reduce also passes (index, array), which breaks variadic ops like Math.min.
  return values.slice(start, end + 1).reduce((acc, value) => operator(acc, value), identity);
}

describe('SegmentTree strategy selection', () => {
  it.each([
    { size: 1, expected: 'recursive' },
    { size: THRESHOLD, expected: 'recursive' },
    { size: THRESHOLD + 1, expected: 'loop' },
  ])('size $size uses the $expected strategy', ({ size, expected }) => {
    const tree = new SegmentTree<number>(size);
    // TS `private` is compile-time only, so the methods can be spied on at runtime.
    const spyTarget = tree as unknown as Record<string, (...args: unknown[]) => unknown>;
    const updateByLoop = vi.spyOn(spyTarget, 'updateByLoop');
    const updateByRecursive = vi.spyOn(spyTarget, 'updateByRecursive');
    const queryNodeByLoop = vi.spyOn(spyTarget, 'queryNodeByLoop');
    const queryNodeByRecursive = vi.spyOn(spyTarget, 'queryNodeByRecursive');

    tree.update(0, 1);
    tree.query(0, 0);

    // Recursive calls also go through the spy, so assert called / not called rather than counts.
    const usesLoop = expected === 'loop';
    expect(updateByLoop.mock.calls.length > 0).toBe(usesLoop);
    expect(queryNodeByLoop.mock.calls.length > 0).toBe(usesLoop);
    expect(updateByRecursive.mock.calls.length > 0).toBe(!usesLoop);
    expect(queryNodeByRecursive.mock.calls.length > 0).toBe(!usesLoop);
  });
});

describe.each(STRATEGIES)('SegmentTree ($name strategy)', ({ capacity }) => {
  describe('sum query', () => {
    const values = [1, 2, 3, 4, 5];

    it('sums the populated range', () => {
      expect(buildTree(capacity, values).query(0, 4)).toBe(15);
    });

    it('sums a partial range', () => {
      expect(buildTree(capacity, values).query(1, 3)).toBe(9);
    });

    it('sums a single-element range', () => {
      expect(buildTree(capacity, values).query(2, 2)).toBe(3);
    });

    it('sums the whole capacity, treating unset slots as identity', () => {
      expect(buildTree(capacity, values).query(0, capacity - 1)).toBe(15);
    });

    it('reflects an update in subsequent queries', () => {
      const tree = buildTree(capacity, values);
      tree.update(2, 100);

      expect(tree.query(0, 4)).toBe(1 + 2 + 100 + 4 + 5);
      expect(tree.query(2, 2)).toBe(100);
    });

    it('reads and writes the last index of the capacity', () => {
      const tree = buildTree(capacity, values);
      tree.update(capacity - 1, 7);

      expect(tree.query(capacity - 1, capacity - 1)).toBe(7);
      expect(tree.query(0, capacity - 1)).toBe(22);
    });
  });

  describe('min operator', () => {
    const values = [5, 3, 8, 1, 9];

    it('finds the minimum in a range', () => {
      const tree = buildTree(capacity, values, Math.min, Infinity);

      expect(tree.query(0, 4)).toBe(1);
      expect(tree.query(0, 1)).toBe(3);
      expect(tree.query(3, 4)).toBe(1);
    });

    it('reflects an update in the minimum', () => {
      const tree = buildTree(capacity, values, Math.min, Infinity);
      tree.update(3, 100);

      expect(tree.query(0, 4)).toBe(3);
    });
  });

  describe('max operator', () => {
    it('finds the maximum in a range', () => {
      const tree = buildTree(capacity, [5, 3, 8, 1, 9], Math.max, -Infinity);

      expect(tree.query(0, 4)).toBe(9);
      expect(tree.query(0, 2)).toBe(8);
    });

    it('keeps a stored 0 instead of replacing it with identity', () => {
      const tree = buildTree(capacity, [-5, 0, -3], Math.max, -Infinity);

      expect(tree.query(0, 2)).toBe(0);
      expect(tree.query(1, 1)).toBe(0);
    });
  });

  describe('randomized cross-check against brute force', () => {
    it.each([
      { label: 'sum', operator: (a: number, b: number) => a + b, identity: 0 },
      { label: 'min', operator: Math.min, identity: Infinity },
      { label: 'max', operator: Math.max, identity: -Infinity },
    ])('matches brute force for $label', ({ operator, identity }) => {
      const random = mulberry32(capacity);
      const tree = new SegmentTree<number>(capacity, operator, identity);
      let values: readonly number[] = new Array<number>(capacity).fill(identity);

      for (let step = 0; step < 300; step++) {
        const index = randomInt(random, 0, capacity - 1);
        const value = randomInt(random, -1000, 1000);
        tree.update(index, value);
        values = values.map((current, i) => (i === index ? value : current));

        const start = randomInt(random, 0, capacity - 1);
        const end = randomInt(random, start, capacity - 1);
        expect(tree.query(start, end)).toBe(bruteForce(values, start, end, operator, identity));
      }
    });
  });
});
