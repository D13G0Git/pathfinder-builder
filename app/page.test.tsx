import { render, screen } from '@testing-library/react'
import Home from './page' // Assuming your main page component is exported as default from './page'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i, // Adjust this to match a heading text in your Home component
    })

    expect(heading).toBeInTheDocument()
  })
})
