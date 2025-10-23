import { useCallback, useEffect, useMemo, useState } from "react";
import { useHttp } from "@/lib/shared/http";
import { env } from "@/lib/shared/env";
import { useTeamStore } from "@/stores/useTeamStore";

export interface UnitTotals {
  team_id: string;
  unit_id: number;
  flashcard: number; // total flashcards in unit
  quiz: number; // total quiz questions in unit
  question: number; // total question questions in unit
}

export interface UserQuizProgressView {
  user_id: string;
  team_id: string;
  unit_id: number;
  attempted: number;
  mastered: number;
  in_progress: number;
  struggling: number;
  due_now: number;
  attempts: number;
  accuracy_avg: number | null;
  time_spent: number | null;
  last_viewed_at: string | null;
}

export interface UserFlashcardProgressView {
  user_id: string;
  team_id: string;
  unit_id: number;
  attempted: number;
  mastered: number;
  in_progress: number;
  struggling: number;
  due_now: number;
  views: number | null;
  time_spent: number | null;
  last_viewed_at: string | null;
}

export interface UserQuestionProgressView {
  user_id: string;
  team_id: string;
  unit_id: number;
  attempted: number;
  mastered: number;
  in_progress: number;
  struggling: number;
  due_now: number;
  attempts: number;
  accuracy_avg: number | null;
  time_spent: number | null;
  last_viewed_at: string | null;
}

export type UseProgressResult = {
  totals: UnitTotals | null;
  quiz: (UserQuizProgressView & { unseen: number; total: number }) | null;
  question: (UserQuestionProgressView & { unseen: number; total: number }) | null;
  flashcard: (UserFlashcardProgressView & { unseen: number; total: number }) | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useProgress(unitId: string): UseProgressResult {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();

  const [totals, setTotals] = useState<UnitTotals | null>(null);
  const [quiz, setQuiz] = useState<UserQuizProgressView | null>(null);
  const [question, setQuestion] = useState<UserQuestionProgressView | null>(null);
  const [flashcard, setFlashcard] = useState<UserFlashcardProgressView | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (currentTeam?.id) h["x-team"] = currentTeam.id;
    return h;
  }, [currentTeam?.id]);

  const refetch = useCallback(async () => {
    if (!unitId || !currentTeam?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      const unitParam = encodeURIComponent(unitId);

      const [totalsRes, quizRes, questionRes, flashRes] = await Promise.all([
        httpFetch(`${env.NEXT_PUBLIC_API_URL}/data/v_unit_totals?unit_id=eq.${unitParam}`, { headers }),
        httpFetch(`${env.NEXT_PUBLIC_API_URL}/data/v_user_quiz_progress?unit_id=eq.${unitParam}`, { headers }),
        httpFetch(`${env.NEXT_PUBLIC_API_URL}/data/v_user_question_progress?unit_id=eq.${unitParam}`, { headers }),
        httpFetch(`${env.NEXT_PUBLIC_API_URL}/data/v_user_flashcard_progress?unit_id=eq.${unitParam}`, { headers }),
      ]);

      if (!totalsRes.ok) {
        const text = await totalsRes.text();
        throw new Error(`v_unit_totals failed: ${totalsRes.status} ${text}`);
      }
      if (!quizRes.ok) {
        const text = await quizRes.text();
        throw new Error(`v_user_quiz_progress failed: ${quizRes.status} ${text}`);
      }
      if (!questionRes.ok) {
        const text = await questionRes.text();
        throw new Error(`v_user_question_progress failed: ${questionRes.status} ${text}`);
      }
      if (!flashRes.ok) {
        const text = await flashRes.text();
        throw new Error(`v_user_flashcard_progress failed: ${flashRes.status} ${text}`);
      }

      const totalsJson: UnitTotals[] = await totalsRes.json();
      const quizJson: UserQuizProgressView[] = await quizRes.json();
      const questionJson: UserQuestionProgressView[] = await questionRes.json();
      const flashJson: UserFlashcardProgressView[] = await flashRes.json();

      setTotals(totalsJson[0] ?? null);
      setQuiz(quizJson[0] ?? null);
      setQuestion(questionJson[0] ?? null);
      setFlashcard(flashJson[0] ?? null);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to fetch progress");
    } finally {
      setIsLoading(false);
    }
  }, [unitId, currentTeam?.id, headers, httpFetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const quizWithTotals = useMemo(() => {
    if (!totals || !quiz) return null;
    const total = totals.quiz || 0;
    if (total <= 0) return null;
    const attempted = quiz.attempted || 0;
    const unseen = Math.max(0, total - attempted);
    return { ...quiz, total, unseen };
  }, [totals, quiz]);

  const questionWithTotals = useMemo(() => {
    if (!totals || !question) return null;
    const total = totals.question || 0;
    if (total <= 0) return null;
    const attempted = question.attempted || 0;
    const unseen = Math.max(0, total - attempted);
    return { ...question, total, unseen };
  }, [totals, question]);

  const flashWithTotals = useMemo(() => {
    if (!totals || !flashcard) return null;
    const total = totals.flashcard || 0;
    if (total <= 0) return null;
    const attempted = flashcard.attempted || 0;
    const unseen = Math.max(0, total - attempted);
    return { ...flashcard, total, unseen };
  }, [totals, flashcard]);

  return {
    totals,
    quiz: quizWithTotals,
    question: questionWithTotals,
    flashcard: flashWithTotals,
    isLoading,
    error,
    refetch,
  };
}
