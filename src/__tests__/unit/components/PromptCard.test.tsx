import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '../../utils'
import { PromptCard } from '@/components/PromptCard'
import { generateMockPrompt } from '../../utils'

describe('PromptCard', () => {
  const mockPrompt = generateMockPrompt()

  it('renders prompt title and content correctly', () => {
    const { getByText } = renderWithProviders(
      <PromptCard prompt={mockPrompt} onDelete={vi.fn()} />
    )

    expect(getByText(mockPrompt.title)).toBeInTheDocument()
    expect(getByText(mockPrompt.content)).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    const { getByRole } = renderWithProviders(
      <PromptCard prompt={mockPrompt} onDelete={onDelete} />
    )

    getByRole('button', { name: /delete/i }).click()
    expect(onDelete).toHaveBeenCalledWith(mockPrompt.id)
  })

  it('shows loading state when prompt is being deleted', () => {
    const { getByRole } = renderWithProviders(
      <PromptCard prompt={mockPrompt} onDelete={vi.fn()} isDeleting />
    )

    expect(getByRole('button', { name: /deleting/i })).toBeDisabled()
  })

  it('matches snapshot', () => {
    const { container } = renderWithProviders(
      <PromptCard prompt={mockPrompt} onDelete={vi.fn()} />
    )

    expect(container).toMatchSnapshot()
  })
}) 