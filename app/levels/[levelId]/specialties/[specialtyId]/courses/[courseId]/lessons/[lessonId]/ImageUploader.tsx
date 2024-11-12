"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Copy, CheckCircle2, Trash2, ImageIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonImage, ImageUploaderProps } from "./types";
import { toast } from "sonner";

const ImageUploader: React.FC<ImageUploaderProps> = ({
  lessonId,
  levelId,
  specialtyId,
  courseId,
  chapterId,
  initialImages,
}) => {
  const [images, setImages] = useState<LessonImage[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<LessonImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);

      for (const file of acceptedFiles) {
        try {
          const response = await fetch(`/api/lessons/${lessonId}/images`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
            }),
          });

          if (!response.ok) throw new Error("Failed to get upload URL");

          const { uploadUrl, fileUrl, image } = await response.json();

          await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          setImages((prev) => [...prev, image]);
          toast.success("L'image a été ajoutée avec succès à la leçon.");
        } catch (error) {
          console.error("Upload failed:", error);
          toast.error(
            "Une erreur s'est produite lors du téléchargement de l'image."
          );
        }
      }

      setIsUploading(false);
    },
    [lessonId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: 5000000,
  });

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("L'URL de l'image a été copiée dans le presse-papiers.");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(
        `/api/lessons/${lessonId}/images?imageId=${imageId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete image");

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("L'image a été supprimée avec succès.");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        "Une erreur s'est produite lors de la suppression de l'image."
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">
              {isDragActive
                ? "Déposez les images ici..."
                : "Glissez-déposez des images ici, ou cliquez pour sélectionner"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG, WebP jusqu'à 5MB
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={image.url}
                  alt={image.filename}
                  fill
                  className="object-cover cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
              <div className="p-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyUrl(image.url)}
                >
                  {copiedUrl === image.url ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && !isUploading && (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucune image</h3>
          <p className="text-gray-500">
            Cette leçon ne contient pas encore d'images.
          </p>
        </div>
      )}

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.filename}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video">
            {selectedImage && (
              <Image
                src={selectedImage.url}
                alt={selectedImage.filename}
                fill
                className="object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;
