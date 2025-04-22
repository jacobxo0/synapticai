import { PrismaClient } from '@prisma/client';
import { Memory, MemoryStore, MemoryQueryOptions, MemoryType } from '../models/memory';

export class MemoryStoreService implements MemoryStore {
  private prisma: PrismaClient;
  private memories: Memory[] = [];

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async addMemory(memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memory> {
    const newMemory = await this.prisma.memory.create({
      data: {
        ...memory,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    this.memories.push(newMemory);
    return newMemory;
  }

  async getMemories(userId: string, options?: MemoryQueryOptions): Promise<Memory[]> {
    const where: any = {
      userId,
      ...(options?.type && { type: options.type }),
      ...(options?.tags && { tags: { hasSome: options.tags } }),
      ...(options?.minPriority && { priority: { gte: options.minPriority } }),
      ...(options?.minWeight && { weight: { gte: options.minWeight } }),
      ...(options?.includeExpired !== true && {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }),
    };

    const memories = await this.prisma.memory.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { weight: 'desc' },
        { updatedAt: 'desc' }
      ],
      take: options?.limit || 100,
    });

    return memories;
  }

  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    const updatedMemory = await this.prisma.memory.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    const index = this.memories.findIndex(m => m.id === id);
    if (index !== -1) {
      this.memories[index] = updatedMemory;
    }

    return updatedMemory;
  }

  async deleteMemory(id: string): Promise<void> {
    await this.prisma.memory.delete({
      where: { id },
    });

    this.memories = this.memories.filter(m => m.id !== id);
  }

  async cleanup(): Promise<void> {
    // Remove expired memories
    await this.prisma.memory.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Decay weights of old memories
    const oldMemories = await this.prisma.memory.findMany({
      where: {
        updatedAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      },
    });

    for (const memory of oldMemories) {
      await this.updateMemory(memory.id, {
        weight: memory.weight * 0.9, // 10% decay
      });
    }

    // Remove low-weight memories
    await this.prisma.memory.deleteMany({
      where: {
        weight: {
          lt: 0.1,
        },
      },
    });
  }

  // Helper method to calculate memory weight based on age and importance
  private calculateWeight(memory: Memory): number {
    const ageInDays = (Date.now() - memory.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    const decayFactor = Math.exp(-ageInDays / 30); // Exponential decay over 30 days
    return memory.priority * decayFactor;
  }
} 