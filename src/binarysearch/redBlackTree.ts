import { notImplemented } from '../shared/notImplemented';
import { BinaryTree, BinaryTreeNode } from './binaryTree';
import { type Comparator, defaultComparator } from './comparator';

export const RED = true;
export const BLACK = false;

export class RBNode<T> extends BinaryTreeNode<T> {
  declare left: RBNode<T> | null;
  declare right: RBNode<T> | null;
  color: boolean;

  constructor(value: T, color: boolean = RED) {
    super(value);
    this.color = color;
  }
}

/** Left-leaning red-black tree (Sedgewick & Wayne). */
export class RedBlackTree<T> extends BinaryTree<T> {
  declare root: RBNode<T> | null;
  comp: Comparator<T>;
  _size = 0;

  constructor(inputArray: T[] | null = null, comp: Comparator<T> = defaultComparator<T>) {
    super();
    this.comp = comp;

    if (inputArray) {
      for (const value of inputArray) {
        this.insert(value);
      }
    }
  }

  insert(value: T): void {
    notImplemented('RedBlackTree.insert');
  }

  delete(value: T): void {
    notImplemented('RedBlackTree.delete');
  }

  contains(value: T): boolean {
    notImplemented('RedBlackTree.contains');
  }

  findMin(): T | null {
    notImplemented('RedBlackTree.findMin');
  }

  findMax(): T | null {
    notImplemented('RedBlackTree.findMax');
  }

  size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }
}
