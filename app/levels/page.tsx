import { getLevels } from "./levels.action";
import { NewLevelDialog } from "./NewLevel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/src/components/Layout/Layout";

export default async function LevelsPage() {
  const { data: levels } = await getLevels();

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Niveaux d'études</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <NewLevelDialog />
      </LayoutActions>
      <LayoutContent>
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels?.map((level) => (
              <Card key={level.id}>
                <CardHeader>
                  <CardTitle>{level.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <p className="text-sm">
                      {level.specialties.length} spécialités
                    </p>
                    <Link href={`/levels/${level.id}`}>
                      <Button>Voir les spécialités</Button>
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
