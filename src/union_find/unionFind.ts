export class UnionFind {
  parent: number[];

  constructor(size: number) {
    if (size <= 0) {
      throw new Error('size must be positive');
    }
    this.parent = new Array(size).fill(-1);
  }

  union(a: number, b: number): void {
    let parentA = this.find(a);
    let parentB = this.find(b);

    if (parentA === parentB) {
      return;
    }

    if (this.rank(parentA) < this.rank(parentB)) {
      [parentA, parentB] = [parentB, parentA];
    }

    this.parent[parentA]! += this.parent[parentB]!
    this.parent[parentB] = parentA
  }

  // @ts-ignore
  find(a: number): number {
    if (this.parent.length > 1000) {
      return this._findByLoop(a)
    }

    return this._findByRecursive(a)
  }

  rank(a: number): number {
    return -this.parent[this.find(a)]!
  }

  isRoot(a: number): boolean {
    return this.parent[a]! < 0
  }

  _findByRecursive(a: number): number {
    if (this.isRoot(a)) {
      return a
    }

    this.parent[a] = this._findByRecursive(this.parent[a]!)
    return this.parent[a]
  }

  _findByLoop(a: number): number {
    let result = a

    while (this.parent[result]! >= 0) {
      result = this.parent[result]!
    }

    let curr = a
    while (this.parent[curr]! >= 0) {
      this.parent[curr] = result;
      curr = this.parent[curr]!;
    }

    return result;
  }

  // `findStatic` must call these through the class (`UnionFind.findByRecursive(...)`),
  // not a bare local reference, so spying on the static property — e.g.
  // `vi.spyOn(UnionFind, 'findByRecursive')` — can intercept them.
  static unionStatic(parent: number[], a: number, b: number): void {
    let parentA = UnionFind.findStatic(parent, a);
    let parentB = UnionFind.findStatic(parent, b);

    if (parentA === parentB) {
      return;
    }

    if (parent[parentA]! > parent[parentB]!) {
      [parentA, parentB] = [parentB, parentA];
    }

    parent[parentA]! += parent[parentB]!
    parent[parentB] = parentA
  }

  static findStatic(parent: number[], a: number): number {
    if (parent.length > 1000) {
      return UnionFind.findByLoop(parent, a);
    }

    return UnionFind.findByRecursive(parent, a);
  }

  static findByRecursive(parent: number[], a: number): number {
    if (parent[a]! < 0) {
      return a
    }

    parent[a] = UnionFind.findByRecursive(parent, parent[a]!)
    return parent[a]
  }

  static findByLoop(parent: number[], a: number): number {
    let result = a

    while (parent[result]! >= 0) {
      result = parent[result]!
    }

    let curr = a
    while (parent[curr]! >= 0) {
      parent[curr] = result;
      curr = parent[curr]!;
    }

    return result;
  }
}
