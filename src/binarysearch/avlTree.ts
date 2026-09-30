import { notImplemented } from '../shared/notImplemented';
import { BinaryTree, BinaryTreeNode } from './binaryTree';
import { type Comparator, defaultComparator } from './comparator';

export class AVLNode<T> extends BinaryTreeNode<T> {
  declare left: AVLNode<T> | null;
  declare right: AVLNode<T> | null;
  height = 1;

  constructor(value: T) {
    super(value);
  }
}

export class AVLTree<T> extends BinaryTree<T> {
  declare root: AVLNode<T> | null;
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
    notImplemented('AVLTree.insert');
  }

  delete(value: T): void {
    notImplemented('AVLTree.delete');
  }

  contains(value: T): boolean {
    notImplemented('AVLTree.contains');
  }

  findMin(): T | null {
    notImplemented('AVLTree.findMin');
  }

  findMax(): T | null {
    notImplemented('AVLTree.findMax');
  }

  size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }
}
