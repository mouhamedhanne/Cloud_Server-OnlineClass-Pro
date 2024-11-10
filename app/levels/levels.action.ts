'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/src/lib/prisma'
import { getRequiredAuthSession } from '@/src/lib/auth'

export async function createLevel({
  name,
}: {
  name: string
}) {
  const session = await getRequiredAuthSession()

  try {
    const level = await prisma.level.create({
      data: {
        name,
        creatorId: session.user.id
      }
    })

    revalidatePath('/levels')
    return { success: true, data: level }
  } catch (error) {
    console.error('Error creating level:', error)
    return { success: false, error: 'Failed to create level' }
  }
}

export async function updateLevel({
  id,
  name,
}: {
  id: string
  name: string
  description?: string
}) {
  const session = await getRequiredAuthSession()

  try {
    const level = await prisma.level.update({
      where: {
        id,
        creatorId: session.user.id
      },
      data: {
        name,
      }
    })

    revalidatePath(`/levels/${id}`)
    return { success: true, data: level }
  } catch (error) {
    console.error('Error updating level:', error)
    return { success: false, error: 'Failed to update level' }
  }
}

export async function deleteLevel(id: string) {
  const session = await getRequiredAuthSession()

  try {
    await prisma.level.delete({
      where: {
        id,
        creatorId: session.user.id
      }
    })

    revalidatePath('/levels')
    return { success: true }
  } catch (error) {
    console.error('Error deleting level:', error)
    return { success: false, error: 'Failed to delete level' }
  }
}

export async function getLevels() {
  const session = await getRequiredAuthSession()

  try {
    const levels = await prisma.level.findMany({
      where: {
        creatorId: session.user.id
      },
      include: {
        specialties: true
      }
    })

    return { success: true, data: levels }
  } catch (error) {
    console.error('Error fetching levels:', error)
    return { success: false, error: 'Failed to fetch levels' }
  }
}