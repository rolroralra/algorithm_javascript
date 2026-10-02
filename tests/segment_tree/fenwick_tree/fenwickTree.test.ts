import { describe, expect, it } from 'vitest';
import { FenwickTree } from '@/segment_tree/fenwick_tree/fenwickTree';
import { mulberry32, randomInt } from '../../helpers/random';

/** `values` is 0-indexed; the tree itself is 1-indexed. */
function buildTree(values: number[]): FenwickTree {
  const tree = new FenwickTree(values.length);
  values.forEach((value, index) => tree.update(index + 1, value));
  return tree;
}

describe('FenwickTree', () => {
  it('sums the full range', () => {
    const tree = buildTree([1, 2, 3, 4, 5]);
    expect(tree.query(1, 5)).toBe(15);
  });

  it('sums a partial range', () => {
    const tree = buildTree([1, 2, 3, 4, 5]);
    expect(tree.query(2, 4)).toBe(9);
  });

  it('queries a single index', () => {
    const tree = buildTree([1, 2, 3, 4, 5]);
    expect(tree.query(3, 3)).toBe(3);
  });

  it('update adds the diff instead of replacing', () => {
    const tree = buildTree([1, 2, 3, 4, 5]);
    tree.update(3, 10);

    expect(tree.query(3, 3)).toBe(13);
    expect(tree.query(1, 5)).toBe(25);
  });

  it.each(Array.from({ length: 5 }, (_, seed) => seed))(
    'matches naive prefix sums (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const values = Array.from({ length: 20 }, () => randomInt(random, -20, 20));
      const tree = buildTree(values);

      for (let i = 0; i < 20; i += 1) {
        const left = randomInt(random, 1, 20);
        const right = randomInt(random, left, 20);

        const expected = values.slice(left - 1, right).reduce((sum, v) => sum + v, 0);
        expect(tree.query(left, right)).toBe(expected);
      }
    },
  );
});
