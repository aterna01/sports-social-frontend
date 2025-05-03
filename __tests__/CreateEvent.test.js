import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateEvent from '../src/app/create-event/page';

const mockToken = 'mock-token';
const mockUser = { email: 'user@example.com' };

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUseAuth = jest.fn();

jest.mock('../src/context/auth-context', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('../src/lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const { default: api } = require('../src/lib/api');

describe('CreateEvent Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits the form and shows success message', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser, token: mockToken });

    api.post.mockResolvedValueOnce({
      status: 200,
      data: { Message: 'Event created successfully' },
    });

    render(<CreateEvent />);

    await userEvent.type(screen.getByLabelText(/title/i), 'Basketball Game');
    await userEvent.click(screen.getByLabelText(/sport type/i)); // open dropdown
    await userEvent.click(screen.getByText('Basketball')); // select option
    await userEvent.type(screen.getByLabelText(/date/i), '2025-06-10');
    await userEvent.type(screen.getByLabelText(/time/i), '15:00');
    await userEvent.type(screen.getByLabelText(/location/i), 'Local Gym');
    await userEvent.type(screen.getByLabelText(/post code/i), '12345');
    await userEvent.type(screen.getByLabelText(/description/i), 'Friendly match');

    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith(
        '/event/create',
        expect.objectContaining({
          title: 'Basketball Game',
          sportType: 'basketball',
          date: '2025-06-10',
          time: '15:00',
          location: 'Local Gym',
          postCode: '12345',
          description: 'Friendly match',
        }),
        expect.objectContaining({
          headers: { Authorization: mockToken },
        })
      )
    );

    expect(
      await screen.findByText(/event created successfully/i)
    ).toBeInTheDocument();

    // Check that the form resets
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
  });

  it('shows error when API fails (duplicate event)', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser, token: mockToken });
    api.post.mockRejectedValueOnce({
      response: { data: { Error: 'This event already exists' } },
    });

    render(<CreateEvent />);

    await userEvent.type(screen.getByLabelText(/title/i), 'Test Event');
    await userEvent.click(screen.getByLabelText(/sport type/i));
    await userEvent.click(screen.getByText('Football'));
    await userEvent.type(screen.getByLabelText(/date/i), '2025-06-15');
    await userEvent.type(screen.getByLabelText(/time/i), '14:00');
    await userEvent.type(screen.getByLabelText(/location/i), 'Park');
    await userEvent.type(screen.getByLabelText(/post code/i), '12345');
    await userEvent.type(screen.getByLabelText(/description/i), 'Duplicate event');

    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.queryByText(/this event already exists/i)).toBeInTheDocument();
    });
  });

  it('does not submit with empty required fields', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser, token: mockToken });

    render(<CreateEvent />);

    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(api.post).not.toHaveBeenCalled();
  });

  it('resets form fields after successful event creation', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser, token: mockToken });
    api.post.mockResolvedValueOnce({
      status: 200,
      data: { Message: 'Event created successfully' },
    });

    render(<CreateEvent />);

    await userEvent.type(screen.getByLabelText(/title/i), 'Reset Test');
    await userEvent.click(screen.getByLabelText(/sport type/i));
    await userEvent.click(screen.getByText('Tennis'));
    await userEvent.type(screen.getByLabelText(/date/i), '2025-06-22');
    await userEvent.type(screen.getByLabelText(/time/i), '10:00');
    await userEvent.type(screen.getByLabelText(/location/i), 'Court 3');
    await userEvent.type(screen.getByLabelText(/post code/i), '98765');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test reset');

    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.getByText(/event created successfully/i)).toBeInTheDocument()
    );

    // check fields reset
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
  });

  it('redirects to login if user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({ user: null, token: null });

    render(<CreateEvent />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });
});
