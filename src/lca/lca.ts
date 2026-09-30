import { notImplemented } from '../shared/notImplemented';

/** Equivalent to Python's `int.bit_length()` for a non-negative integer. */
function bitLength(n: number): number {
  if (n === 0) return 0;
  return Math.floor(Math.log2(n)) + 1;
}

/** Lowest common ancestor queries via binary lifting. */
export class LCA {
  readonly size: number;
  readonly logN: number;
  /** parent[node][k] = the 2^k-th ancestor of `node`, or -1 if none. */
  readonly parent: number[][];
  readonly depth: number[];

  constructor(size: number) {
    if (size <= 0) {
      throw new Error('size must be > 0');
    }

    this.size = size;
    this.logN = bitLength(size - 1);
    this.parent = Array.from({ length: this.size }, () => new Array(this.logN + 1).fill(-1));
    this.depth = new Array(this.size).fill(-1);
  }

  /** Builds the binary-lifting table from an adjacency list rooted at `rootIndex`. */
  build(adjacencyList: number[][], rootIndex = 0): void {
    notImplemented('LCA.build');
  }

  /** Returns the lowest common ancestor of nodes `a` and `b`. */
  lca(a: number, b: number): number {
    notImplemented('LCA.lca');
  }

  getDepth(a: number): number {
    return this.depth[a]!;
  }
}
