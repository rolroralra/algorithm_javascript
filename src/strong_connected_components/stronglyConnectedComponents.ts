import { notImplemented } from '../shared/notImplemented';

/**
 * Strongly Connected Components by Tarjan's Algorithm (single DFS pass, low-link based).
 *
 * @param adjacencyList directed graph adjacency list
 * @returns the list of strongly connected components (each component is a list of vertex indices)
 */
export function sccByTarjan(adjacencyList: number[][]): number[][] {
  notImplemented('sccByTarjan');
}

/**
 * Strongly Connected Components by Kosaraju's Algorithm (two-pass DFS over the graph and its reverse).
 *
 * @param adjacencyList directed graph adjacency list
 * @returns the list of strongly connected components (each component is a list of vertex indices)
 */
export function sccByKosaraju(adjacencyList: number[][]): number[][] {
  notImplemented('sccByKosaraju');
}
