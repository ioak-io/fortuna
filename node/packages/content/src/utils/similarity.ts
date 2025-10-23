export function cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
    return dot / (normA * normB);
  }
  
  export function greedyClusterEmbeddings(
    embeddings: number[][],
    threshold: number
  ) {
    const clusters: number[][] = [];
  
    embeddings.forEach((emb, idx) => {
      let assigned = false;
      for (const cluster of clusters) {
        if (cosineSimilarity(emb, embeddings[cluster[0]]) >= threshold) {
          cluster.push(idx);
          assigned = true;
          break;
        }
      }
      if (!assigned) clusters.push([idx]);
    });
  
    const result: Record<number, number[]> = {};
    clusters.forEach((cluster, i) => (result[i] = cluster));
    return result;
  }
  