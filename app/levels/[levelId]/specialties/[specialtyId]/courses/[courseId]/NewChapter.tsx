'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle } from 'lucide-react'
import { createChapter } from './chapter.action'

export function NewChapterDialog({ courseId }: { courseId: string }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
  
    async function handleSubmit(formData: FormData) {
      const name = formData.get("name") as string;
      
      const result = await createChapter({
        name,
        courseId,
        order: 1000, // Using a high number to add at the end
      });
  
      if (result.success) {
        setOpen(false);
        router.refresh();
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
            <Button type="submit">Créer</Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }