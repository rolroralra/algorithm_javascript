import { describe, expect, it } from 'vitest';
import { articulationEdges } from '../../src/articulation/articulationEdge';
import { undirectedAdjacencyList } from '../helpers/graph';

function sortEdges(edges: [number, number][]): [number, number][] {
  return [...edges].sort(([a1, a2], [b1, b2]) => a1 - b1 || a2 - b2);
}

describe('articulationEdges', () => {
  it('triangle has no bridges', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1], [1, 2], [2, 0]], 3);

    expect(articulationEdges(adjacencyList)).toEqual([]);
  });

  it('bridges connecting a cycle to pendant vertices', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1], [1, 2], [2, 0], [1, 3], [3, 4]], 5);

    expect(sortEdges(articulationEdges(adjacencyList))).toEqual([[1, 3], [3, 4]]);
  });

  it('every edge in a simple path is a bridge', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1], [1, 2], [2, 3]], 4);

    expect(sortEdges(articulationEdges(adjacencyList))).toEqual([[0, 1], [1, 2], [2, 3]]);
  });

  it('star graph: every edge is a bridge', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1], [0, 2], [0, 3]], 4);

    expect(sortEdges(articulationEdges(adjacencyList))).toEqual([[0, 1], [0, 2], [0, 3]]);
  });

  it('disconnected components are evaluated independently', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1], [1, 2], [3, 4]], 5);

    expect(sortEdges(articulationEdges(adjacencyList))).toEqual([[0, 1], [1, 2], [3, 4]]);
  });

  it('single vertex with no edges', () => {
    expect(articulationEdges([[]])).toEqual([]);
  });
});
