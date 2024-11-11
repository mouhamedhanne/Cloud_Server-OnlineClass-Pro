import { getCourses } from "./courses/courses.actions";
import { getSpecialties } from "../specialities.action";
import { NewCourseDialog } from "./courses/NewCourse";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/src/components/Layout/Layout";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight, Undo2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  params: { levelId: string; specialtyId: string };
}

export default async function CoursesPage({ params }: Props) {
  const { data: courses } = await getCourses(params.specialtyId);
  const { data: specialties } = await getSpecialties(params.levelId);
  const specialty = specialties?.find((s) => s.id === params.specialtyId);

  if (!specialty) {
    notFound();
  }

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
              <BreadcrumbPage>{specialty.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <LayoutTitle>Spécialités - {specialty.name}</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Link href={`/levels/${params.levelId}`}>
          <Button variant="outline">
            <Undo2 className="mr-2 h-4 w-4" /> Retour aux spécialités
          </Button>
        </Link>
      </LayoutActions>
      <LayoutContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course) => (
              <Card
                key={course.id}
                className="transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    {course.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.chapters.length} chapitres disponibles
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/levels/${params.levelId}/specialties/${params.specialtyId}/courses/${course.id}`}
                    className="w-full"
                  >
                    <Button className="w-full transition-all duration-300 hover:bg-primary-dark">
                      Voir les chapitres
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <NewCourseDialog specialtyId={params.specialtyId} />
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
}
