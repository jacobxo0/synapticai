import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ConversationForm from '@/components/ConversationForm'
import { useConversation } from '@/hooks/useConversation'
import { mockConversation } from '../utils/mocks'

// Mock the conversation hook
vi.mock('@/hooks/useConversation', () => ({
  useConversation: vi.fn(),
}))

describe('Conversation Flow', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    vi.clearAllMocks()
  })

  it('renders the form correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ConversationForm />
      </QueryClientProvider>
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const mockSubmit = jest.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <ConversationForm onSubmit={mockSubmit} />
      </QueryClientProvider>
    )

    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /send/i })

    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('Test message')
    })
  })

  it('submits conversation form and shows success state', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(mockConversation)
    ;(useConversation as any).mockImplementation(() => ({
      submitConversation: mockSubmit,
      isLoading: false,
      error: null,
    }))

    render(
      <QueryClientProvider client={queryClient}>
        <ConversationForm />
      </QueryClientProvider>
    )

    // Fill form
    fireEvent.change(screen.getByLabelText(/mood/i), {
      target: { value: 'happy' },
    })
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    // Verify submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        mood: 'happy',
        message: 'Test message',
      })
    })

    // Verify success state
    expect(screen.getByText(/conversation saved/i)).toBeInTheDocument()
  })

  it('handles form validation errors', async () => {
    ;(useConversation as any).mockImplementation(() => ({
      submitConversation: vi.fn(),
      isLoading: false,
      error: null,
    }))

    render(
      <QueryClientProvider client={queryClient}>
        <ConversationForm />
      </QueryClientProvider>
    )

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    // Verify validation errors
    expect(screen.getByText(/mood is required/i)).toBeInTheDocument()
    expect(screen.getByText(/message is required/i)).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    const mockError = new Error('API Error')
    ;(useConversation as any).mockImplementation(() => ({
      submitConversation: vi.fn().mockRejectedValue(mockError),
      isLoading: false,
      error: mockError,
    }))

    render(
      <QueryClientProvider client={queryClient}>
        <ConversationForm />
      </QueryClientProvider>
    )

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/mood/i), {
      target: { value: 'happy' },
    })
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    // Verify error state
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', () => {
    ;(useConversation as any).mockImplementation(() => ({
      submitConversation: vi.fn(),
      isLoading: true,
      error: null,
    }))

    render(
      <QueryClientProvider client={queryClient}>
        <ConversationForm />
      </QueryClientProvider>
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })
}) 