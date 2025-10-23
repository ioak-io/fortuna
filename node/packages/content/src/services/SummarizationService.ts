export class SummarizationService {
    static async summarize(text: string, authHeaders: Record<string, string>): Promise<string> {
      const response = await fetch(`${process.env.API_URL}/llm/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          uri: "/v1/chat/completions",
          provider: "chatgpt",
          model: "gpt-5-nano",
          payload: {
            messages: [
              { role: "system", content: "Summarize this text into 2–3 clear sentences for study purposes." },
              { role: "user", content: text }
            ]
          }
        })
      });
  
      if (!response.ok) return "";
      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() ?? "";
    }
  
    static async generate(prompt: string, authHeaders: Record<string, string>): Promise<string> {
      const response = await fetch(`${process.env.API_URL}/llm/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          uri: "/v1/chat/completions",
          provider: "chatgpt",
          model: "gpt-5-nano",
          payload: { messages: [{ role: "user", content: prompt }] }
        })
      });
  
      if (!response.ok) return "";
      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() ?? "";
    }
  }
  