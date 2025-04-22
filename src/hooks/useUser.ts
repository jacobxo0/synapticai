import { useEffect, useCallback } from 'react'
import { useApi } from './useApi'
import { useUserStore } from '@/store/user'
import type { User } from '@/types/user'

interface UserHook {
  user: User | null;
  error: Error | null;
  isLoading: boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<User>;
}

interface UserResponse {
  data: User;
  message?: string;
}

const validateUserUpdates = (updates: Partial<User>): void => {
  if (!updates || Object.keys(updates).length === 0) {
    throw new Error('No updates provided');
  }

  // Add specific validation for required user fields
  if (updates.email && !updates.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  if (updates.username && updates.username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
};

export function useUser(): UserHook {
  const { data, error, isLoading, fetchData } = useApi<User>('/user')
  const { setUser, updateUser } = useUserStore()

  useEffect(() => {
    if (data && typeof data === 'object') {
      setUser(data)
    }
  }, [data, setUser])

  const updateUserProfile = useCallback(async (updates: Partial<User>): Promise<User> => {
    try {
      validateUserUpdates(updates)

      const response = await fetchData<UserResponse>({
        method: 'PUT',
        body: updates,
      })

      if (!response?.data) {
        throw new Error('Invalid response format')
      }

      const updatedUser = response.data
      updateUser(updatedUser)
      return updatedUser
    } catch (err) {
      throw new Error(
        err instanceof Error 
          ? `Failed to update user profile: ${err.message}` 
          : 'Failed to update user profile'
      )
    }
  }, [fetchData, updateUser])

  return {
    user: data,
    error,
    isLoading,
    updateUserProfile,
  }
} 