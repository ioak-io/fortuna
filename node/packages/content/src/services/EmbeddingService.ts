export class EmbeddingService {
  static async getEmbedding(text: string, authHeaders: Record<string, string>): Promise<number[]> {
    const response = await fetch(`${process.env.API_URL}/llm/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({
        uri: "/v1/embeddings",
        provider: "chatgpt",
        model: "text-embedding-3-small",
        payload: { input: text }
      })
    });

    const data = await response.json();
    return data?.data?.[0]?.embedding ?? [];
  }
}
