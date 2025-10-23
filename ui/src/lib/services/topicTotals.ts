import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface TopicTotals {
  team_id: string;
  unit_id: number;
  topic_id: number;
  flashcard: number;
  quiz: number;
  question: number;
}

export function TopicTotalsService(httpFetch: HttpFetch) {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  return {
    async getTopicTotals(topicIds: number[]): Promise<TopicTotals[]> {
      if (topicIds.length === 0) return [];
      
      const topicIdList = topicIds.join(',');
      const res = await httpFetch(`${baseUrl}/data/v_topic_totals?topic_id=in.(${topicIdList})`, { 
        method: "GET" 
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch topic totals: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },
  };
}
