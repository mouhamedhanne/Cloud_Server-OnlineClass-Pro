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
import { Undo2 } from "lucide-react";

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
        <LayoutTitle> Level - {level.name}</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Link href="/levels">
          <Button>
            <Undo2 className="mr-2 h-4 w-4" /> Retour aux niveaux
          </Button>
        </Link>
      </LayoutActions>
      <LayoutContent>
        <div className="">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mt-2"></h1>
            </div>
            <NewSpecialtyDialog levelId={params.levelId} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties?.map((specialty) => (
              <Card key={specialty.id}>
                <CardHeader>
                  <CardTitle>{specialty.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <p className="text-sm">{specialty.courses.length} cours</p>
                    <Link
                      href={`/levels/${params.levelId}/specialties/${specialty.id}`}
                    >
                      <Button>Voir les cours</Button>
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
