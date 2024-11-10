'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/src/lib/prisma'
import { getRequiredAuthSession } from '@/src/lib/auth'

export async function createChapter({
  name,
  courseId,
  order
}: {
  name: string
  courseId: string
  order: number
}) {
  const session = await getRequiredAuthSession()

  try {
    const chapter = await prisma.chapter.create({
      data: {
        name,
        courseId,
        order
      }
    })

    revalidatePath(`/courses/${courseId}`)
    return { success: true, data: chapter }
  } catch (error) {
    console.error('Error creating chapter:', error)
    return { success: false, error: 'Failed to create chapter' }
  }
}

export async function updateChapter({
  id,
  name,
  order
}: {
  id: string
  name: string
  order?: number
}) {
  const session = await getRequiredAuthSession()

  try {
    const chapter = await prisma.chapter.update({
      where: {
        id,
        course: {
          specialty: {
            level: {
              creatorId: session.user.id
            }
          }
        }
      },
      data: {
        name,
        order
      }
    })

    revalidatePath(`/chapters/${id}`)
    return { success: true, data: chapter }
  } catch (error) {
    console.error('Error updating chapter:', error)
    return { success: false, error: 'Failed to update chapter' }
  }
}

export async function createLesson({
  name,
  chapterId,
  order
}: {
  name: string
  chapterId: string
  order: number
}) {
  const session = await getRequiredAuthSession()

  try {
    const lesson = await prisma.lesson.create({
      data: {
        name,
        chapterId,
        order
      }
    })

    revalidatePath(`/chapters/${chapterId}`)
    return { success: true, data: lesson }
  } catch (error) {
    console.error('Error creating lesson:', error)
    return { success: false, error: 'Failed to create lesson' }
  }
}

export async function updateLesson({
  id,
  name,
  order
}: {
  id: string
  name: string
  order?: number
}) {
  const session = await getRequiredAuthSession()

  try {
    const lesson = await prisma.lesson.update({
      where: {
        id,
        chapter: {
          course: {
            specialty: {
              level: {
                creatorId: session.user.id
              }
            }
          }
        }
      },
      data: {
        name,
        order
      }
    })

    revalidatePath(`/lessons/${id}`)
    return { success: true, data: lesson }
  } catch (error) {
    console.error('Error updating lesson:', error)
    return { success: false, error: 'Failed to update lesson' }
  }
}

export async function deleteLesson(id: string) {
  const session = await getRequiredAuthSession()

  try {
    await prisma.lesson.delete({
      where: {
        id,
        chapter: {
          course: {
            specialty: {
              level: {
                creatorId: session.user.id
              }
            }
          }
        }
      }
    })

    revalidatePath('/lessons')
    return { success: true }
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return { success: false, error: 'Failed to delete lesson' }
  }
}

export async function getLessons(chapterId: string) {
  const session = await getRequiredAuthSession()

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        chapterId,
        chapter: {
          course: {
            specialty: {
              level: {
                creatorId: session.user.id
              }
            }
          }
        }
      },
      include: {
        images: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return { success: true, data: lessons }
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return { success: false, error: 'Failed to fetch lessons' }
  }
}