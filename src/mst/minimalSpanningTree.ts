import { notImplemented } from '../shared/notImplemented';

export enum MinimalSpanningTreeAlgorithm {
  KRUSKAL_ALGORITHM = 1,
  PRIM_ALGORITHM = 2,
}

export type WeightedEdge = [a: number, b: number, length: number];
/** adjacencyList[i] holds [nextIndex, edgeLength] pairs for edges leaving vertex i. */
export type WeightedAdjacencyList = [nextIndex: number, edgeLength: number][][];

export function minimalSpanningTree(
  graph: WeightedEdge[] | WeightedAdjacencyList,
  algorithm: MinimalSpanningTreeAlgorithm,
): [mstLength: number, selectedEdges: WeightedEdge[]] {
  notImplemented('minimalSpanningTree');
}

/**
 * Minimal spanning tree by Kruskal's algorithm.
 *
 * @param edgeList edges as (a, b, length) tuples
 * @param vertexSize vertex count; inferred from `edgeList` if omitted
 * @returns [mstLength, selectedEdges]
 */
export function mstKruskalAlgorithm(
  edgeList: WeightedEdge[],
  vertexSize?: number,
): [mstLength: number, selectedEdges: WeightedEdge[]] {
  notImplemented('mstKruskalAlgorithm');
}

/**
 * Minimal spanning tree by Prim's algorithm.
 *
 * @param adjacencyList adjacencyList[i] holds [nextIndex, edgeLength] pairs
 * @returns [mstLength, selectedEdges]
 */
export function mstPrimAlgorithm(
  adjacencyList: WeightedAdjacencyList,
): [mstLength: number, selectedEdges: WeightedEdge[]] {
  notImplemented('mstPrimAlgorithm');
}
