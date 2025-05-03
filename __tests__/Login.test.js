import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../src/app/login/page';
import { useAuth } from '../src/context/auth-context';

// Mocks
const mockPush = jest.fn();
const mockLogin = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../src/context/auth-context', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));


jest.mock('../src/lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const { default: api } = require('../src/lib/api');

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits the form with valid credentials', async () => {
    api.post.mockResolvedValueOnce({
      status: 200,
      data: { authToken: 'fake-token' },
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(api.post).toHaveBeenCalledWith('/user/login', {
      email: 'user@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/user/login', {
        email: 'user@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith('fake-token', 'user@example.com');
      expect(mockPush).toHaveBeenCalledWith('/create-event');
    });
  });

  it('shows error if credentials are invalid', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: { Error: 'Invalid username or password.' },
      },
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/invalid username or password/i)
      ).toBeInTheDocument()
    );
  });

  it('shows fallback error on login failure', async () => {
    api.post.mockRejectedValueOnce({
      request: {
        "Error": 'Invalid username or password.'
      },
    });
    render(<Login />);
    await userEvent.type(screen.getByLabelText(/email/i), 'user@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), '123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
    await waitFor(() =>
      expect(screen.getByText(/login failed/i)).toBeInTheDocument()
    );
  });
  
  it('does not submit if fields are empty (HTML validation)', async () => {
    render(<Login />);

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(api.post).not.toHaveBeenCalled();
  });

  it('shows a fallback error if no message returned from backend', async () => {
    api.post.mockRejectedValueOnce({});

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/login failed/i)).toBeInTheDocument()
    );
  });
});
