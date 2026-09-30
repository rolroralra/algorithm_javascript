import { describe, expect, it, vi } from 'vitest';
import { backtracking, backtrackingInternals } from '../../src/backtracking/backtracking';

describe('backtracking', () => {
  it('unwinds all visit marks after full traversal', () => {
    const graph = [[1, 2], [0, 3], [0], [1]];
    const isVisited = new Array(graph.length).fill(false);

    backtracking(graph, isVisited, 0);

    expect(isVisited).toEqual(new Array(graph.length).fill(false));
  });

  it('handles a cyclic graph without infinite recursion', () => {
    const graph = [[1], [2], [0]];
    const isVisited = new Array(graph.length).fill(false);

    backtracking(graph, isVisited, 0);

    expect(isVisited).toEqual(new Array(graph.length).fill(false));
  });

  it('handles a single node with no edges', () => {
    const isVisited = [false];

    backtracking([[]], isVisited, 0);

    expect(isVisited).toEqual([false]);
  });

  it('forwards extra args without error', () => {
    const graph = [[1], [0]];
    const isVisited = [false, false];

    backtracking(graph, isVisited, 0, 'path', 42);

    expect(isVisited).toEqual([false, false]);
  });

  it('stops traversal before visiting when pruning', () => {
    const pruningSpy = vi.spyOn(backtrackingInternals, 'prunning').mockReturnValue(true);
    const graph = [[1, 2], [0], [0]];
    const isVisited = new Array(graph.length).fill(false);

    backtracking(graph, isVisited, 0);

    expect(isVisited).toEqual(new Array(graph.length).fill(false));
    pruningSpy.mockRestore();
  });
});
