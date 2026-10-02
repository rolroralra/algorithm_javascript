import { describe, expect, it } from 'vitest';
import { bfs } from '@/bfs/bfs';

// bfs() keeps its visited-state internal and returns nothing, so these tests can only
// confirm it traverses without error for each graph shape.
describe('bfs', () => {
  it('runs without error on a connected graph', () => {
    const graph = [[1, 2], [0, 3], [0, 4], [1], [2]];
    let isVisited: boolean[] = new Array(graph.length).fill(false)

    bfs(graph, isVisited, 0)

    expect(isVisited.every(it => it)).toBeTruthy()
  });

  it('runs without error on a disconnected graph', () => {
    const graph = [[1], [0], [3], [2]];
    let isVisited: boolean[] = new Array(graph.length).fill(false)

    bfs(graph, isVisited, 0)

    expect(isVisited).toEqual([true, true, false, false])
  });

  it('runs without error on a single node with no edges', () => {
    const graph: number[][]  = [[]]
    let isVisited: boolean[] = new Array(0).fill(false)

    bfs(graph, isVisited, 0)

    expect(isVisited.every(it => it)).toBeTruthy()
  });

  it('terminates on a cyclic graph', () => {
    const graph = [[1], [2], [0]];
    let isVisited: boolean[] = new Array(graph.length).fill(false)

    bfs(graph, isVisited, 0)

    expect(isVisited.every(it => it)).toBeTruthy()
  });

  it('starts from an arbitrary start index', () => {
    const graph = [[1], [0, 2], [1]];
    let isVisited: boolean[] = new Array(graph.length).fill(false)

    bfs(graph, isVisited, 2)

    expect(isVisited.every(it => it)).toBeTruthy()
  });

  it('raises on an invalid start index', () => {
    const graph: number[][] = [[0]]
    let isVisited: boolean[] = new Array(graph.length).fill(false)

    expect(() => bfs(graph, isVisited, 5)).toThrow();
  });
});
