import { describe, expect, it } from 'vitest';
import { dfs } from '@/dfs/dfs';

describe.each([
  ['iterative', false],
  ['recursive', true],
] as const)('dfs (%s)', (_label, recursive) => {
  it('visits every reachable node', () => {
    const graph = [[1, 2], [0, 3], [0, 4], [1], [2]];
    const isVisited: boolean[] = new Array(graph.length).fill(false);

    dfs(graph, isVisited, 0, recursive);

    expect(isVisited.every(it => it)).toBeTruthy()
  });

  it('does not visit unreachable nodes', () => {
    const graph = [[1], [0], [3], [2]];
    const isVisited = new Array(graph.length).fill(false);

    dfs(graph, isVisited, 0, recursive);

    expect(isVisited).toEqual([true, true, false, false]);
  });

  it('handles a single node with no edges', () => {
    const graph = [[]];
    const isVisited: boolean[] = [false];

    dfs(graph, isVisited, 0, recursive);

    expect(isVisited.every(it => it)).toBeTruthy()
  });

  it('handles a cyclic graph without infinite looping', () => {
    const graph = [[1], [2], [0]];
    const isVisited: boolean[] = new Array(graph.length).fill(false);

    dfs(graph, isVisited, 0, recursive);

    expect(isVisited.every(it => it)).toBeTruthy()
  });

  it('starts from an arbitrary start index', () => {
    const graph = [[1], [0, 2], [1]];
    const isVisited: boolean[] = new Array(graph.length).fill(false);

    dfs(graph, isVisited, 2, recursive);

    expect(isVisited.every(it => it)).toBeTruthy()
  });
});
