import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './login-form' // Adjust the path as necessary
import { supabase } from '@/lib/supabase/client' // Adjust the path as necessary
import { useRouter } from 'next/navigation'

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('LoginForm', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('renders form elements correctly', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    const mockUser = { id: 'test-user-id', email: 'test@example.com' }
    const mockSession = { access_token: 'test-access-token' }
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    })

    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    fireEvent.submit(screen.getByRole('button', { name: /log in/i }))

    // Wait for async actions to complete
    // Depending on implementation, check for router push, success message, or state update
    // For this example, let's assume router.push is called
    await screen.findByText(/Login successful!/i) // Or whatever success indicator is used
    expect(mockPush).toHaveBeenCalledWith('/dashboard') // Or the appropriate redirect path
  })

  it('handles failed login', async () => {
    const errorMessage = 'Invalid credentials'
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: errorMessage, status: 400, name: 'AuthApiError' },
    })

    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword')
    fireEvent.submit(screen.getByRole('button', { name: /log in/i }))
    
    // Check for error message display
    expect(await screen.findByText(errorMessage)).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })
})
