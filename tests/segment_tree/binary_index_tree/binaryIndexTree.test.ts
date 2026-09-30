import { describe, expect, it } from 'vitest';
import { BinaryIndexTree } from '../../../src/segment_tree/binary_index_tree/binaryIndexTree';
import { mulberry32, randomInt } from '../../helpers/random';

function buildTree(values: number[]): BinaryIndexTree {
  const tree = new BinaryIndexTree(values.length);
  values.forEach((value, index) => tree.update(index, value));
  return tree;
}

describe('BinaryIndexTree', () => {
  it('sums the full range', () => {
    const tree = buildTree([1, 2, 3, 4, 5]);
    expect(tree.query(0, 4)).toBe(15);
  });

  it('sums a partial range', () => {
    const tree = buildTree([1, 2, 3, 4, 5]);
    expect(tree.query(1, 3)).toBe(9);
  });

  it('queries a single index', () => {
    const tree = buildTree([1, 2, 3, 4, 5]);
    expect(tree.query(2, 2)).toBe(3);
  });

  it('reflects an update in subsequent queries', () => {
    const tree = buildTree([1, 2, 3, 4, 5]);
    tree.update(2, 100);

    expect(tree.query(0, 4)).toBe(1 + 2 + 100 + 4 + 5);
  });

  it.each(Array.from({ length: 5 }, (_, seed) => seed))(
    'matches naive prefix sums (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const values = Array.from({ length: 20 }, () => randomInt(random, -20, 20));
      const tree = buildTree(values);

      for (let i = 0; i < 20; i += 1) {
        const left = randomInt(random, 0, 19);
        const right = randomInt(random, left, 19);

        const expected = values.slice(left, right + 1).reduce((sum, v) => sum + v, 0);
        expect(tree.query(left, right)).toBe(expected);
      }
    },
  );
});
