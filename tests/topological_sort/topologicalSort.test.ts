import { describe, expect, it } from 'vitest';
import {
  topologicalSortByDfsRecursive,
  topologicalSortByIndegree,
} from '@/topological_sort/topologicalSort';

type TopoSort = (adjacencyList: number[][]) => [number[], boolean];

const IMPLEMENTATIONS: Record<string, TopoSort> = {
  dfsRecursive: topologicalSortByDfsRecursive,
  indegree: topologicalSortByIndegree,
};

function assertValidTopologicalOrder(adjacencyList: number[][], order: number[]): void {
  const position = new Map(order.map((node, index) => [node, index]));
  adjacencyList.forEach((neighbors, u) => {
    for (const v of neighbors) {
      expect(position.get(u)!).toBeLessThan(position.get(v)!);
    }
  });
}

describe.each(Object.entries(IMPLEMENTATIONS))('topological sort on a DAG: %s', (_name, topoSort) => {
  it('includes every vertex', () => {
    const adjacencyList = [[1, 2], [3], [3], []];

    const [order, hasCycle] = topoSort(adjacencyList);

    expect(hasCycle).toBe(false);
    expect([...order].sort((a, b) => a - b)).toEqual(
      Array.from({ length: adjacencyList.length }, (_, i) => i),
    );
  });

  it('respects edge ordering', () => {
    const adjacencyList = [[1, 2], [3], [3], []];

    const [order] = topoSort(adjacencyList);

    assertValidTopologicalOrder(adjacencyList, order);
  });

  it('handles a disconnected DAG', () => {
    const adjacencyList = [[1], [], [3], []];

    const [order, hasCycle] = topoSort(adjacencyList);

    expect(hasCycle).toBe(false);
    assertValidTopologicalOrder(adjacencyList, order);
    expect([...order].sort((a, b) => a - b)).toEqual(
      Array.from({ length: adjacencyList.length }, (_, i) => i),
    );
  });

  it('handles a single vertex with no edges', () => {
    const [order, hasCycle] = topoSort([[]]);

    expect(hasCycle).toBe(false);
    expect(order).toEqual([0]);
  });
});

describe.each(Object.entries(IMPLEMENTATIONS))('topological sort on a cyclic graph: %s', (_name, topoSort) => {
  it('detects a simple cycle', () => {
    const adjacencyList = [[1], [2], [0]];

    const [, hasCycle] = topoSort(adjacencyList);

    expect(hasCycle).toBe(true);
  });

  it('detects a cycle within a larger graph', () => {
    const adjacencyList = [[1], [2], [1], []];

    const [, hasCycle] = topoSort(adjacencyList);

    expect(hasCycle).toBe(true);
  });

  it('treats a self-loop as a cycle', () => {
    const adjacencyList = [[0]];

    const [, hasCycle] = topoSort(adjacencyList);

    expect(hasCycle).toBe(true);
  });
});
