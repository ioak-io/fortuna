import { ChapterDetailsPage } from "@/components/features/chapter";

interface ChapterPageProps {
  params: Promise<{
    chapterId: string;
  }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterId } = await params;
  return <ChapterDetailsPage slug={chapterId} />;
}
