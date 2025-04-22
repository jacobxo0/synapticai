import { useEffect, useCallback } from 'react'
import { useApi } from './useApi'
import { useMessagesStore } from '@/store/messages'
import type { Message } from '@/types/message'

interface MessagesHook {
  messages: Message[] | null;
  error: Error | null;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<Message>;
  updateMessageContent: (id: string, content: string) => Promise<Message>;
  deleteMessage: (id: string) => Promise<void>;
}

interface MessageResponse {
  data: Message;
  message?: string;
}

const MAX_MESSAGE_LENGTH = 2000;

const validateMessageContent = (content: string): void => {
  if (!content?.trim()) {
    throw new Error('Message content cannot be empty');
  }
  if (content.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message content exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
  }
};

const validateMessageId = (id: string): void => {
  if (!id?.trim()) {
    throw new Error('Message ID is required');
  }
};

export function useMessages(conversationId: string): MessagesHook {
  if (!conversationId?.trim()) {
    throw new Error('Conversation ID is required');
  }

  const { data, error, isLoading, fetchData } = useApi<Message[]>(`/conversations/${conversationId}/messages`)
  const { setMessages, addMessage, updateMessage, removeMessage } = useMessagesStore()

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setMessages(conversationId, data)
    }
  }, [data, conversationId, setMessages])

  const sendMessage = useCallback(async (content: string): Promise<Message> => {
    try {
      validateMessageContent(content);

      const response = await fetchData<MessageResponse>({
        method: 'POST',
        body: { content: content.trim() },
      });

      if (!response?.data) {
        throw new Error('Invalid response format');
      }

      const newMessage = response.data;
      addMessage(conversationId, newMessage);
      return newMessage;
    } catch (err) {
      throw new Error(
        err instanceof Error 
          ? `Failed to send message: ${err.message}` 
          : 'Failed to send message'
      );
    }
  }, [fetchData, addMessage, conversationId]);

  const updateMessageContent = useCallback(async (
    id: string, 
    content: string
  ): Promise<Message> => {
    try {
      validateMessageId(id);
      validateMessageContent(content);

      const response = await fetchData<MessageResponse>({
        method: 'PUT',
        path: `/${id}`,
        body: { content: content.trim() },
      });

      if (!response?.data) {
        throw new Error('Invalid response format');
      }

      const updatedMessage = response.data;
      updateMessage(conversationId, updatedMessage);
      return updatedMessage;
    } catch (err) {
      throw new Error(
        err instanceof Error 
          ? `Failed to update message: ${err.message}` 
          : 'Failed to update message'
      );
    }
  }, [fetchData, updateMessage, conversationId]);

  const deleteMessage = useCallback(async (id: string): Promise<void> => {
    try {
      validateMessageId(id);

      await fetchData({
        method: 'DELETE',
        path: `/${id}`,
      });
      removeMessage(conversationId, id);
    } catch (err) {
      throw new Error(
        err instanceof Error 
          ? `Failed to delete message: ${err.message}` 
          : 'Failed to delete message'
      );
    }
  }, [fetchData, removeMessage, conversationId]);

  return {
    messages: data,
    error,
    isLoading,
    sendMessage,
    updateMessageContent,
    deleteMessage,
  }
} 