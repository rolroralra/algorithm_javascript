import { describe, expect, it } from 'vitest';
import { SegmentTree } from '../../src/segment_tree/segmentTree';

function buildSumTree(values: number[]): SegmentTree<number> {
  const tree = new SegmentTree<number>(values.length);
  values.forEach((value, index) => tree.update(index, value));
  return tree;
}

describe('SegmentTree sum query', () => {
  it('sums the full range', () => {
    const tree = buildSumTree([1, 2, 3, 4, 5]);
    expect(tree.query(0, 4)).toBe(15);
  });

  it('sums a partial range', () => {
    const tree = buildSumTree([1, 2, 3, 4, 5]);
    expect(tree.query(1, 3)).toBe(9);
  });

  it('sums a single-element range', () => {
    const tree = buildSumTree([1, 2, 3, 4, 5]);
    expect(tree.query(2, 2)).toBe(3);
  });

  it('reflects an update in subsequent queries', () => {
    const tree = buildSumTree([1, 2, 3, 4, 5]);
    tree.update(2, 100);

    expect(tree.query(0, 4)).toBe(1 + 2 + 100 + 4 + 5);
    expect(tree.query(2, 2)).toBe(100);
  });

  it('handles a non-power-of-two size', () => {
    const tree = buildSumTree([1, 2, 3]);
    expect(tree.query(0, 2)).toBe(6);
    expect(tree.query(0, 1)).toBe(3);
  });
});

describe('SegmentTree with a min operator', () => {
  it('finds the minimum in a range', () => {
    const tree = new SegmentTree<number>(5, Math.min, Infinity);
    [5, 3, 8, 1, 9].forEach((value, index) => tree.update(index, value));

    expect(tree.query(0, 4)).toBe(1);
    expect(tree.query(0, 1)).toBe(3);
    expect(tree.query(3, 4)).toBe(1);
  });

  it('reflects an update in the minimum', () => {
    const tree = new SegmentTree<number>(5, Math.min, Infinity);
    [5, 3, 8, 1, 9].forEach((value, index) => tree.update(index, value));

    tree.update(3, 100);

    expect(tree.query(0, 4)).toBe(3);
  });
});

describe('SegmentTree with a max operator', () => {
  it('finds the maximum in a range', () => {
    const tree = new SegmentTree<number>(5, Math.max, -Infinity);
    [5, 3, 8, 1, 9].forEach((value, index) => tree.update(index, value));

    expect(tree.query(0, 4)).toBe(9);
    expect(tree.query(0, 2)).toBe(8);
  });
});
