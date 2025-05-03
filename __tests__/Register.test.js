import { render, screen, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../src/app/register/page';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../src/lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const { default: api } = require('../src/lib/api');


describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('submits form, shows success, and redirects after 2s', async () => {
    api.post.mockResolvedValueOnce({
      status: 200,
      data: { Message: 'User registered successfully' },
    });
  
    render(<Register />);
  
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));
  
    // Check for success message first
    expect(
      await screen.findByText(/user registered successfully/i)
    ).toBeInTheDocument();
  
    // Then wait up to 3s for redirect
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    }, { timeout: 3000 });
  });

  it('shows error if user already exists', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: { Message: 'The user with email already exists' },
      },
    });

    render(<Register />);

    await userEvent.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByText(/already exists/i)).toBeInTheDocument()
    );

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows fallback error if no message is returned from backend', async () => {
    api.post.mockRejectedValueOnce({});

    render(<Register />);

    await userEvent.type(screen.getByLabelText(/email/i), 'fail@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
    );
  });
});
