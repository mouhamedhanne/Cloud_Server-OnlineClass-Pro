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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export default async function LevelsPage() {
  const { data: levels } = await getLevels();

  return (
    <Layout>
      <LayoutHeader>
        <Breadcrumb className="mt-3 ml-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin">Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Cours</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <LayoutTitle>Niveaux d'études</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <NewLevelDialog />
      </LayoutActions>
      <LayoutContent>
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels?.map((level) => (
              <Card
                key={level.id}
                className="transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {level.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <p className="text-sm text-gray-600">
                      {level.specialties.length} spécialité
                      {level.specialties.length > 1 ? "s" : ""}
                    </p>
                    <Link href={`/levels/${level.id}`} className="w-full">
                      <Button className="w-full transition-all duration-300 hover:bg-primary-dark">
                        Voir les spécialités
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
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
