import { describe, expect, it } from 'vitest';
import { BSTNode, BinarySearchTree } from '../../src/binarysearch/binarySearchTree';
import { mulberry32, randomInt } from '../helpers/random';

function assertParentConsistency<T>(
  node: BSTNode<T> | null,
  expectedParent: BSTNode<T> | null,
): void {
  if (node === null) return;

  expect(node.parent).toBe(expectedParent);
  assertParentConsistency(node.left, node);
  assertParentConsistency(node.right, node);
}

/** Forces the BST past its recursive/loop dispatch threshold (see binarySearchTree.ts). */
function forceLoopPath(bst: BinarySearchTree<number>): void {
  bst._size = 1000;
}

describe.each([
  ['recursive path', false],
  ['loop path', true],
] as const)('BinarySearchTree (%s)', (_label, forceLoop) => {
  function make(values: number[] = []): BinarySearchTree<number> {
    const bst = new BinarySearchTree<number>();
    if (forceLoop) forceLoopPath(bst);
    for (const value of values) bst.add(value);
    return bst;
  }

  describe('parent pointer on insert', () => {
    it('root has no parent', () => {
      const bst = make([5]);
      expect(bst.root!.parent).toBeNull();
    });

    it('inserted children point to their parent', () => {
      const bst = make([5, 3, 8, 1, 4, 7, 9]);
      assertParentConsistency(bst.root, null);
    });

    it('parent consistency holds after a sorted insert', () => {
      const bst = make(Array.from({ length: 49 }, (_, i) => i + 1));
      assertParentConsistency(bst.root, null);
    });

    it.each(Array.from({ length: 5 }, (_, seed) => seed))(
      'parent consistency holds after a random insert (seed %i)',
      (seed) => {
        const random = mulberry32(seed);
        const values = Array.from({ length: 150 }, () => randomInt(random, 0, 200));
        const bst = make(values);
        assertParentConsistency(bst.root, null);
      },
    );
  });

  describe('parent pointer on delete', () => {
    it('deleting a leaf detaches it from its parent', () => {
      const bst = make([5, 3, 8]);
      const leaf = bst.find(3)!;
      const parent = leaf.parent!;

      bst.remove(3);

      expect(parent.left).toBeNull();
      assertParentConsistency(bst.root, null);
    });

    it('deleting a node with one child relinks the parent', () => {
      const bst = make([5, 3, 8, 1]);
      bst.remove(3);

      const node = bst.find(1)!;
      expect(node.parent).toBe(bst.root);
      assertParentConsistency(bst.root, null);
    });

    it('deleting a node with two children relinks the parent', () => {
      const bst = make([5, 3, 8, 1, 4, 7, 9]);
      bst.remove(5);

      assertParentConsistency(bst.root, null);
    });

    it('deleting the root updates the new root parent', () => {
      const bst = make([5, 3, 8]);
      bst.remove(5);

      expect(bst.root!.parent).toBeNull();
      assertParentConsistency(bst.root, null);
    });

    it.each(Array.from({ length: 5 }, (_, seed) => seed))(
      'parent consistency holds after random inserts and deletes (seed %i)',
      (seed) => {
        const random = mulberry32(seed);
        const bst = make();
        const inserted: number[] = [];

        for (let i = 0; i < 200; i += 1) {
          if (inserted.length > 0 && random() < 0.4) {
            const index = Math.floor(random() * inserted.length);
            const value = inserted[index]!;
            bst.remove(value);
            inserted.splice(index, 1);
          } else {
            const value = randomInt(random, 0, 300);
            bst.add(value);
            if (bst.contains(value)) {
              inserted.push(value);
            }
          }

          assertParentConsistency(bst.root, null);
        }

        expect(bst.inorder()).toEqual([...bst.inorder()].sort((a, b) => a - b));
      },
    );
  });

  describe('successor / predecessor', () => {
    it('successor uses the right subtree minimum', () => {
      const bst = make([5, 3, 8, 6, 9]);
      const node = bst.find(5)!;

      expect(bst.successor(node)!.value).toBe(6);
    });

    it('predecessor uses the left subtree maximum', () => {
      const bst = make([5, 3, 8, 2, 4]);
      const node = bst.find(5)!;

      expect(bst.predecessor(node)!.value).toBe(4);
    });

    it('successor climbs to an ancestor when there is no right child', () => {
      const bst = make([5, 3, 8, 2, 4]);
      const node = bst.find(4)!;

      expect(bst.successor(node)!.value).toBe(5);
    });

    it('predecessor climbs to an ancestor when there is no left child', () => {
      const bst = make([5, 3, 8, 6, 9]);
      const node = bst.find(6)!;

      expect(bst.predecessor(node)!.value).toBe(5);
    });

    it('successor of the maximum is null', () => {
      const bst = make([5, 3, 8, 2, 4, 6, 9]);
      const node = bst.find(bst.findMax()!)!;

      expect(bst.successor(node)).toBeNull();
    });

    it('predecessor of the minimum is null', () => {
      const bst = make([5, 3, 8, 2, 4, 6, 9]);
      const node = bst.find(bst.findMin()!)!;

      expect(bst.predecessor(node)).toBeNull();
    });

    it('a single node has no successor or predecessor', () => {
      const bst = make([42]);
      const node = bst.find(42)!;

      expect(bst.successor(node)).toBeNull();
      expect(bst.predecessor(node)).toBeNull();
    });

    it.each(Array.from({ length: 10 }, (_, seed) => seed))(
      'successor and predecessor match sorted order (seed %i)',
      (seed) => {
        const random = mulberry32(seed);
        const count = randomInt(random, 1, 100);
        const values = Array.from({ length: count }, () => randomInt(random, 0, 500));
        const sortedValues = [...new Set(values)].sort((a, b) => a - b);
        const bst = make(values);

        sortedValues.forEach((value, index) => {
          const node = bst.find(value)!;
          const successor = bst.successor(node);
          const predecessor = bst.predecessor(node);

          const expectedSuccessor = index + 1 < sortedValues.length ? sortedValues[index + 1] : null;
          const expectedPredecessor = index > 0 ? sortedValues[index - 1] : null;

          expect(successor ? successor.value : null).toBe(expectedSuccessor);
          expect(predecessor ? predecessor.value : null).toBe(expectedPredecessor);
        });
      },
    );
  });
});
