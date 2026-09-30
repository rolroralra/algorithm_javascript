import { notImplemented } from '../../shared/notImplemented';

/** Classic 1-indexed Fenwick tree (binary indexed tree) for prefix sums. */
export class FenwickTree {
  static readonly BASE_INDEX = 1;

  size: number;
  tree: number[];

  constructor(size: number) {
    if (size <= 0) {
      throw new Error('size must be greater than 0');
    }

    this.size = size + 1;
    this.tree = new Array<number>(size + 1).fill(0);
  }

  /** Inclusive range sum over the 1-indexed range [startIndex, endIndex]. */
  query(startIndex: number, endIndex: number): number {
    notImplemented('FenwickTree.query');
  }

  /** Adds `diff` to the 1-indexed position `index` (not a replace). */
  update(index: number, diff: number): void {
    notImplemented('FenwickTree.update');
  }
}
