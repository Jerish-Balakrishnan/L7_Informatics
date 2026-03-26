import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import MovieCard from './MovieCard'

const movie = {
  id: 1,
  title: 'Inception',
  release_year: 2010,
  director: { id: 1, name: 'Christopher Nolan' },
  actors: [],
  genres: [{ id: 1, name: 'Sci-Fi' }],
  average_rating: 9,
}

describe('MovieCard', () => {
  test('renders movie details', () => {
    render(
      <BrowserRouter>
        <MovieCard movie={movie} />
      </BrowserRouter>,
    )

    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.getByText(/Christopher Nolan/)).toBeInTheDocument()
    expect(screen.getByText(/Sci-Fi/)).toBeInTheDocument()
  })
})
