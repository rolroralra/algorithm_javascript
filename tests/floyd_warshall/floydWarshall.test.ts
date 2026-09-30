import { describe, expect, it } from 'vitest';
import { INFINITY, floydWarshall, shortestPath } from '../../src/floyd_warshall/floydWarshall';

function buildMatrix(n: number, edges: [number, number, number][]): number[][] {
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(INFINITY));
  for (const [a, b, weight] of edges) {
    matrix[a]![b] = weight;
  }
  return matrix;
}

describe('floydWarshall', () => {
  it('self distance is zero', () => {
    const matrix = buildMatrix(3, [
      [0, 1, 1],
      [1, 2, 1],
    ]);

    const [distance] = floydWarshall(matrix);

    expect(distance[0]![0]).toBe(0);
    expect(distance[1]![1]).toBe(0);
    expect(distance[2]![2]).toBe(0);
  });

  it('finds shortest distances through an intermediate node', () => {
    const matrix = buildMatrix(4, [
      [0, 1, 1],
      [1, 2, 2],
      [0, 2, 4],
      [2, 3, 1],
    ]);

    const [distance] = floydWarshall(matrix);

    expect(distance[0]![2]).toBe(3);
    expect(distance[0]![3]).toBe(4);
  });

  it('an unreachable pair stays infinite', () => {
    const matrix = buildMatrix(3, [[0, 1, 1]]);

    const [distance] = floydWarshall(matrix);

    expect(distance[0]![2]).toBe(INFINITY);
    expect(distance[2]![0]).toBe(INFINITY);
  });

  it('reconstructs the shortest path', () => {
    const matrix = buildMatrix(4, [
      [0, 1, 1],
      [1, 2, 2],
      [0, 2, 4],
      [2, 3, 1],
    ]);

    const [, prevIndex] = floydWarshall(matrix);

    expect(shortestPath(prevIndex, 0, 3)).toEqual([0, 1, 2, 3]);
  });

  it('returns an empty list when there is no path', () => {
    const matrix = buildMatrix(3, [[0, 1, 1]]);

    const [, prevIndex] = floydWarshall(matrix);

    expect(shortestPath(prevIndex, 0, 2)).toEqual([]);
  });

  it('prefers a direct edge over a longer route', () => {
    const matrix = buildMatrix(3, [
      [0, 1, 1],
      [1, 2, 1],
      [0, 2, 1],
    ]);

    const [distance] = floydWarshall(matrix);

    expect(distance[0]![2]).toBe(1);
  });
});
