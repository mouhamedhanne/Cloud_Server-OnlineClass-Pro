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
import { createCourse } from "./courses.actions";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export function NewCourseDialog({ specialtyId }: { specialtyId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true)
      const name = formData.get("name") as string;

    const result = await createCourse({
      name,
      specialtyId,
    });

    if (result.success) {
      toast.success("Cours créer avec succès");
      setOpen(false);
      router.refresh();
    }
    } catch (error) {
      console.error("Erreur lors de la création du cours:", error);
      toast.error("Échec de la création du cours");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau cours
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau cours</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du cours</Label>
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
