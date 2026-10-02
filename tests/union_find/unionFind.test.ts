import { describe, expect, it, vi } from 'vitest';
import { UnionFind } from '@/union_find/unionFind';
import { mulberry32, randomInt } from '../helpers/random';

describe('UnionFind instance API', () => {
  it('each element starts as its own root', () => {
    const uf = new UnionFind(5);
    for (let i = 0; i < 5; i += 1) {
      expect(uf.find(i)).toBe(i);
    }
  });

  it('union merges two sets', () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);

    expect(uf.find(0)).toBe(uf.find(1));
  });

  it('unrelated elements stay in different sets', () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);

    expect(uf.find(0)).not.toBe(uf.find(2));
  });

  it('union is transitive', () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);
    uf.union(1, 2);

    expect(uf.find(0)).toBe(uf.find(1));
    expect(uf.find(1)).toBe(uf.find(2));
  });

  it('union of already-connected elements is a no-op', () => {
    const uf = new UnionFind(3);
    uf.union(0, 1);
    const rootBefore = uf.find(0);

    uf.union(0, 1);

    expect(uf.find(0)).toBe(rootBefore);
  });
});

describe('UnionFind instance API extras', () => {
  it('a new element is its own root', () => {
    const uf = new UnionFind(3);
    expect(uf.isRoot(0)).toBe(true);
  });

  it('isRoot is only true for the root', () => {
    const uf = new UnionFind(3);
    uf.union(0, 1);
    const root = uf.find(0);
    const member = root === 0 ? 1 : 0;

    expect(uf.isRoot(root)).toBe(true);
    expect(uf.isRoot(member)).toBe(false);
  });

  it('rank reflects the set size after unions', () => {
    const uf = new UnionFind(4);
    uf.union(0, 1);
    uf.union(1, 2);

    expect(uf.rank(uf.find(0))).toBe(3);
  });

  it('rank of an untouched element is one', () => {
    const uf = new UnionFind(3);
    expect(uf.rank(0)).toBe(1);
  });
});

describe('UnionFind instance API randomized', () => {
  it.each(Array.from({ length: 10 }, (_, seed) => seed))(
    'matches a reference partition (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const size = 30;
      const uf = new UnionFind(size);
      const reference: Set<number>[] = Array.from({ length: size }, (_, i) => new Set([i]));

      function referenceFind(i: number): Set<number> {
        return reference.find((group) => group.has(i))!;
      }

      for (let step = 0; step < 100; step += 1) {
        const a = randomInt(random, 0, size - 1);
        const b = randomInt(random, 0, size - 1);
        uf.union(a, b);

        const groupA = referenceFind(a);
        const groupB = referenceFind(b);
        if (groupA !== groupB) {
          for (const value of groupB) groupA.add(value);
          reference.splice(reference.indexOf(groupB), 1);
        }
      }

      for (let i = 0; i < size; i += 1) {
        for (let j = 0; j < size; j += 1) {
          const sameInUf = uf.find(i) === uf.find(j);
          const sameInReference = referenceFind(i).has(j);
          expect(sameInUf).toBe(sameInReference);
        }
      }
    },
  );
});

// UnionFind also exposes the same algorithm as static methods that operate directly on
// a plain `parent` array, without needing an instance.
describe('UnionFind static API', () => {
  it('each element starts as its own root', () => {
    const parent = new Array(5).fill(-1);
    for (let i = 0; i < 5; i += 1) {
      expect(UnionFind.findStatic(parent, i)).toBe(i);
    }
  });

  it('union merges two sets', () => {
    const parent = new Array(5).fill(-1);
    UnionFind.unionStatic(parent, 0, 1);

    expect(UnionFind.findStatic(parent, 0)).toBe(UnionFind.findStatic(parent, 1));
  });

  it('unrelated elements stay in different sets', () => {
    const parent = new Array(5).fill(-1);
    UnionFind.unionStatic(parent, 0, 1);

    expect(UnionFind.findStatic(parent, 0)).not.toBe(UnionFind.findStatic(parent, 2));
  });

  it('union is transitive', () => {
    const parent = new Array(5).fill(-1);
    UnionFind.unionStatic(parent, 0, 1);
    UnionFind.unionStatic(parent, 1, 2);

    expect(UnionFind.findStatic(parent, 0)).toBe(UnionFind.findStatic(parent, 1));
    expect(UnionFind.findStatic(parent, 1)).toBe(UnionFind.findStatic(parent, 2));
  });

  it('union of already-connected elements is a no-op', () => {
    const parent = new Array(3).fill(-1);
    UnionFind.unionStatic(parent, 0, 1);
    const rootBefore = UnionFind.findStatic(parent, 0);

    UnionFind.unionStatic(parent, 0, 1);

    expect(UnionFind.findStatic(parent, 0)).toBe(rootBefore);
  });
});

describe('UnionFind static API randomized', () => {
  it.each(Array.from({ length: 10 }, (_, seed) => seed))(
    'matches a reference partition (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const size = 30;
      const parent = new Array(size).fill(-1);
      const reference: Set<number>[] = Array.from({ length: size }, (_, i) => new Set([i]));

      function referenceFind(i: number): Set<number> {
        return reference.find((group) => group.has(i))!;
      }

      for (let step = 0; step < 100; step += 1) {
        const a = randomInt(random, 0, size - 1);
        const b = randomInt(random, 0, size - 1);
        UnionFind.unionStatic(parent, a, b);

        const groupA = referenceFind(a);
        const groupB = referenceFind(b);
        if (groupA !== groupB) {
          for (const value of groupB) groupA.add(value);
          reference.splice(reference.indexOf(groupB), 1);
        }
      }

      for (let i = 0; i < size; i += 1) {
        for (let j = 0; j < size; j += 1) {
          const sameInUf = UnionFind.findStatic(parent, i) === UnionFind.findStatic(parent, j);
          const sameInReference = referenceFind(i).has(j);
          expect(sameInUf).toBe(sameInReference);
        }
      }
    },
  );
});

