import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

import MoviesPage from './MoviesPage'

describe('MoviesPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('shows empty state when no movies are returned', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      if (url.includes('/movies')) {
        return {
          ok: true,
          json: async () => ({
            items: [],
            page: 1,
            page_size: 12,
            total: 0,
            total_pages: 0,
          }),
        } as Response
      }
      return {
        ok: true,
        json: async () => [],
      } as Response
    })

    render(
      <BrowserRouter>
        <MoviesPage />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(
        screen.getByText('No movies available for this filter.'),
      ).toBeInTheDocument()
    })
  })
})
