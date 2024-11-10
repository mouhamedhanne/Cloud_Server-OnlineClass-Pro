import { getCourses } from "./courses/courses.actions";
import { getSpecialties } from "../specialities.action";
import { NewCourseDialog } from "./courses/NewCourse";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Undo2 } from "lucide-react";

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
        <LayoutTitle> Cours - {specialty.name}</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Link href={`/levels/${params.levelId}`}>
          <Button>
            <Undo2 className="mr-2 h-4 w-4" /> Retour aux spécialités
          </Button>
        </Link>
      </LayoutActions>
      <LayoutContent>
        <div className="">
          <div className="flex justify-between items-center mb-6">
            <NewCourseDialog specialtyId={params.specialtyId} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses?.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <p className="text-sm">
                      {course.chapters.length} chapitres
                    </p>
                    <Link
                      href={`/levels/${params.levelId}/specialties/${params.specialtyId}/courses/${course.id}`}
                    >
                      <Button>Voir les chapitres</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
}
