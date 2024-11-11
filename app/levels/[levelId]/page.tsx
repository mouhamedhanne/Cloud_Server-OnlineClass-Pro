import { getSpecialties } from "./specialties/specialities.action";
import { getLevels } from "../levels.action";
import { NewSpecialtyDialog } from "./specialties/NewSpecialities";
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
import { ChevronRight, Undo2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  params: { levelId: string };
}

export default async function SpecialtiesPage({ params }: Props) {
  const { data: specialties } = await getSpecialties(params.levelId);
  const { data: levels } = await getLevels();
  const level = levels?.find((l) => l.id === params.levelId);

  if (!level) {
    notFound();
  }

  return (
    <Layout>
      <LayoutHeader>
        <Breadcrumb className="mt-3 mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/levels`}>Niveaux</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage> {level.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <LayoutTitle>{level.name} - Spécialités</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Link href="/levels">
          <Button variant="outline">
            <Undo2 className="mr-2 h-4 w-4" /> Retour aux niveaux
          </Button>
        </Link>
      </LayoutActions>
      <LayoutContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties?.map((specialty) => (
              <Card
                key={specialty.id}
                className="transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {specialty.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <p className="text-sm text-gray-600">
                      {specialty.courses.length} cours
                    </p>
                    <Link
                      href={`/levels/${params.levelId}/specialties/${specialty.id}`}
                      className="w-full"
                    >
                      <Button className="w-full transition-all duration-300 hover:bg-primary-dark">
                        Voir les cours
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <NewSpecialtyDialog levelId={params.levelId} />
        </div>
      </LayoutContent>
    </Layout>
  );
}
