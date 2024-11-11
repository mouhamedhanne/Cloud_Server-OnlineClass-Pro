import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteLessonButton } from "./DeleteLesson";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/src/components/Layout/Layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  GraduationCap,
  Layers,
  Undo2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { LessonImage } from "./types";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/elements/Header";

const ImageUploader = dynamic(() => import("./ImageUploader"), {
  ssr: false,
});

interface Props {
  params: {
    levelId: string;
    specialtyId: string;
    courseId: string;
    chapterId: string;
    lessonId: string;
  };
}

interface LessonWithImages {
  id: string;
  name: string;
  images: LessonImage[];
  chapter: {
    name: string;
    course: {
      name: string;
    };
  };
}

export default async function LessonPage({ params }: Props) {
  const lesson = (await prisma.lesson.findUnique({
    where: {
      id: params.lessonId,
      chapter: {
        id: params.chapterId,
        course: {
          id: params.courseId,
          specialty: {
            id: params.specialtyId,
            level: {
              id: params.levelId,
            },
          },
        },
      },
    },
    include: {
      images: true,
      chapter: {
        select: {
          name: true,
          course: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })) as LessonWithImages | null;

  if (!lesson) {
    notFound();
  }

  return (
    <>
      <Header />
      <Layout>
        <LayoutHeader>
          <Breadcrumb className="mt-3 mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/levels">
                    <GraduationCap className="h-4 w-4 mr-2 inline-block" />
                    Niveaux
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/levels/${params.levelId}/specialties/${params.specialtyId}`}
                  >
                    <Layers className="h-4 w-4 mr-2 inline-block" />
                    Cours
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/levels/${params.levelId}/specialties/${params.specialtyId}/courses/${params.courseId}`}
                  >
                    <BookOpen className="h-4 w-4 mr-2 inline-block" />
                    {lesson.chapter.course.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <FileText className="h-4 w-4 mr-2 inline-block" />
                  {lesson.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <LayoutTitle>{lesson.name}</LayoutTitle>
        </LayoutHeader>
        <LayoutActions>
          <Link
            href={`/levels/${params.levelId}/specialties/${params.specialtyId}/courses/${params.courseId}`}
          >
            <Button variant="outline">
              <Undo2 className="mr-2 h-4 w-4" /> Retour aux cours
            </Button>
          </Link>
        </LayoutActions>
        <LayoutContent>
          <div className="space-y-6 mb-10">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <DeleteLessonButton
                  lessonId={lesson.id}
                  courseId={params.courseId}
                />
              </div>
            </div>

            <ImageUploader
              lessonId={params.lessonId}
              levelId={params.levelId}
              specialtyId={params.specialtyId}
              courseId={params.courseId}
              chapterId={params.chapterId}
              initialImages={lesson.images}
            />
          </div>
        </LayoutContent>
      </Layout>
    </>
  );
}

{
  /**
    import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteLessonButton } from "./DeleteLesson";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/src/components/Layout/Layout";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

interface Props {
  params: {
    levelId: string;
    specialtyId: string;
    courseId: string;
    chapterId: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: Props) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: params.lessonId,
      chapter: {
        id: params.chapterId,
        course: {
          id: params.courseId,
          specialty: {
            id: params.specialtyId,
            level: {
              id: params.levelId,
            },
          },
        },
      },
    },
    include: {
      images: true,
      chapter: {
        select: {
          name: true,
          course: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle></LayoutTitle>
      </LayoutHeader>
      <LayoutActions></LayoutActions>
      <LayoutContent>
        <div className="">
          <div className="mb-6">
            <Link
              href={`/levels/${params.levelId}/specialties/${params.specialtyId}/courses/${params.courseId}`}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au cours
            </Link>

            <div className="flex justify-between items-center mt-4">
              <div>
                <h1 className="text-3xl font-bold">{lesson.name}</h1>
                <p className="text-gray-500">
                  {lesson.chapter.course.name} &gt; {lesson.chapter.name}
                </p>
              </div>
              <DeleteLessonButton
                lessonId={lesson.id}
                courseId={params.courseId}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lesson.images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <Image
                      src={image.url}
                      alt={image.filename}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500">{image.filename}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {lesson.images.length === 0 && (
            <div className="text-center p-12 bg-gray-50 rounded-lg">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Aucune image
              </h3>
              <p className="text-gray-500">
                Cette leçon ne contient pas encore d'images.
              </p>
            </div>
          )}
        </div>
      </LayoutContent>
    </Layout>
  );
}
     */
}
