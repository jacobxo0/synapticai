import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { contextEngine } from '@/lib/ai/context';
import { GET, POST, PUT, DELETE } from '../messages/route';

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    message: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    conversation: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock Context Engine
jest.mock('@/lib/ai/context', () => ({
  contextEngine: {
    getContext: jest.fn(),
    updateContext: jest.fn(),
  },
}));

describe('Messages API', () => {
  const mockSession = {
    user: { id: 'user-123', email: 'test@example.com' },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const mockConversation = {
    id: 'conv-123',
    userId: 'user-123',
    title: 'Test Conversation',
  };

  const mockMessage = {
    id: 'msg-123',
    content: 'Test message',
    role: 'user',
    conversationId: 'conv-123',
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('GET /api/messages', () => {
    it('should return messages for a valid conversation', async () => {
      const mockRequest = new NextRequest(
        new URL('http://localhost:3000/api/messages?conversationId=conv-123')
      );

      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue(mockConversation);
      (prisma.message.findMany as jest.Mock).mockResolvedValue([mockMessage]);

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0]).toEqual(mockMessage);
    });

    it('should handle pagination correctly', async () => {
      const mockRequest = new NextRequest(
        new URL('http://localhost:3000/api/messages?conversationId=conv-123&limit=10&cursor=msg-123')
      );

      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue(mockConversation);
      (prisma.message.findMany as jest.Mock).mockResolvedValue([mockMessage]);

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prisma.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          cursor: { id: 'msg-123' },
        })
      );
    });

    it('should return 401 when unauthorized', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      
      const mockRequest = new NextRequest(
        new URL('http://localhost:3000/api/messages?conversationId=conv-123')
      );

      const response = await GET(mockRequest);
      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent conversation', async () => {
      const mockRequest = new NextRequest(
        new URL('http://localhost:3000/api/messages?conversationId=non-existent')
      );

      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await GET(mockRequest);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/messages', () => {
    const mockRequestBody = {
      content: 'New message',
      role: 'user',
      conversationId: 'conv-123',
    };

    it('should create a new message successfully', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/messages',
        {
          method: 'POST',
          body: JSON.stringify(mockRequestBody),
        }
      );

      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue(mockConversation);
      (prisma.message.create as jest.Mock).mockResolvedValue(mockMessage);
      (contextEngine.getContext as jest.Mock).mockResolvedValue({ history: [] });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockMessage);
    });

    it('should handle Claude context updates for user messages', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/messages',
        {
          method: 'POST',
          body: JSON.stringify(mockRequestBody),
        }
      );

      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue(mockConversation);
      (prisma.message.create as jest.Mock).mockResolvedValue(mockMessage);
      (contextEngine.getContext as jest.Mock).mockResolvedValue({ history: [] });

      await POST(mockRequest);

      expect(contextEngine.updateContext).toHaveBeenCalledWith(
        'user-123',
        'conv-123',
        expect.objectContaining({
          history: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: 'New message',
            }),
          ]),
        })
      );
    });

    it('should validate request body', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/messages',
        {
          method: 'POST',
          body: JSON.stringify({}),
        }
      );

      const response = await POST(mockRequest);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/messages', () => {
    it('should update a message successfully', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/messages/msg-123',
        {
          method: 'PUT',
          body: JSON.stringify({ content: 'Updated content' }),
        }
      );

      (prisma.message.findUnique as jest.Mock).mockResolvedValue(mockMessage);
      (prisma.message.update as jest.Mock).mockResolvedValue({
        ...mockMessage,
        content: 'Updated content',
      });

      const response = await PUT(mockRequest, { params: { id: 'msg-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.content).toBe('Updated content');
    });

    it('should return 404 for non-existent message', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/messages/msg-999',
        {
          method: 'PUT',
          body: JSON.stringify({ content: 'Updated content' }),
        }
      );

      (prisma.message.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await PUT(mockRequest, { params: { id: 'msg-999' } });
      expect(response.status).toBe(404);
    });

    it('should validate update payload', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/messages/msg-123',
        {
          method: 'PUT',
          body: JSON.stringify({ content: '' }),
        }
      );

      (prisma.message.findUnique as jest.Mock).mockResolvedValue(mockMessage);

      const response = await PUT(mockRequest, { params: { id: 'msg-123' } });
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/messages', () => {
    it('should delete a message successfully', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/messages/msg-123',
        { method: 'DELETE' }
      );

      (prisma.message.findUnique as jest.Mock).mockResolvedValue(mockMessage);
      (prisma.message.delete as jest.Mock).mockResolvedValue(mockMessage);

      const response = await DELETE(mockRequest, { params: { id: 'msg-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should return 404 for non-existent message', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/messages/msg-999',
        { method: 'DELETE' }
      );

      (prisma.message.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await DELETE(mockRequest, { params: { id: 'msg-999' } });
      expect(response.status).toBe(404);
    });
  });
}); 