import { useEffect, useCallback } from 'react'
import { useApi } from './useApi'
import { useConversationsStore } from '@/store/conversations'
import type { Conversation } from '@/types/conversation'

interface ConversationsHook {
  conversations: Conversation[] | null;
  error: Error | null;
  isLoading: boolean;
  createConversation: (title: string) => Promise<Conversation>;
  updateConversationTitle: (id: string, title: string) => Promise<Conversation>;
  deleteConversation: (id: string) => Promise<void>;
}

interface ConversationResponse {
  data: Conversation;
  message?: string;
}

export function useConversations(): ConversationsHook {
  const { data, error, isLoading, fetchData } = useApi<Conversation[]>('/conversations')
  const { setConversations, addConversation, updateConversation, removeConversation } = useConversationsStore()

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setConversations(data)
    }
  }, [data, setConversations])

  const createConversation = useCallback(async (title: string): Promise<Conversation> => {
    if (!title?.trim()) {
      throw new Error('Conversation title cannot be empty')
    }

    try {
      const response = await fetchData<ConversationResponse>({
        method: 'POST',
        body: { title: title.trim() },
      })

      if (!response?.data) {
        throw new Error('Invalid response format')
      }

      const newConversation = response.data
      addConversation(newConversation)
      return newConversation
    } catch (err) {
      throw new Error(
        err instanceof Error 
          ? `Failed to create conversation: ${err.message}` 
          : 'Failed to create conversation'
      )
    }
  }, [fetchData, addConversation])

  const updateConversationTitle = useCallback(async (
    id: string, 
    title: string
  ): Promise<Conversation> => {
    if (!id?.trim()) {
      throw new Error('Conversation ID is required')
    }
    if (!title?.trim()) {
      throw new Error('Conversation title cannot be empty')
    }

    try {
      const response = await fetchData<ConversationResponse>({
        method: 'PUT',
        path: `/${id}`,
        body: { title: title.trim() },
      })

      if (!response?.data) {
        throw new Error('Invalid response format')
      }

      const updatedConversation = response.data
      updateConversation(updatedConversation)
      return updatedConversation
    } catch (err) {
      throw new Error(
        err instanceof Error 
          ? `Failed to update conversation: ${err.message}` 
          : 'Failed to update conversation'
      )
    }
  }, [fetchData, updateConversation])

  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    if (!id?.trim()) {
      throw new Error('Conversation ID is required')
    }

    try {
      await fetchData({
        method: 'DELETE',
        path: `/${id}`,
      })
      removeConversation(id)
    } catch (err) {
      throw new Error(
        err instanceof Error 
          ? `Failed to delete conversation: ${err.message}` 
          : 'Failed to delete conversation'
      )
    }
  }, [fetchData, removeConversation])

  return {
    conversations: data,
    error,
    isLoading,
    createConversation,
    updateConversationTitle,
    deleteConversation,
  }
} 