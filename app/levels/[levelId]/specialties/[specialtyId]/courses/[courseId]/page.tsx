import { prisma } from "@/src/lib/prisma";
import { NewChapterDialog } from "./NewChapter";
import { NewLessonDialog } from "./NewLesson";
import { Card, CardContent } from "@/components/ui/card";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/src/components/Layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight, FileText, Undo2 } from "lucide-react";
import { getCourses } from "../courses.actions";
import { Button } from "@/components/ui/button";

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
    <Layout>
      <LayoutHeader>
        <Breadcrumb className="mt-3 mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/levels">Niveaux</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/levels/${params.levelId}`}>Spécialités</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/levels/${params.levelId}/specialties/${params.specialtyId}`}
                >
                  Cours
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{course.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <LayoutTitle>{course.name} - Chapitres et Leçons</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Link
          href={`/levels/${params.levelId}/specialties/${params.specialtyId}`}
        >
          <Button variant="outline">
            <Undo2 className="mr-2 h-4 w-4" /> Retour aux cours
          </Button>
        </Link>
      </LayoutActions>
      <LayoutContent>
        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {courseWithChapters?.chapters.map((chapter) => (
              <AccordionItem
                key={chapter.id}
                value={chapter.id}
                className="border rounded-lg"
              >
                <AccordionTrigger className="hover:no-underline px-4 py-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="text-lg font-semibold">
                        {chapter.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {chapter.lessons.length} leçons
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 pl-4 pr-4">
                    <div className="space-y-2">
                      {chapter.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/levels/${params.levelId}/specialties/${params.specialtyId}/courses/${params.courseId}/lessons/${lesson.id}`}
                        >
                          <Card className="mb-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-primary" />
                                <span>{lesson.name}</span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4">
                      <NewLessonDialog chapterId={chapter.id} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="flex justify-center mt-8">
            <NewChapterDialog courseId={params.courseId} />
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
}

{
  /**
  <LayoutContent>
        <div className="">
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
                      <span className="text-lg font-semibold">
                        {chapter.name}
                      </span>
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
                          href={`/levels/${params.levelId}/specialties/${params.specialtyId}/courses/${params.courseId}/lessons/${lesson.id}`}
                        >
                          <Card className="mb-2 hover:bg-gray-50 transition-colors">
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
      </LayoutContent>
   */
}
