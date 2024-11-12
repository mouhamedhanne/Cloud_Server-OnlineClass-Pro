"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { getRequiredAuthSession } from "@/src/lib/auth";

export async function createCourse({
  name,
  specialtyId,
}: {
  name: string;
  specialtyId: string;
}) {
  const session = await getRequiredAuthSession();

  try {
    const specialty = await prisma.specialty.findFirst({
      where: {
        id: specialtyId,
        level: {
          creatorId: session.user.id,
        },
      },
    });

    if (!specialty) {
      return { success: false, error: "Specialty not found" };
    }

    const course = await prisma.course.create({
      data: {
        name,
        specialtyId,
      },
    });

    revalidatePath(`/specialties/${specialtyId}`);
    return { success: true, data: course };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourse({ id, name }: { id: string; name: string }) {
  const session = await getRequiredAuthSession();

  try {
    const course = await prisma.course.update({
      where: {
        id,
        specialty: {
          level: {
            creatorId: session.user.id,
          },
        },
      },
      data: {
        name,
      },
    });

    revalidatePath(`/courses/${id}`);
    return { success: true, data: course };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourse(id: string) {
  const session = await getRequiredAuthSession();

  try {
    await prisma.course.delete({
      where: {
        id,
        specialty: {
          level: {
            creatorId: session.user.id,
          },
        },
      },
    });

    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}

export async function getCourses(specialtyId: string) {
  const session = await getRequiredAuthSession();

  try {
    const courses = await prisma.course.findMany({
      where: {
        specialtyId,
        specialty: {
          level: {
            creatorId: session.user.id,
          },
        },
      },
      include: {
        chapters: true,
      },
    });

    return { success: true, data: courses };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, error: "Failed to fetch courses" };
  }
}
