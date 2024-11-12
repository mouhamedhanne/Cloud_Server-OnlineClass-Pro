import { prisma } from "@/src/lib/prisma";
import { getRequiredAuthSession } from "@/src/lib/auth";
import { deleteImageFromS3 } from "@/src/lib/deleteS3";
import { revalidatePath } from "next/cache";

export async function deleteCourseWithContent(courseId: string) {
  const session = await getRequiredAuthSession();

  try {
    const courseWithContent = await prisma.course.findUnique({
      where: {
        id: courseId,
        specialty: {
          level: {
            creatorId: session.user.id,
          },
        },
      },
      include: {
        chapters: {
          include: {
            lessons: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!courseWithContent) {
      return { success: false, error: "Course not found" };
    }

    const deletePromises: Promise<boolean>[] = [];
    courseWithContent.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        lesson.images.forEach((image) => {
          deletePromises.push(deleteImageFromS3(image.key));
        });
      });
    });

    await Promise.all(deletePromises);

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}

export async function deleteChapterWithContent(chapterId: string) {
  const session = await getRequiredAuthSession();

  try {
    const chapterWithContent = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        course: {
          specialty: {
            level: {
              creatorId: session.user.id,
            },
          },
        },
      },
      include: {
        lessons: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!chapterWithContent) {
      return { success: false, error: "Chapter not found" };
    }

    const deletePromises: Promise<boolean>[] = [];
    chapterWithContent.lessons.forEach((lesson) => {
      lesson.images.forEach((image) => {
        deletePromises.push(deleteImageFromS3(image.key));
      });
    });

    await Promise.all(deletePromises);

    await prisma.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    revalidatePath("/chapters");
    return { success: true };
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return { success: false, error: "Failed to delete chapter" };
  }
}

export async function deleteLessonWithContent(lessonId: string) {
  const session = await getRequiredAuthSession();

  try {
    const lessonWithImages = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
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
      include: {
        images: true,
      },
    });

    if (!lessonWithImages) {
      return { success: false, error: "Lesson not found" };
    }

    const deletePromises = lessonWithImages.images.map((image) =>
      deleteImageFromS3(image.key)
    );

    await Promise.all(deletePromises);

    await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    revalidatePath("/lessons");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return { success: false, error: "Failed to delete lesson" };
  }
}
