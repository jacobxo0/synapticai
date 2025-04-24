import { PrismaClient } from '@prisma/client';
import boltApi from './bolt-client';
import { prisma } from '@/lib/prisma'

const prismaClient = new PrismaClient();

export class SyncService {
  static async syncUserData(userId: string) {
    try {
      // Fetch user data from Bolt
      const boltUser = await boltApi.getUser(userId);

      // Sync goals
      const goals = await prismaClient.goal.findMany({
        where: { userId },
      });
      await boltApi.syncGoals(userId, goals);

      // Sync mood logs
      const moodLogs = await prismaClient.moodLog.findMany({
        where: { userId },
      });
      await boltApi.syncMoodLogs(userId, moodLogs);

      // Sync conversations
      const conversations = await prismaClient.conversation.findMany({
        where: { userId },
        include: {
          messages: true,
        },
      });
      await boltApi.syncConversations(userId, conversations);

      return {
        success: true,
        message: 'Data synchronized successfully',
      };
    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        message: 'Failed to synchronize data',
        error,
      };
    }
  }

  static async handleWebhook(payload: any, signature: string) {
    // Verify webhook signature
    if (signature !== process.env.BOLT_WEBHOOK_SECRET) {
      throw new Error('Invalid webhook signature');
    }

    const { event, data } = payload;

    switch (event) {
      case 'user.updated':
        await this.handleUserUpdate(data);
        break;
      case 'goal.updated':
        await this.handleGoalUpdate(data);
        break;
      case 'mood_log.created':
        await this.handleMoodLogCreated(data);
        break;
      case 'conversation.updated':
        await this.handleConversationUpdate(data);
        break;
      default:
        console.warn(`Unhandled webhook event: ${event}`);
    }
  }

  private static async handleUserUpdate(data: any) {
    await prismaClient.user.update({
      where: { id: data.userId },
      data: {
        name: data.name,
        email: data.email,
        // Add other fields as needed
      },
    });
  }

  private static async handleGoalUpdate(data: any) {
    await prismaClient.goal.update({
      where: { id: data.goalId },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
      },
    });
  }

  private static async handleMoodLogCreated(data: any) {
    await prismaClient.moodLog.create({
      data: {
        mood: data.mood,
        note: data.note,
        userId: data.userId,
      },
    });
  }

  private static async handleConversationUpdate(data: any) {
    await prismaClient.conversation.update({
      where: { id: data.conversationId },
      data: {
        title: data.title,
        messages: {
          create: data.messages.map((msg: any) => ({
            content: msg.content,
            role: msg.role,
            userId: data.userId,
          })),
        },
      },
    });
  }
}

export async function syncBoltData(data: any) {
  // TODO: Implement Bolt data synchronization
  return { success: true }
} 