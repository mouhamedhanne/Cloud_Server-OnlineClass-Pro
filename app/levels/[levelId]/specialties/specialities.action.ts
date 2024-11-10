"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { getRequiredAuthSession } from "@/src/lib/auth";

export async function createSpecialty({
  name,
  levelId,
}: {
  name: string;
  levelId: string;
}) {
  const session = await getRequiredAuthSession();

  try {
    // Verify level belongs to user
    const level = await prisma.level.findUnique({
      where: {
        id: levelId,
        creatorId: session.user.id,
      },
    });

    if (!level) {
      return { success: false, error: "Level not found" };
    }

    const specialty = await prisma.specialty.create({
      data: {
        name,
        levelId,
      },
    });

    revalidatePath(`/levels/${levelId}`);
    return { success: true, data: specialty };
  } catch (error) {
    console.error("Error creating specialty:", error);
    return { success: false, error: "Failed to create specialty" };
  }
}

export async function updateSpecialty({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const session = await getRequiredAuthSession();

  try {
    const specialty = await prisma.specialty.update({
      where: {
        id,
        level: {
          creatorId: session.user.id,
        },
      },
      data: {
        name,
      },
    });

    revalidatePath(`/specialties/${id}`);
    return { success: true, data: specialty };
  } catch (error) {
    console.error("Error updating specialty:", error);
    return { success: false, error: "Failed to update specialty" };
  }
}

export async function deleteSpecialty(id: string) {
  const session = await getRequiredAuthSession();

  try {
    await prisma.specialty.delete({
      where: {
        id,
        level: {
          creatorId: session.user.id,
        },
      },
    });

    revalidatePath("/specialties");
    return { success: true };
  } catch (error) {
    console.error("Error deleting specialty:", error);
    return { success: false, error: "Failed to delete specialty" };
  }
}

export async function getSpecialties(levelId: string) {
  const session = await getRequiredAuthSession();

  try {
    const specialties = await prisma.specialty.findMany({
      where: {
        levelId,
        level: {
          creatorId: session.user.id,
        },
      },
      include: {
        courses: true,
      },
    });

    return { success: true, data: specialties };
  } catch (error) {
    console.error("Error fetching specialties:", error);
    return { success: false, error: "Failed to fetch specialties" };
  }
}
