import { notImplemented } from '../shared/notImplemented';
import { BinaryTree, BinaryTreeNode } from './binaryTree';
import { type Comparator, defaultComparator } from './comparator';

export type { Comparator };
export { defaultComparator };

export class BSTNode<T> extends BinaryTreeNode<T> {
  declare left: BSTNode<T> | null;
  declare right: BSTNode<T> | null;
  parent: BSTNode<T> | null = null;

  constructor(value: T) {
    super(value);
  }

  isLeaf(): boolean {
    notImplemented('BSTNode.isLeaf');
  }

  isInternal(): boolean {
    notImplemented('BSTNode.isInternal');
  }

  isRoot(): boolean {
    notImplemented('BSTNode.isRoot');
  }

  isLeftChild(): boolean {
    notImplemented('BSTNode.isLeftChild');
  }

  isRightChild(): boolean {
    notImplemented('BSTNode.isRightChild');
  }

  hasLeftChild(): boolean {
    notImplemented('BSTNode.hasLeftChild');
  }

  hasRightChild(): boolean {
    notImplemented('BSTNode.hasRightChild');
  }

  /** Sets `child` as the left child, keeping `child.parent` in sync. */
  setLeft(child: BSTNode<T> | null): void {
    notImplemented('BSTNode.setLeft');
  }

  /** Sets `child` as the right child, keeping `child.parent` in sync. */
  setRight(child: BSTNode<T> | null): void {
    notImplemented('BSTNode.setRight');
  }
}

export class BinarySearchTree<T> extends BinaryTree<T> {
  declare root: BSTNode<T> | null;
  comp: Comparator<T>;
  // Kept unprefixed-private (convention only, like Python's single underscore) so
  // tests can force the loop-based code path via `bst._size = 1000` the way the
  // ported Python tests do.
  _size = 0;

  constructor(inputArray: T[] | null = null, comp: Comparator<T> = defaultComparator<T>) {
    super();
    this.comp = comp;

    if (inputArray) {
      for (const value of inputArray) {
        this.add(value);
      }
    }
  }

  add(value: T): void {
    notImplemented('BinarySearchTree.add');
  }

  remove(value: T): void {
    notImplemented('BinarySearchTree.remove');
  }

  find(value: T): BSTNode<T> | null {
    notImplemented('BinarySearchTree.find');
  }

  contains(value: T): boolean {
    notImplemented('BinarySearchTree.contains');
  }

  findMin(): T | null {
    notImplemented('BinarySearchTree.findMin');
  }

  findMax(): T | null {
    notImplemented('BinarySearchTree.findMax');
  }

  /**
   * root에서 시작해 value가 들어갈 위치의 부모 노드를 찾는다.
   *
   * @returns [parent, comparison] — comparison === 0이면 parent는 동일한 값을 가진 기존 노드(중복),
   *   그 외에는 parent가 새 노드를 붙일 부모이며 comparison 부호가 left/right 방향을 나타낸다.
   */
  findLeafNodeHavingValue(value: T): [BSTNode<T> | null, number] {
    notImplemented('BinarySearchTree.findLeafNodeHavingValue');
  }

  size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  /** Finds the successor of `node` in this BST, or null if `node` holds the maximum value. */
  successor(node: BSTNode<T>): BSTNode<T> | null {
    notImplemented('BinarySearchTree.successor');
  }

  /** Finds the predecessor of `node` in this BST, or null if `node` holds the minimum value. */
  predecessor(node: BSTNode<T>): BSTNode<T> | null {
    notImplemented('BinarySearchTree.predecessor');
  }

  static findMinNode<T>(node: BSTNode<T>): BSTNode<T> {
    notImplemented('BinarySearchTree.findMinNode');
  }

  static findMaxNode<T>(node: BSTNode<T>): BSTNode<T> {
    notImplemented('BinarySearchTree.findMaxNode');
  }
}
