import { render, screen } from '@testing-library/react';
import Navbar from '../src/components/Navbar';
import { AuthProvider } from '../src/context/auth-context';

const mockUseAuth = jest.fn(() => ({
  user: null,
  logout: jest.fn(),
}));

jest.mock('../src/context/auth-context', () => {
  const actual = jest.requireActual('../src/context/auth-context');
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  };
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Navbar', () => {
  it('shows Login link when user is not logged in', () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('shows Logout when user is logged in', () => {
    mockUseAuth.mockReturnValue({ user: { email: 'a@b.com' }, logout: jest.fn() });
    render(<Navbar />);
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('calls logout on click', () => {
    const logout = jest.fn();
    mockUseAuth.mockReturnValue({ user: { email: 'a@b.com' }, logout });
    render(<Navbar />);
    screen.getByText(/logout/i).click();
    expect(logout).toHaveBeenCalled();
  });
});
