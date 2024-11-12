"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle } from "lucide-react";
import { createLesson } from "./chapter.action";
import { getLessons } from "./chapter.action";
import { toast } from "sonner";

export function NewLessonDialog({ chapterId }: { chapterId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const name = formData.get("name") as string;

      const lessonsResult = await getLessons(chapterId);
      let newOrder = 1;

      if (lessonsResult.success && Array.isArray(lessonsResult.data)) {
        newOrder =
          lessonsResult.data.length > 0
            ? Math.max(...lessonsResult.data.map((l) => l.order)) + 1
            : 1;
      }

      const result = await createLesson({
        name,
        chapterId,
        order: newOrder,
      });

      if (result.success) {
        toast.success("Leçons créer avec succès");
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la création du leçon:", error);
      toast.error("Échec de la création du leçon");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <PlusCircle className="w-4 h-4 mr-2" />
          Nouvelle leçon
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle leçon</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la leçon</Label>
            <Input id="name" name="name" required />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4" /> : ""} Créer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
