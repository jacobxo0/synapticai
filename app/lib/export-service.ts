import { prisma } from '@/lib/prisma'

export async function exportData(userId: string) {
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId,
    },
    include: {
      mood: true,
      tone: true,
    },
  })

  return entries
} 