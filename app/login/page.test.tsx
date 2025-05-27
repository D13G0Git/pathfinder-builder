import { render, screen } from '@testing-library/react'
import LoginPage from './page' // Adjust path as necessary

// Mock the LoginForm component
jest.mock('@/components/login-form', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { jest } = require('@jest/globals') // Use this to access Jest's utilities if needed
  return jest.fn(() => <div data-testid="login-form-mock">Mocked LoginForm</div>)
})

describe('LoginPage', () => {
  it('renders the LoginForm component', () => {
    render(<LoginPage />)

    // Check if the mocked LoginForm component is rendered
    expect(screen.getByTestId('login-form-mock')).toBeInTheDocument()
    expect(screen.getByText('Mocked LoginForm')).toBeInTheDocument() // Also check for its content
  })
})
