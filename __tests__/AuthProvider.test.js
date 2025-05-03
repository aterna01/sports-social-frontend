import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/context/auth-context';

function DummyComponent() {
  const { user, login, logout } = useAuth();

  return (
    <>
      <span>{user?.email || 'No user'}</span>
      <button onClick={() => login('mock-token', 'me@example.com')}>Login</button>
      <button onClick={logout}>Logout</button>
    </>
  );
}

function DummyUserOnly() {
  const { user } = useAuth();
  return <span>{user?.email || 'No user'}</span>;
}

describe('auth context login/logout works', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('handles login and logout', async () => {
    render(
      <AuthProvider>
        <DummyComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/no user/i)).toBeInTheDocument();

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByText(/me@example.com/i)).toBeInTheDocument();

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByText(/no user/i)).toBeInTheDocument();
  });

  it('loads user from localStorage on mount', () => {
    // Set localStorage before rendering
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('email', 'stored@example.com');

    render(
      <AuthProvider>
        <DummyUserOnly />
      </AuthProvider>
    );

    expect(screen.getByText(/stored@example.com/i)).toBeInTheDocument();
  });
});
