import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface UserUnitProgress {
  user_id: string;
  team_id: string;
  unit_id: number;
  last_accessed_at: string;
  // flashcards
  flashcards_attempted: number;
  flashcards_mastered: number;
  flashcards_in_progress: number;
  flashcards_struggling: number;
  flashcards_due_now: number;
  flashcard_views_total: number;
  flashcard_time_spent_total: number;
  // quizzes
  quiz_questions_attempted: number;
  quiz_questions_mastered: number;
  quiz_questions_in_progress: number;
  quiz_questions_struggling: number;
  quiz_attempts_total: number;
  quiz_questions_due_now: number;
  quiz_accuracy_avg: number;
  // studyguides
  studyguides_attempted: number;
  studyguides_mastered: number;
  studyguides_in_progress: number;
  studyguides_struggling: number;
  studyguide_views_total: number;
  studyguide_time_spent_total: number;
  quiz_time_spent_total: number;
  // percentages
  inprogress_percent: number;
  struggling_percent: number;
  mastered_percent: number;
  unseen_percent: number;
  time_spent_total: number;
}

export interface UserChapterProgress {
  user_id: string;
  team_id: string;
  chapter_id: number;
  last_accessed_at: string;
  // totals
  total_flashcards: number;
  total_quiz_questions: number;
  total_studyguides: number;
  // flashcards
  flashcards_attempted: number;
  flashcards_mastered: number;
  flashcards_in_progress: number;
  flashcards_struggling: number;
  flashcards_due_now: number;
  flashcard_views_total: number;
  flashcard_time_spent_total: number;
  // quizzes
  quiz_questions_attempted: number;
  quiz_questions_mastered: number;
  quiz_questions_in_progress: number;
  quiz_questions_struggling: number;
  quiz_attempts_total: number;
  quiz_questions_due_now: number;
  avg_quiz_accuracy: number;
  inprogress_percent: number;
  struggling_percent: number;
  mastered_percent: number;
  unseen_percent: number;
  // studyguides
  studyguides_attempted: number;
  studyguides_mastered: number;
  studyguides_in_progress: number;
  studyguides_struggling: number;
  studyguide_views_total: number;
  studyguide_time_spent_total: number;
  quiz_time_spent_total: number;
  // completion metrics
  chapter_completion_percent: number;
  units_started: number;
  units_completed: number;
  time_spent_total: number;
}

export interface UserCourseProgress {
  user_id: string;
  team_id: string;
  course_id: number;
  last_accessed_at: string;
  time_spent_total: number;
  total_flashcards: number;
  total_quiz_questions: number;
  total_studyguides: number;
  flashcards_attempted: number;
  flashcards_mastered: number;
  flashcards_in_progress: number;
  flashcards_struggling: number;
  flashcard_views_total: number;
  flashcard_time_spent_total: number;
  quiz_questions_attempted: number;
  quiz_questions_mastered: number;
  quiz_questions_in_progress: number;
  quiz_questions_struggling: number;
  quiz_attempts_total: number;
  quiz_time_spent_total: number;
  avg_quiz_accuracy: number;
  studyguides_attempted: number;
  studyguides_mastered: number;
  studyguides_in_progress: number;
  studyguides_struggling: number;
  studyguide_views_total: number;
  studyguide_time_spent_total: number;
  course_completion_percent: number;
  chapters_started: number;
  chapters_completed: number;
}

export function ProgressMetricsService(httpFetch: HttpFetch) {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  return {
    async getUserUnitProgress(unitIds: number[]): Promise<UserUnitProgress[]> {
      if (unitIds.length === 0) return [];
      
      const unitIdList = unitIds.join(',');
      const res = await httpFetch(`${baseUrl}/data/v_user_unit_progress?unit_id=in.(${unitIdList})`, { 
        method: "GET" 
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch user unit progress: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },

    async getUserChapterProgress(chapterId: number): Promise<UserChapterProgress[]> {
      const res = await httpFetch(`${baseUrl}/data/v_user_chapter_progress?chapter_id=eq.${chapterId}`, { 
        method: "GET" 
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch user chapter progress: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },

    async getUserCourseProgress(courseId: number): Promise<UserCourseProgress[]> {
      const res = await httpFetch(`${baseUrl}/data/v_user_course_progress?course_id=eq.${courseId}`, { 
        method: "GET" 
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch user course progress: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },
  };
}
