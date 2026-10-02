import { describe, expect, it } from 'vitest';
import {
  INFINITY,
  dijkstraByHeapq,
  dijkstraByPriorityQueue,
  shortestPath,
  type WeightedAdjacencyList,
} from '@/dijkstra/dijkstra';

function sampleGraph(): WeightedAdjacencyList {
  // 0 --1--> 1 --2--> 2
  //  \--4--> 2
  //          2 --1--> 3
  return [
    [
      [1, 1],
      [2, 4],
    ],
    [[2, 2]],
    [[3, 1]],
    [],
  ];
}

const implementations = {
  priorityQueue: dijkstraByPriorityQueue,
  heapq: dijkstraByHeapq,
} as const;

describe.each(Object.entries(implementations))('dijkstra (%s)', (_label, dijkstra) => {
  it('start node distance is zero', () => {
    const [distance] = dijkstra(sampleGraph(), 0);
    expect(distance[0]).toBe(0);
  });

  it('finds shortest distances', () => {
    const [distance] = dijkstra(sampleGraph(), 0);
    expect(distance).toEqual([0, 1, 3, 4]);
  });

  it('keeps an infinite distance for an unreachable node', () => {
    const graph: WeightedAdjacencyList = [[[1, 1]], [], []];

    const [distance] = dijkstra(graph, 0);

    expect(distance[2]).toBe(INFINITY);
  });

  it('reconstructs the shortest path', () => {
    const [, prevIndex] = dijkstra(sampleGraph(), 0);

    expect(shortestPath(prevIndex, 3)).toEqual([0, 1, 2, 3]);
  });

  it('the path to the start node is itself', () => {
    const [, prevIndex] = dijkstra(sampleGraph(), 0);

    expect(shortestPath(prevIndex, 0)).toEqual([0]);
  });
});

describe('dijkstra implementations agreement', () => {
  it('both implementations agree on distances', () => {
    const graph = sampleGraph();
    const [distancePq] = dijkstraByPriorityQueue(graph, 0);
    const [distanceHeap] = dijkstraByHeapq(graph, 0);

    expect(distancePq).toEqual(distanceHeap);
  });
});
