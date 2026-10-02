import { describe, expect, it } from 'vitest';
import {
  sccByKosaraju,
  sccByTarjan,
} from '@/strong_connected_components/stronglyConnectedComponents';

type SccImplementation = (adjacencyList: number[][]) => number[][];

const IMPLEMENTATIONS: Record<string, SccImplementation> = {
  tarjan: sccByTarjan,
  kosaraju: sccByKosaraju,
};

/** Set-of-sets equality stand-in: each component becomes a sorted, JSON-keyed set member. */
function asComponentSet(sccList: number[][]): Set<string> {
  return new Set(sccList.map((component) => JSON.stringify([...component].sort((a, b) => a - b))));
}

function componentSetOf(...components: number[][]): Set<string> {
  return asComponentSet(components);
}

describe.each(Object.entries(IMPLEMENTATIONS))('strongly connected components: %s', (_name, scc) => {
  it('handles a single vertex with no edges', () => {
    expect(asComponentSet(scc([[]]))).toEqual(componentSetOf([0]));
  });

  it('treats a two-vertex cycle as one component', () => {
    const adjacencyList = [[1], [0]];

    expect(asComponentSet(scc(adjacencyList))).toEqual(componentSetOf([0, 1]));
  });

  it('gives an acyclic graph one component per vertex', () => {
    const adjacencyList = [[1], [2], []];

    expect(asComponentSet(scc(adjacencyList))).toEqual(componentSetOf([0], [1], [2]));
  });

  it('treats a single cycle across all vertices as one component', () => {
    const adjacencyList = [[1], [2], [3], [0]];

    expect(asComponentSet(scc(adjacencyList))).toEqual(componentSetOf([0, 1, 2, 3]));
  });

  it('keeps two cycles connected by a bridge edge separate', () => {
    // cycle {0,1,2} -> bridge 2->3 -> cycle {3,4,5}
    const adjacencyList = [[1], [2], [0, 3], [4], [5], [3]];

    expect(asComponentSet(scc(adjacencyList))).toEqual(componentSetOf([0, 1, 2], [3, 4, 5]));
  });

  it('treats a self-loop as its own component', () => {
    const adjacencyList = [[0], [0]];

    expect(asComponentSet(scc(adjacencyList))).toEqual(componentSetOf([0], [1]));
  });

  it('evaluates disconnected components independently', () => {
    const adjacencyList = [[1], [0], [3], [2]];

    expect(asComponentSet(scc(adjacencyList))).toEqual(componentSetOf([0, 1], [2, 3]));
  });

  it('covers every vertex exactly once', () => {
    const adjacencyList = [[1], [2], [0, 3], [4], [5, 3], [3]];

    const components = scc(adjacencyList);
    const flattened = components.flat();

    expect([...flattened].sort((a, b) => a - b)).toEqual(
      Array.from({ length: adjacencyList.length }, (_, i) => i),
    );
  });
});
