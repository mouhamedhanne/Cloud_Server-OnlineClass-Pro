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
import { Textarea } from "@/components/ui/textarea";
import { createSpecialty } from "./specialities.action";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

export function NewSpecialtyDialog({ levelId }: { levelId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const result = await createSpecialty({
      name,
      levelId,
    });

    if (result.success) {
      toast.success("Spécialité créer avec succès");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle spécialité
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle spécialité</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la spécialité</Label>
            <Input id="name" name="name" required />
          </div>
          <Button type="submit">Créer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
