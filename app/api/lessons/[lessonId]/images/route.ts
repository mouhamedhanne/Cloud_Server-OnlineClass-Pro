import { NextRequest, NextResponse } from "next/server";
import { s3Client, getSignedUrl } from "@/src/lib/s3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/src/lib/env";
import { getRequiredAuthSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export async function POST(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getRequiredAuthSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName, fileType, fileSize } = await req.json();

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 5MB limit" },
        { status: 400 }
      );
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
        { status: 400 }
      );
    }

    // Verify lesson exists and user has access
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.lessonId,
        chapter: {
          course: {
            specialty: {
              level: {
                creatorId: session.user.id,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found or unauthorized" },
        { status: 404 }
      );
    }

    const key = `lesson-images/${session.user.id}/${params.lessonId}/${Date.now()}_${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.AWS_LESSON_CONTENT_IMAGES_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    const fileUrl = `https://${env.AWS_LESSON_CONTENT_IMAGES_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

    // Create image record in database
    const image = await prisma.image.create({
      data: {
        url: fileUrl,
        key,
        filename: fileName,
        lessonId: params.lessonId,
      },
    });

    return NextResponse.json({
      uploadUrl: signedUrl,
      fileUrl,
      image,
    });
  } catch (error) {
    console.error("Error processing upload request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getRequiredAuthSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const image = await prisma.image.findFirst({
      where: {
        id: imageId,
        lesson: {
          id: params.lessonId,
          chapter: {
            course: {
              specialty: {
                level: {
                  creatorId: session.user.id,
                },
              },
            },
          },
        },
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Image not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete from S3
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_LESSON_CONTENT_IMAGES_BUCKET_NAME,
        Key: image.key,
      })
    );

    // Delete from database
    await prisma.image.delete({
      where: {
        id: imageId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing delete request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request" },
      { status: 500 }
    );
  }
}
