import { describe, expect, it } from 'vitest';
import { bfs } from '../../src/bfs/bfs';

// bfs() keeps its visited-state internal and returns nothing, so these tests can only
// confirm it traverses without error for each graph shape.
describe('bfs', () => {
  it('runs without error on a connected graph', () => {
    const graph = [[1, 2], [0, 3], [0, 4], [1], [2]];
    expect(bfs(graph, 0)).toBeUndefined();
  });

  it('runs without error on a disconnected graph', () => {
    const graph = [[1], [0], [3], [2]];
    expect(bfs(graph, 0)).toBeUndefined();
  });

  it('runs without error on a single node with no edges', () => {
    expect(bfs([[]], 0)).toBeUndefined();
  });

  it('terminates on a cyclic graph', () => {
    const graph = [[1], [2], [0]];
    expect(bfs(graph, 0)).toBeUndefined();
  });

  it('starts from an arbitrary start index', () => {
    const graph = [[1], [0, 2], [1]];
    expect(bfs(graph, 2)).toBeUndefined();
  });

  it('raises on an invalid start index', () => {
    expect(() => bfs([[0]], 5)).toThrow();
  });
});
