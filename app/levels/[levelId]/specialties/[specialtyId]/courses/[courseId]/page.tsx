import { prisma } from "@/src/lib/prisma";
import { NewChapterDialog } from "./NewChapter";
import { NewLessonDialog } from "./NewLesson";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { getCourses } from "../courses.actions";

interface Props {
  params: {
    levelId: string;
    specialtyId: string;
    courseId: string;
  };
}

export default async function ChaptersPage({ params }: Props) {
  const { data: courses } = await getCourses(params.specialtyId);
  const course = courses?.find((c) => c.id === params.courseId);

  if (!course) {
    notFound();
  }

  const courseWithChapters = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        include: {
          lessons: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href={`/levels/${params.levelId}/specialties/${params.specialtyId}`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Retour aux cours
          </Link>
          <h1 className="text-3xl font-bold mt-2">
            {course.name} - Chapitres et Leçons
          </h1>
        </div>
        <NewChapterDialog courseId={params.courseId} />
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {courseWithChapters?.chapters.map((chapter) => (
          <AccordionItem key={chapter.id} value={chapter.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{chapter.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {chapter.lessons.length} leçons
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pl-4">
                <div className="flex justify-between items-center mb-4">
                  <NewLessonDialog chapterId={chapter.id} />
                </div>
                <div className="space-y-2">
                  {chapter.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/levels/${params.levelId}/specialties/${params.specialtyId}/courses/${params.courseId}/chapters/${chapter.id}/lessons/${lesson.id}`}
                    >
                      <Card className="hover:bg-gray-50 transition-colors">
                        <CardContent className="p-4 flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>{lesson.name}</span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