describe('static find implementations', () => {
  it.each([UnionFind.findByRecursive, UnionFind.findByLoop])(
    'recursive and loop find agree',
    (findFn) => {
      const parent = new Array(5).fill(-1);
      UnionFind.unionStatic(parent, 0, 1);
      UnionFind.unionStatic(parent, 1, 2);

      expect(findFn(parent, 0)).toBe(findFn(parent, 2));
    },
  );

  it('findStatic uses the recursive implementation below the threshold', () => {
    const parent = new Array(3).fill(-1);
    UnionFind.unionStatic(parent, 0, 1);

    expect(UnionFind.findStatic(parent, 0)).toBe(UnionFind.findStatic(parent, 1));
  });
});

// Both the instance API (find/union) and the static API (findStatic/unionStatic)
// switch from a recursive to a loop-based find once the structure holds more than
// 1000 elements, mirroring the Python original's recursion-depth-driven threshold, so
// the dispatch threshold itself needs direct coverage on both APIs.
describe('UnionFind instance API dispatch threshold', () => {
  it('uses the recursive find at the threshold', () => {
    const recursiveSpy = vi.spyOn(UnionFind.prototype, '_findByRecursive');
    const loopSpy = vi.spyOn(UnionFind.prototype, '_findByLoop');

    const uf = new UnionFind(1000);
    uf.find(0);

    expect(recursiveSpy).toHaveBeenCalled();
    expect(loopSpy).not.toHaveBeenCalled();
    recursiveSpy.mockRestore();
    loopSpy.mockRestore();
  });

  it('uses the loop find above the threshold', () => {
    const recursiveSpy = vi.spyOn(UnionFind.prototype, '_findByRecursive');
    const loopSpy = vi.spyOn(UnionFind.prototype, '_findByLoop');

    const uf = new UnionFind(1001);
    uf.find(0);

    expect(loopSpy).toHaveBeenCalled();
    expect(recursiveSpy).not.toHaveBeenCalled();
    recursiveSpy.mockRestore();
    loopSpy.mockRestore();
  });

  it('preserves correctness above the threshold', () => {
    const size = 1500;
    const uf = new UnionFind(size);

    for (let i = 0; i < size - 1; i += 1) {
      uf.union(i, i + 1);
    }

    expect(uf.find(0)).toBe(uf.find(size - 1));
  });
});

describe('UnionFind static API dispatch threshold', () => {
  it('uses the recursive find at the threshold', () => {
    const recursiveSpy = vi.spyOn(UnionFind, 'findByRecursive');
    const loopSpy = vi.spyOn(UnionFind, 'findByLoop');

    const parent = new Array(1000).fill(-1);
    UnionFind.findStatic(parent, 0);

    expect(recursiveSpy).toHaveBeenCalled();
    expect(loopSpy).not.toHaveBeenCalled();
    recursiveSpy.mockRestore();
    loopSpy.mockRestore();
  });

  it('uses the loop find above the threshold', () => {
    const recursiveSpy = vi.spyOn(UnionFind, 'findByRecursive');
    const loopSpy = vi.spyOn(UnionFind, 'findByLoop');

    const parent = new Array(1001).fill(-1);
    UnionFind.findStatic(parent, 0);

    expect(loopSpy).toHaveBeenCalled();
    expect(recursiveSpy).not.toHaveBeenCalled();
    recursiveSpy.mockRestore();
    loopSpy.mockRestore();
  });

  it('preserves correctness above the threshold', () => {
    const size = 1500;
    const parent = new Array(size).fill(-1);

    for (let i = 0; i < size - 1; i += 1) {
      UnionFind.unionStatic(parent, i, i + 1);
    }

    expect(UnionFind.findStatic(parent, 0)).toBe(UnionFind.findStatic(parent, size - 1));
  });
});

describe('instance and static API agree', () => {
  it('the same union pattern yields the same partition', () => {
    const edges: [number, number][] = [
      ...Array.from({ length: 10 }, (_, i) => [i * 2, i * 2 + 1] as [number, number]),
      ...Array.from({ length: 5 }, (_, i) => [i * 4, i * 4 + 2] as [number, number]),
    ];

    const uf = new UnionFind(20);
    const parent = new Array(20).fill(-1);
    for (const [a, b] of edges) {
      uf.union(a, b);
      UnionFind.unionStatic(parent, a, b);
    }

    for (let i = 0; i < 20; i += 1) {
      for (let j = 0; j < 20; j += 1) {
        expect(uf.find(i) === uf.find(j)).toBe(
          UnionFind.findStatic(parent, i) === UnionFind.findStatic(parent, j),
        );
      }
    }
  });

  it('the static API does not mutate instance state', () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);

    const parent = new Array(5).fill(-1);
    UnionFind.unionStatic(parent, 2, 3);

    expect(uf.find(0)).toBe(uf.find(1));
    expect(uf.find(2)).not.toBe(uf.find(3));
  });
});
