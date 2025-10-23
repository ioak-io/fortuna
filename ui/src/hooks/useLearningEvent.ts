import { useCallback } from 'react';
import { LearningEventService, ProcessLearningEventRequest } from '@/lib/services/learningEvent';
import { useHttp } from '@/lib/shared/http';
import { useTeamStore } from '@/stores/useTeamStore';

export function useLearningEvent() {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();

  const processLearningEvent = useCallback(
    async (unitId: number, eventType: string, payload: Record<string, any>) => {
      if (!currentTeam?.id) {
        throw new Error('Team ID is required for processing learning events');
      }

      const request: ProcessLearningEventRequest = {
        p_team_id: currentTeam.id,
        p_unit_id: unitId,
        p_event_type: eventType,
        p_payload: payload,
      };

      try {
        const learningEventService = LearningEventService(httpFetch, currentTeam.id);
        await learningEventService.processLearningEvent(request);
      } catch (err) {
        console.error(`Failed to process event ${eventType}:`, err);
        throw err;
      }
    },
    [currentTeam?.id, httpFetch]
  );

  return {
    processLearningEvent,
  };
}
