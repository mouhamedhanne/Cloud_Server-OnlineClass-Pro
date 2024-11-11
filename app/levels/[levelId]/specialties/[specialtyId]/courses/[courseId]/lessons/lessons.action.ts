import { getRequiredAuthSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteLesson(id: string) {
  const session = await getRequiredAuthSession();

  try {
    await prisma.lesson.delete({
      where: {
        id,
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

    revalidatePath("/lessons");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return { success: false, error: "Failed to delete lesson" };
  }
}
