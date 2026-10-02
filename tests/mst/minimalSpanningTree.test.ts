import { describe, expect, it } from 'vitest';
import {
  MinimalSpanningTreeAlgorithm,
  minimalSpanningTree,
  mstKruskalAlgorithm,
  mstPrimAlgorithm,
  type WeightedAdjacencyList,
  type WeightedEdge,
} from '@/mst/minimalSpanningTree';

describe('mstKruskalAlgorithm', () => {
  it('computes the minimum total length', () => {
    const edges: WeightedEdge[] = [
      [0, 1, 1],
      [1, 2, 2],
      [0, 2, 3],
      [2, 3, 4],
      [1, 3, 5],
    ];

    const [length, selectedEdges] = mstKruskalAlgorithm(edges, 4);

    expect(length).toBe(7);
    expect(selectedEdges).toHaveLength(3);
  });

  it('infers the vertex size when not given', () => {
    const edges: WeightedEdge[] = [
      [0, 1, 1],
      [1, 2, 2],
      [0, 2, 3],
    ];

    const [length, selectedEdges] = mstKruskalAlgorithm(edges);

    expect(length).toBe(3);
    expect(selectedEdges).toHaveLength(2);
  });

  it('handles a single-edge graph', () => {
    const [length, selectedEdges] = mstKruskalAlgorithm([[0, 1, 5]], 2);

    expect(length).toBe(5);
    expect(selectedEdges).toEqual([[0, 1, 5]]);
  });

  it('the selected edges form a spanning tree', () => {
    const edges: WeightedEdge[] = [
      [0, 1, 4],
      [0, 2, 1],
      [1, 2, 2],
      [1, 3, 5],
      [2, 3, 8],
      [2, 4, 10],
      [3, 4, 2],
    ];

    const [, selectedEdges] = mstKruskalAlgorithm(edges, 5);

    expect(selectedEdges).toHaveLength(4);
    const touchedVertices = new Set(selectedEdges.flatMap(([a, b]) => [a, b]));
    expect(touchedVertices).toEqual(new Set([0, 1, 2, 3, 4]));
  });
});

describe('mstPrimAlgorithm', () => {
  it('computes the minimum total length', () => {
    const adjacencyList: WeightedAdjacencyList = [
      [
        [1, 1],
        [2, 3],
      ],
      [
        [0, 1],
        [2, 2],
        [3, 5],
      ],
      [
        [0, 3],
        [1, 2],
        [3, 4],
      ],
      [
        [1, 5],
        [2, 4],
      ],
    ];

    const [length, selectedEdges] = mstPrimAlgorithm(adjacencyList);

    expect(length).toBe(7);
    expect(selectedEdges).toHaveLength(3);
  });

  it('handles a single-vertex graph', () => {
    const [length, selectedEdges] = mstPrimAlgorithm([[]]);

    expect(length).toBe(0);
    expect(selectedEdges).toEqual([]);
  });

  it('matches Kruskal on the same graph', () => {
    const edges: WeightedEdge[] = [
      [0, 1, 4],
      [0, 2, 1],
      [1, 2, 2],
      [1, 3, 5],
      [2, 3, 8],
      [2, 4, 10],
      [3, 4, 2],
    ];
    const adjacencyList: WeightedAdjacencyList = Array.from({ length: 5 }, () => []);
    for (const [a, b, length] of edges) {
      adjacencyList[a]!.push([b, length]);
      adjacencyList[b]!.push([a, length]);
    }

    const [kruskalLength] = mstKruskalAlgorithm([...edges], 5);
    const [primLength] = mstPrimAlgorithm(adjacencyList);

    expect(kruskalLength).toBe(primLength);
  });
});

describe('minimalSpanningTree dispatcher', () => {
  it('dispatches to Kruskal', () => {
    const edges: WeightedEdge[] = [
      [0, 1, 1],
      [1, 2, 2],
      [0, 2, 3],
    ];

    const [length] = minimalSpanningTree(edges, MinimalSpanningTreeAlgorithm.KRUSKAL_ALGORITHM);

    expect(length).toBe(3);
  });

  it('dispatches to Prim', () => {
    const adjacencyList: WeightedAdjacencyList = [
      [
        [1, 1],
        [2, 3],
      ],
      [
        [0, 1],
        [2, 2],
      ],
      [
        [0, 3],
        [1, 2],
      ],
    ];

    const [length] = minimalSpanningTree(adjacencyList, MinimalSpanningTreeAlgorithm.PRIM_ALGORITHM);

    expect(length).toBe(3);
  });
});
