import { describe, expect, it } from 'vitest';
import { BinaryTree, BinaryTreeNode } from '@/binarysearch/binaryTree';

function buildSampleTree(): BinaryTree<number> {
  const root = new BinaryTreeNode(1);
  root.left = new BinaryTreeNode(2);
  root.right = new BinaryTreeNode(3);
  root.left.left = new BinaryTreeNode(4);
  root.left.right = new BinaryTreeNode(5);
  return new BinaryTree(root);
}

describe('BinaryTree traversal', () => {
  it('inorder', () => {
    expect(buildSampleTree().inorder()).toEqual([4, 2, 5, 1, 3]);
  });

  it('preorder', () => {
    expect(buildSampleTree().preorder()).toEqual([1, 2, 4, 5, 3]);
  });

  it('postorder', () => {
    expect(buildSampleTree().postorder()).toEqual([4, 5, 2, 3, 1]);
  });

  it('empty tree traversals are empty', () => {
    const tree = new BinaryTree<number>();
    expect(tree.inorder()).toEqual([]);
    expect(tree.preorder()).toEqual([]);
    expect(tree.postorder()).toEqual([]);
  });
});

describe('BinaryTree height', () => {
  it('empty tree height is zero', () => {
    expect(new BinaryTree<number>().height()).toBe(0);
  });

  it('single node height is one', () => {
    expect(new BinaryTree(new BinaryTreeNode(1)).height()).toBe(1);
  });

  it('sample tree height', () => {
    expect(buildSampleTree().height()).toBe(3);
  });

  it('skewed tree height matches node count', () => {
    const root = new BinaryTreeNode(0);
    let node = root;
    for (let value = 1; value < 5; value += 1) {
      node.right = new BinaryTreeNode(value);
      node = node.right;
    }

    expect(new BinaryTree(root).height()).toBe(5);
  });
});
