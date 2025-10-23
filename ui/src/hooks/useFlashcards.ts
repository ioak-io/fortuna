import { useState, useEffect } from 'react';
import { FlashcardsService, DueFlashcard } from '@/lib/services/flashcard';
import { useHttp } from '@/lib/shared/http';
import { useTeamStore } from '@/stores/useTeamStore';

export function useFlashcards(unitId: string) {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();
  const flashcardService = FlashcardsService(httpFetch, currentTeam?.id || undefined);

  const [flashcard, setFlashcards] = useState<DueFlashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cards = await flashcardService.getDueFlashcards(unitId);
      setFlashcards(cards);
    } catch (err) {
      console.error('Error fetching due flashcards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch due flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (unitId && currentTeam?.id) {
      refetch();
    }
  }, [unitId, currentTeam?.id]);

  return {
    flashcard,
    isLoading,
    error,
    refetch,
  };
}
