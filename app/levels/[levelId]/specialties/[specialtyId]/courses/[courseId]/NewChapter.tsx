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
import { createChapter } from "./chapter.action";
import { toast } from "sonner";

export function NewChapterDialog({ courseId }: { courseId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const name = formData.get("name") as string;
      const result = await createChapter({
        name,
        courseId,
        order: 1000,
      });
      if (result.success) {
        toast.success("Chapitre créé avec succès");
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la création du chapitre:", error);
      toast.error("Échec de la création du chapitre");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <PlusCircle className="w-4 h-4 mr-2" />
          Nouveau chapitre
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau chapitre</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du chapitre</Label>
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
