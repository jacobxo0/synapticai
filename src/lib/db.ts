import { PrismaClient } from '@prisma/client'
import { CacheConfig, CacheEntry } from '@/types'

const prisma = new PrismaClient()

// Cache implementation
class Cache {
  private store: Map<string, CacheEntry<any>>
  private config: CacheConfig

  constructor(config: CacheConfig) {
    this.store = new Map()
    this.config = config
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(this.config.prefix + key)
    if (!entry) return null

    if (entry.expiresAt < Date.now()) {
      this.store.delete(this.config.prefix + key)
      return null
    }

    return entry.value
  }

  async set<T>(key: string, value: T): Promise<void> {
    const entry: CacheEntry<T> = {
      key: this.config.prefix + key,
      value,
      expiresAt: Date.now() + this.config.ttl * 1000,
    }
    this.store.set(entry.key, entry)
  }

  async delete(key: string): Promise<void> {
    this.store.delete(this.config.prefix + key)
  }

  async clear(): Promise<void> {
    this.store.clear()
  }
}

// Database service
export class DatabaseService {
  private cache: Cache

  constructor() {
    this.cache = new Cache({
      ttl: 3600, // 1 hour
      prefix: 'db:',
      fallback: true,
    })
  }

  // User operations
  async createUser(data: { email: string; name?: string }) {
    return prisma.user.create({ data })
  }

  async getUser(id: string) {
    const cached = await this.cache.get(`user:${id}`)
    if (cached) return cached

    const user = await prisma.user.findUnique({
      where: { id },
      include: { conversations: true },
    })

    if (user) {
      await this.cache.set(`user:${id}`, user)
    }

    return user
  }

  // Conversation operations
  async createConversation(data: { title: string; userId: string }) {
    return prisma.conversation.create({ data })
  }

  async getConversation(id: string) {
    const cached = await this.cache.get(`conversation:${id}`)
    if (cached) return cached

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { messages: true },
    })

    if (conversation) {
      await this.cache.set(`conversation:${id}`, conversation)
    }

    return conversation
  }

  // Message operations
  async createMessage(data: {
    content: string
    role: string
    conversationId: string
    metadata?: any
  }) {
    return prisma.message.create({ data })
  }

  async getMessages(conversationId: string) {
    const cached = await this.cache.get(`messages:${conversationId}`)
    if (cached) return cached

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    })

    if (messages.length > 0) {
      await this.cache.set(`messages:${conversationId}`, messages)
    }

    return messages
  }

  // Prompt template operations
  async createPromptTemplate(data: {
    name: string
    content: string
    variables: string[]
    context?: any
  }) {
    return prisma.promptTemplate.create({ data })
  }

  async getPromptTemplate(id: string) {
    const cached = await this.cache.get(`prompt:${id}`)
    if (cached) return cached

    const template = await prisma.promptTemplate.findUnique({
      where: { id },
    })

    if (template) {
      await this.cache.set(`prompt:${id}`, template)
    }

    return template
  }
}

export const db = new DatabaseService() 