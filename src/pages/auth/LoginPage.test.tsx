import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '@/hooks/useAuth'
import { BackendProvider } from '@/lib/backend/context'
import { createLocalBackend, type FileStore } from '@/lib/backend/local'
import LoginPage from './LoginPage'

const files: FileStore = { get: async () => undefined, set: async () => undefined }

function setup() {
  const backend = createLocalBackend({ storage: window.localStorage, files, latencyMs: 0 })
  window.localStorage.clear()
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginPage /> },
      { path: '/app', element: <p>Dashboard page</p> },
    ],
    { initialEntries: ['/login'] },
  )
  render(
    <BackendProvider backend={backend}>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </BackendProvider>,
  )
  return { router }
}

describe('LoginPage', () => {
  it('validates fields before submitting', async () => {
    setup()
    await userEvent.click(await screen.findByRole('button', { name: 'Sign in' }))
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument()
    expect(screen.getByText('Enter your password')).toBeInTheDocument()
  })

  it('shows server errors for bad credentials', async () => {
    setup()
    await userEvent.type(await screen.findByLabelText('Email'), 'demo@seleste.app')
    await userEvent.type(screen.getByLabelText('Password'), 'nope')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')
  })

  it('signs in with the demo account and redirects', async () => {
    setup()
    await userEvent.click(await screen.findByRole('button', { name: /demo account/i }))
    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
  })
})
