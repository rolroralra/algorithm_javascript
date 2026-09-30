import { notImplemented } from '../shared/notImplemented';

export type BinaryOperator<T> = (a: T, b: T) => T;

/**
 * Segment tree over an associative `binaryOperator` (sum by default). Internally uses
 * a complete-binary-tree array sized up to the next power of two, so `capacity`
 * (`size`) need not itself be a power of two.
 */
export class SegmentTree<T = number> {
  static readonly BASE_INDEX = 0;

  operator: BinaryOperator<T>;
  identity: T;
  size: number;
  baseIndex: number;
  treeSize: number;
  tree: (T | null)[];
  readonly rootNode: [node: number, left: number, right: number];

  constructor(
    size: number,
    binaryOperator: BinaryOperator<T> = ((a: number, b: number) => a + b) as unknown as BinaryOperator<T>,
    identity: T = 0 as unknown as T,
  ) {
    if (size <= 0) {
      throw new Error('size must be greater than 0');
    }

    this.operator = binaryOperator;
    this.identity = identity;
    this.size = size;

    const baseSize = 1 << Math.ceil(Math.log2(size));
    this.baseIndex = baseSize - 1;
    this.treeSize = baseSize * 2 - 1;
    this.tree = new Array<T | null>(this.treeSize).fill(this.identity);
    this.rootNode = [SegmentTree.BASE_INDEX, 0, this.size - 1];
  }

  update(targetIndex: number, value: T): void {
    notImplemented('SegmentTree.update');
  }

  query(startIndex: number, endIndex: number): T | null {
    notImplemented('SegmentTree.query');
  }
}
