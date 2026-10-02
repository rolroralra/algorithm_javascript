import { describe, expect, it } from 'vitest';
import { BLACK, RBNode, RedBlackTree } from '@/binarysearch/redBlackTree';
import { mulberry32, randomInt } from '../helpers/random';

/**
 * Recursively verifies the left-leaning red-black invariants:
 *   - no red right link (a red link only ever leans left)
 *   - no two consecutive red links (a red node has no red child)
 *   - every root-to-null path has the same black-height (perfect black balance)
 *
 * @returns the black-height of the subtree rooted at `node` (null counts as 1 black
 *   link, the usual convention for measuring black-height)
 */
function assertLlrbInvariants(node: RBNode<number> | null): number {
  if (node === null) return 1;

  expect(node.right === null || node.right.color === BLACK).toBe(true);

  if (node.color !== BLACK) {
    expect(node.left === null || node.left.color === BLACK).toBe(true);
  }

  const leftBlackHeight = assertLlrbInvariants(node.left);
  const rightBlackHeight = assertLlrbInvariants(node.right);

  expect(leftBlackHeight).toBe(rightBlackHeight);

  return leftBlackHeight + (node.color === BLACK ? 1 : 0);
}

function makeRbt(values: number[] = []): RedBlackTree<number> {
  return new RedBlackTree<number>(values);
}

describe('RedBlackTree insert', () => {
  it('inorder stays sorted after a sorted insert', () => {
    const rbt = makeRbt(Array.from({ length: 50 }, (_, i) => i + 1));
    expect(rbt.inorder()).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
  });

  it('the root is always black', () => {
    const rbt = makeRbt([5, 3, 8, 1, 4, 7, 9]);
    expect(rbt.root!.color).toBe(BLACK);
  });

  it('size tracks the number of unique values', () => {
    const rbt = makeRbt([5, 3, 8, 3, 5]);
    expect(rbt.size()).toBe(3);
  });

  it('a duplicate insert is ignored', () => {
    const rbt = makeRbt([5]);
    rbt.insert(5);

    expect(rbt.size()).toBe(1);
    expect(rbt.inorder()).toEqual([5]);
  });

  it('the LLRB invariants hold after a sorted insert', () => {
    const rbt = makeRbt(Array.from({ length: 199 }, (_, i) => i + 1));
    assertLlrbInvariants(rbt.root);
  });

  it.each(Array.from({ length: 5 }, (_, seed) => seed))(
    'the LLRB invariants hold after a random insert (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const values = Array.from({ length: 300 }, () => randomInt(random, 0, 1000));

      const rbt = makeRbt(values);

      assertLlrbInvariants(rbt.root);
      expect(rbt.inorder()).toEqual([...new Set(values)].sort((a, b) => a - b));
    },
  );
});

describe('RedBlackTree delete', () => {
  it('deletes a leaf', () => {
    const rbt = makeRbt([5, 3, 8]);
    rbt.delete(3);

    expect(rbt.contains(3)).toBe(false);
    expect(rbt.inorder()).toEqual([5, 8]);
  });

  it('deleting a missing value is a no-op', () => {
    const rbt = makeRbt([5, 3, 8]);
    rbt.delete(100);

    expect(rbt.size()).toBe(3);
    expect(rbt.inorder()).toEqual([3, 5, 8]);
  });

  it('deleting everything empties the tree', () => {
    const values = [5, 3, 8, 1, 4, 7, 9];
    const rbt = makeRbt(values);

    for (const value of values) {
      rbt.delete(value);
    }

    expect(rbt.isEmpty()).toBe(true);
    expect(rbt.root).toBeNull();
  });

  it('the LLRB invariants hold after deletes', () => {
    const rbt = makeRbt(Array.from({ length: 199 }, (_, i) => i + 1));

    for (let value = 1; value < 100; value += 1) {
      rbt.delete(value);
    }

    assertLlrbInvariants(rbt.root);
    expect(rbt.inorder()).toEqual(Array.from({ length: 100 }, (_, i) => i + 100));
  });

  it.each(Array.from({ length: 5 }, (_, seed) => seed))(
    'the LLRB invariants hold after random inserts and deletes (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const rbt = makeRbt();
      const inserted: number[] = [];

      for (let i = 0; i < 300; i += 1) {
        if (inserted.length > 0 && random() < 0.4) {
          const index = Math.floor(random() * inserted.length);
          const value = inserted[index]!;
          rbt.delete(value);
          inserted.splice(index, 1);
        } else {
          const value = randomInt(random, 0, 300);
          if (!rbt.contains(value)) {
            rbt.insert(value);
            inserted.push(value);
          }
        }

        assertLlrbInvariants(rbt.root);
        expect(rbt.size()).toBe(inserted.length);
      }

      expect(rbt.inorder()).toEqual([...inserted].sort((a, b) => a - b));
    },
  );
});

describe('RedBlackTree queries', () => {
  it('finds the min and max', () => {
    const rbt = makeRbt([5, 3, 8, 1, 9]);

    expect(rbt.findMin()).toBe(1);
    expect(rbt.findMax()).toBe(9);
  });

  it('min and max on an empty tree are null', () => {
    const rbt = makeRbt();

    expect(rbt.findMin()).toBeNull();
    expect(rbt.findMax()).toBeNull();
  });

  it('contains', () => {
    const rbt = makeRbt([5, 3, 8]);

    expect(rbt.contains(3)).toBe(true);
    expect(rbt.contains(100)).toBe(false);
  });

  it('supports a custom comparator', () => {
    interface Person {
      name: string;
      age: number;
    }

    const people: Person[] = [
      { name: 'Bob', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Eve', age: 35 },
    ];
    const rbt = new RedBlackTree<Person>(people, (a, b) => a.age - b.age);

    expect(rbt.inorder().map((p) => p.age)).toEqual([25, 30, 35]);
    expect(rbt.findMin()!.age).toBe(25);
    expect(rbt.findMax()!.age).toBe(35);
  });
});
