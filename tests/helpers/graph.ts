/** Builds an adjacency list for an undirected graph from an edge list. */
export function undirectedAdjacencyList(edges: [number, number][], vertexCount: number): number[][] {
  const adjacencyList: number[][] = Array.from({ length: vertexCount }, () => []);
  for (const [a, b] of edges) {
    adjacencyList[a]!.push(b);
    adjacencyList[b]!.push(a);
  }
  return adjacencyList;
}
