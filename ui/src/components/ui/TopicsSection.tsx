"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Circle, FileText, BookMarked, HelpCircle, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-library/ui/card";
import { Button } from "@/components/ui-library/ui/button";
import { Checkbox } from "@/components/ui-library/ui/checkbox";
import { useTopicProgress, type TopicWithProgress } from "@/hooks/useTopicProgress";

// Small donut chart component for topic progress
function TopicProgressDonut({ topic }: { topic: TopicWithProgress }) {
  const progress = topic.progress;
  if (!progress) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground">{topic.totalArtifacts}</span>
      </div>
    );
  }

  const mastered = progress.mastered || 0;
  const inProgress = progress.in_progress || 0;
  const struggling = progress.struggling || 0;
  const attempted = progress.attempted || 0;
  const totalProgress = mastered + inProgress + struggling;
  const unseen = Math.max(0, topic.totalArtifacts - totalProgress);

  if (topic.totalArtifacts === 0) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground">0</span>
      </div>
    );
  }

  const masteredPercent = (mastered / topic.totalArtifacts) * 100;
  const inProgressPercent = (inProgress / topic.totalArtifacts) * 100;
  const strugglingPercent = (struggling / topic.totalArtifacts) * 100;
  const attemptedPercent = (attempted / topic.totalArtifacts) * 100;
  const unseenPercent = (unseen / topic.totalArtifacts) * 100;

  let cumulativePercent = 0;

  return (
    <div className="relative w-8 h-8">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted/20"
        />

        {/* Mastered segment */}
        {mastered > 0 && (
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${masteredPercent} ${100 - masteredPercent}`}
            strokeDashoffset={`${-cumulativePercent}`}
            className="text-emerald-400/70 dark:text-emerald-300/70"
            strokeLinecap="round"
          />
        )}
        {mastered > 0 && (cumulativePercent += masteredPercent)}

        {/* In Progress segment */}
        {inProgress > 0 && (
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${inProgressPercent} ${100 - inProgressPercent}`}
            strokeDashoffset={`${-cumulativePercent}`}
            className="text-yellow-400/70 dark:text-yellow-300/70"
            strokeLinecap="round"
          />
        )}
        {inProgress > 0 && (cumulativePercent += inProgressPercent)}

        {/* Struggling segment */}
        {struggling > 0 && (
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${strugglingPercent} ${100 - strugglingPercent}`}
            strokeDashoffset={`${-cumulativePercent}`}
            className="text-rose-400/70 dark:text-rose-400/70"
            strokeLinecap="round"
          />
        )}
        {struggling > 0 && (cumulativePercent += strugglingPercent)}

        {/* Attempted segment */}
        {attempted > 0 && (
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${attemptedPercent} ${100 - attemptedPercent}`}
            strokeDashoffset={`${-cumulativePercent}`}
            className="text-blue-500"
            strokeLinecap="round"
          />
        )}
        {attempted > 0 && (cumulativePercent += attemptedPercent)}

        {/* Unseen segment */}
        {unseen > 0 && (
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${unseenPercent} ${100 - unseenPercent}`}
            strokeDashoffset={`${-cumulativePercent}`}
            className="text-muted-foreground/50"
            strokeLinecap="round"
          />
        )}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium">{topic.totalArtifacts}</span>
      </div>

      {/* Center text - show highest count with appropriate color */}
      {/* <div className="absolute inset-0 flex items-center justify-center">
        {(() => {
          const maxCount = Math.max(mastered, struggling);
          if (maxCount === 0) {
            return <span className="text-xs font-medium text-muted-foreground">0</span>;
          }

          if (mastered >= struggling) {
            return <span className="text-xs font-medium text-emerald-400/70 dark:text-emerald-300/70">{mastered}</span>;
          } else {
            return <span className="text-xs font-medium text-rose-400/70 dark:text-rose-400/70">{struggling}</span>;
          }
        })()}
      </div> */}
    </div>
  );
}

export interface TopicsSectionProps {
  chapterId?: number;
  unitIds?: number[];
  title?: string;
}

export function TopicsSection({ chapterId, unitIds, title = "Topics" }: TopicsSectionProps) {
  const { topicsWithProgress, counts, isLoading, error } = useTopicProgress({ chapterId, unitIds });
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
  const router = useRouter();
  const { team } = useParams() as { team: string };

  // Handler for topic checkbox toggle
  const handleTopicToggle = (topicId: number) => {
    setSelectedTopicIds(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Handler for select/deselect all topics
  const handleSelectAll = () => {
    if (selectedTopicIds.length === topicsWithProgress.length) {
      setSelectedTopicIds([]);
    } else {
      setSelectedTopicIds(topicsWithProgress.map(t => t.id));
    }
  };

  // Navigation handlers for artifact types
  const handleNavigateToArtifact = (artifactType: 'studyguide' | 'quiz' | 'flashcard') => {
    if (selectedTopicIds.length === 0) return;
    const idsParam = selectedTopicIds.join(',');
    router.push(`/${team}/topics/${artifactType}?ids=${idsParam}`);
  };

  if (isLoading) {
    return (
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading topics...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">Error loading topics: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!topicsWithProgress || topicsWithProgress.length === 0) {
    return (
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No topics found</div>
        </CardContent>
      </Card>
    );
  }

  const total = counts?.total ?? 0;
  const mastered = counts?.mastered ?? 0;
  const inProgress = counts?.in_progress ?? 0;
  const struggling = counts?.struggling ?? 0;
  const unseen = counts?.unseen ?? 0;
  const mPct = total > 0 ? Math.round((mastered / total) * 100) : 0;
  const pPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const sPct = total > 0 ? Math.round((struggling / total) * 100) : 0;
  const uPct = total > 0 ? Math.round((unseen / total) * 100) : 0;

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              {total} topic{total !== 1 ? "s" : ""} total
            </div>
            {topicsWithProgress && topicsWithProgress.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedTopicIds.length === topicsWithProgress.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Action Buttons - Show when topics are selected */}
          {selectedTopicIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <span className="text-sm font-medium text-foreground">
                {selectedTopicIds.length} topic{selectedTopicIds.length !== 1 ? 's' : ''} selected:
              </span>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleNavigateToArtifact('studyguide')}
                className="gap-2"
              >
                <BookMarked className="h-4 w-4" />
                Study Guide
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleNavigateToArtifact('quiz')}
                className="gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Quiz
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleNavigateToArtifact('flashcard')}
                className="gap-2"
              >
                <Layers className="h-4 w-4" />
                Flashcards
              </Button>
            </div>
          )}

          {/* Segmented Progress Bar */}
          {/* <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
            <div className="flex w-full h-full">
              <div className="bg-emerald-400/70 dark:bg-emerald-300/70 h-full" style={{ width: `${mPct}%` }} />
              <div className="bg-yellow-400/70 dark:bg-yellow-300/70 h-full" style={{ width: `${pPct}%` }} />
              <div className="bg-rose-400/70 dark:bg-rose-400/70 h-full" style={{ width: `${sPct}%` }} />
              <div className="h-full bg-muted" style={{ width: `${uPct}%` }} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {mastered > 0 && (
              <div className="flex items-center gap-1">
                <Circle className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                <span className="font-medium">
                  {mastered} mastered
                </span>
              </div>
            )}
            {inProgress > 0 && (
              <div className="flex items-center gap-1">
                <Circle className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">
                  {inProgress} in progress
                </span>
              </div>
            )}
            {struggling > 0 && (
              <div className="flex items-center gap-1">
                <Circle className="h-3 w-3 text-rose-400 fill-rose-400" />
                <span className="font-medium">
                  {struggling} struggling
                </span>
              </div>
            )}
            {unseen > 0 && (
              <div className="flex items-center gap-1">
                <Circle className="h-3 w-3 text-muted-foreground fill-muted-foreground" />
                <span className="font-medium">
                  {unseen} unseen
                </span>
              </div>
            )}
          </div> */}

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {topicsWithProgress
              ?.slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((t) => {
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 p-2 rounded-lg border transition-colors"
                    onClick={() => handleTopicToggle(t.id)}
                  >
                    <Checkbox
                      checked={selectedTopicIds.includes(t.id)}
                      onCheckedChange={() => handleTopicToggle(t.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 border-foreground/40"
                    />
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-primary/80 shrink-0" />
                        <span className="truncate text-sm text-foreground">{t.name}</span>
                      </div>
                      <TopicProgressDonut topic={t} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

