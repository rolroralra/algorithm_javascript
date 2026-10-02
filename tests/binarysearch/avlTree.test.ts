import { describe, expect, it } from 'vitest';
import { AVLNode, AVLTree } from '@/binarysearch/avlTree';
import { mulberry32, randomInt } from '../helpers/random';

/**
 * Recursively verifies the AVL balance invariant (|left height - right height| <= 1)
 * and that the cached `node.height` matches the actual subtree height.
 *
 * @returns the height of the subtree rooted at `node` (0 for an empty subtree)
 */
function assertAvlBalanced(node: AVLNode<number> | null): number {
  if (node === null) return 0;

  const leftHeight = assertAvlBalanced(node.left);
  const rightHeight = assertAvlBalanced(node.right);

  expect(Math.abs(leftHeight - rightHeight)).toBeLessThanOrEqual(1);
  expect(node.height).toBe(1 + Math.max(leftHeight, rightHeight));

  return node.height;
}

function makeAvl(values: number[] = []): AVLTree<number> {
  return new AVLTree<number>(values);
}

describe('AVLTree insert', () => {
  it('inorder stays sorted after a sorted insert', () => {
    const avl = makeAvl(Array.from({ length: 50 }, (_, i) => i + 1));
    expect(avl.inorder()).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
  });

  it('size tracks the number of unique values', () => {
    const avl = makeAvl([5, 3, 8, 3, 5]);
    expect(avl.size()).toBe(3);
  });

  it('a duplicate insert is ignored', () => {
    const avl = makeAvl([5]);
    avl.insert(5);

    expect(avl.size()).toBe(1);
    expect(avl.inorder()).toEqual([5]);
  });

  it('the balance invariant holds after a sorted insert', () => {
    const avl = makeAvl(Array.from({ length: 199 }, (_, i) => i + 1));
    assertAvlBalanced(avl.root);
  });

  it.each(Array.from({ length: 5 }, (_, seed) => seed))(
    'the balance invariant holds after a random insert (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const values = Array.from({ length: 300 }, () => randomInt(random, 0, 1000));

      const avl = makeAvl(values);

      assertAvlBalanced(avl.root);
      expect(avl.inorder()).toEqual([...new Set(values)].sort((a, b) => a - b));
    },
  );

  it('height stays logarithmic for a sorted insert', () => {
    const n = 1000;
    const avl = makeAvl(Array.from({ length: n }, (_, i) => i));

    // Known AVL bound: height <= 1.4404 * log2(n + 2) - 0.3277
    expect(avl.height()).toBeLessThanOrEqual(1.45 * Math.log2(n + 2));
  });
});

describe('AVLTree delete', () => {
  it('deletes a leaf', () => {
    const avl = makeAvl([5, 3, 8]);
    avl.delete(3);

    expect(avl.contains(3)).toBe(false);
    expect(avl.inorder()).toEqual([5, 8]);
  });

  it('deleting a missing value is a no-op', () => {
    const avl = makeAvl([5, 3, 8]);
    avl.delete(100);

    expect(avl.size()).toBe(3);
    expect(avl.inorder()).toEqual([3, 5, 8]);
  });

  it('deleting everything empties the tree', () => {
    const values = [5, 3, 8, 1, 4, 7, 9];
    const avl = makeAvl(values);

    for (const value of values) {
      avl.delete(value);
    }

    expect(avl.isEmpty()).toBe(true);
    expect(avl.root).toBeNull();
  });

  it('the balance invariant holds after deletes', () => {
    const avl = makeAvl(Array.from({ length: 199 }, (_, i) => i + 1));

    for (let value = 1; value < 100; value += 1) {
      avl.delete(value);
    }

    assertAvlBalanced(avl.root);
    expect(avl.inorder()).toEqual(Array.from({ length: 100 }, (_, i) => i + 100));
  });

  it.each(Array.from({ length: 5 }, (_, seed) => seed))(
    'the balance invariant holds after random inserts and deletes (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const avl = makeAvl();
      const inserted: number[] = [];

      for (let i = 0; i < 300; i += 1) {
        if (inserted.length > 0 && random() < 0.4) {
          const index = Math.floor(random() * inserted.length);
          const value = inserted[index]!;
          avl.delete(value);
          inserted.splice(index, 1);
        } else {
          const value = randomInt(random, 0, 300);
          if (!avl.contains(value)) {
            avl.insert(value);
            inserted.push(value);
          }
        }

        assertAvlBalanced(avl.root);
        expect(avl.size()).toBe(inserted.length);
      }

      expect(avl.inorder()).toEqual([...inserted].sort((a, b) => a - b));
    },
  );
});

describe('AVLTree queries', () => {
  it('finds the min and max', () => {
    const avl = makeAvl([5, 3, 8, 1, 9]);

    expect(avl.findMin()).toBe(1);
    expect(avl.findMax()).toBe(9);
  });

  it('min and max on an empty tree are null', () => {
    const avl = makeAvl();

    expect(avl.findMin()).toBeNull();
    expect(avl.findMax()).toBeNull();
  });

  it('contains', () => {
    const avl = makeAvl([5, 3, 8]);

    expect(avl.contains(3)).toBe(true);
    expect(avl.contains(100)).toBe(false);
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
    const avl = new AVLTree<Person>(people, (a, b) => a.age - b.age);

    expect(avl.inorder().map((p) => p.age)).toEqual([25, 30, 35]);
    expect(avl.findMin()!.age).toBe(25);
    expect(avl.findMax()!.age).toBe(35);
  });
});
