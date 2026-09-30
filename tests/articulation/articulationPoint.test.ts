import { describe, expect, it } from 'vitest';
import { articulationPoints } from '../../src/articulation/articulationPoint';
import { undirectedAdjacencyList } from '../helpers/graph';

describe('articulationPoints', () => {
  it('triangle has no articulation points', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1], [1, 2], [2, 0]], 3);

    expect(articulationPoints(adjacencyList)).toEqual([]);
  });

  it('bridge endpoint is an articulation point', () => {
    // triangle 0-1-2 connected to 3 via a bridge, 3 connected to 4
    const adjacencyList = undirectedAdjacencyList([[0, 1], [1, 2], [2, 0], [1, 3], [3, 4]], 5);

    expect([...articulationPoints(adjacencyList)].sort((a, b) => a - b)).toEqual([1, 3]);
  });

  it('simple path has internal nodes as articulation points', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1], [1, 2], [2, 3]], 4);

    expect([...articulationPoints(adjacencyList)].sort((a, b) => a - b)).toEqual([1, 2]);
  });

  it('two-vertex graph has no articulation points', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1]], 2);

    expect(articulationPoints(adjacencyList)).toEqual([]);
  });

  it('single vertex with no edges', () => {
    expect(articulationPoints([[]])).toEqual([]);
  });

  it('star graph: center is the only articulation point', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1], [0, 2], [0, 3]], 4);

    expect(articulationPoints(adjacencyList)).toEqual([0]);
  });

  it('disconnected components are evaluated independently', () => {
    const adjacencyList = undirectedAdjacencyList([[0, 1], [1, 2], [3, 4]], 5);

    expect(articulationPoints(adjacencyList)).toEqual([1]);
  });
});
