import { describe, expect, it } from 'vitest';
import { LCA } from '@/lca/lca';

function buildSampleTree(): LCA {
  // tree:            0
  //                 / \
  //                1   2
  //               / \   \
  //              3   4   5
  const adjacencyList = [[1, 2], [0, 3, 4], [0, 5], [1], [1], [2]];
  const lca = new LCA(6);
  lca.build(adjacencyList, 0);
  return lca;
}

describe('LCA depth', () => {
  it('the root has depth zero', () => {
    expect(buildSampleTree().getDepth(0)).toBe(0);
  });

  it('children have depth one', () => {
    const lca = buildSampleTree();
    expect(lca.getDepth(1)).toBe(1);
    expect(lca.getDepth(2)).toBe(1);
  });

  it('grandchildren have depth two', () => {
    const lca = buildSampleTree();
    expect(lca.getDepth(3)).toBe(2);
    expect(lca.getDepth(4)).toBe(2);
    expect(lca.getDepth(5)).toBe(2);
  });
});

describe('LCA query', () => {
  it('siblings share their parent as the LCA', () => {
    const lca = buildSampleTree();
    expect(lca.lca(3, 4)).toBe(1);
  });

  it('cousins share the root as the LCA', () => {
    const lca = buildSampleTree();
    expect(lca.lca(3, 5)).toBe(0);
  });

  it('a node and its parent', () => {
    const lca = buildSampleTree();
    expect(lca.lca(3, 1)).toBe(1);
  });

  it('a node and its ancestor', () => {
    const lca = buildSampleTree();
    expect(lca.lca(3, 0)).toBe(0);
  });

  it('a node with itself', () => {
    const lca = buildSampleTree();
    expect(lca.lca(4, 4)).toBe(4);
  });

  it('argument order does not matter', () => {
    const lca = buildSampleTree();
    expect(lca.lca(3, 5)).toBe(lca.lca(5, 3));
  });
});

describe('LCA on a deeper tree', () => {
  it('handles a long chain', () => {
    // 0 - 1 - 2 - 3 - 4 (a straight line)
    const adjacencyList = [[1], [0, 2], [1, 3], [2, 4], [3]];
    const lca = new LCA(5);
    lca.build(adjacencyList, 0);

    expect(lca.lca(4, 0)).toBe(0);
    expect(lca.lca(3, 4)).toBe(3);
    expect([0, 1, 2, 3, 4].map((i) => lca.getDepth(i))).toEqual([0, 1, 2, 3, 4]);
  });
});
