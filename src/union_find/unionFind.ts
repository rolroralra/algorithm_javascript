import { notImplemented } from '../shared/notImplemented';

export class UnionFind {
  parent: number[];

  constructor(size: number) {
    if (size <= 0) {
      throw new Error('size must be positive');
    }
    this.parent = new Array(size).fill(-1);
  }

  union(a: number, b: number): void {
    notImplemented('UnionFind.union');
  }

  find(a: number): number {
    notImplemented('UnionFind.find');
  }

  rank(a: number): number {
    notImplemented('UnionFind.rank');
  }

  isRoot(a: number): boolean {
    notImplemented('UnionFind.isRoot');
  }

  // `find` must call these as `this._findByRecursive(...)` / `this._findByLoop(...)`
  // (not a bare local call) so that spying on the prototype — e.g.
  // `vi.spyOn(UnionFind.prototype, '_findByRecursive')` — can intercept them the way
  // Python's monkeypatch does.
  _findByRecursive(a: number): number {
    notImplemented('UnionFind._findByRecursive');
  }

  _findByLoop(a: number): number {
    notImplemented('UnionFind._findByLoop');
  }

  // `findStatic` must call these through the class (`UnionFind.findByRecursive(...)`),
  // not a bare local reference, so spying on the static property — e.g.
  // `vi.spyOn(UnionFind, 'findByRecursive')` — can intercept them.
  static unionStatic(parent: number[], a: number, b: number): void {
    notImplemented('UnionFind.unionStatic');
  }

  static findStatic(parent: number[], a: number): number {
    notImplemented('UnionFind.findStatic');
  }

  static findByRecursive(parent: number[], a: number): number {
    notImplemented('UnionFind.findByRecursive');
  }

  static findByLoop(parent: number[], a: number): number {
    notImplemented('UnionFind.findByLoop');
  }
}
