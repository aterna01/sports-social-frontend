import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Events from '../src/app/events/page';

const mockUseAuth = jest.fn();
jest.mock('../src/context/auth-context', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('../src/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const { default: api } = require('../src/lib/api');

describe('Events Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      token: 'mock-token',
      user: { email: 'user@example.com' },
    });
  });

  it('renders list of events with join buttons', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        Events: [
          {
            title: 'Football Match',
            sportType: 'football',
            date: '2025-06-10',
            time: '16:00',
            location: 'City Stadium',
            postCode: '12345',
            description: 'Friendly game',
            participants: [],
            owner: 'someone@example.com',
          },
        ],
      },
    });

    render(<Events />);

    expect(await screen.findByText(/football match/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join event/i })).toBeInTheDocument();
  });

  it('filters by sport type', async () => {
    mockUseAuth.mockReturnValue({ token: 'mock-token', user: { email: 'user@example.com' } });
  
    api.get.mockResolvedValue({
      data: { Events: [] },
    });
  
    render(<Events />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText(/basketball/i));
  
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/event/get', {
        params: { sportType: 'basketball' },
      });
    });
  });
  
  it('joins an event and updates UI', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        Events: [
          {
            title: 'Tennis Match',
            sportType: 'tennis',
            date: '2025-06-12',
            time: '11:00',
            location: 'Court A',
            postCode: '22222',
            description: 'Doubles',
            participants: [],
            owner: 'someone@example.com',
          },
        ],
      },
    });

    api.post.mockResolvedValueOnce({
      data: { Message: 'You have joined the event!' },
    });

    render(<Events />);
    await userEvent.click(await screen.findByRole('button', { name: /join event/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(screen.getByText(/already joined/i)).toBeInTheDocument();
    });
  });

  it('shows error if joining without auth', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        Events: [
          {
            title: 'Tennis Match',
            sportType: 'tennis',
            date: '2025-06-12',
            time: '11:00',
            location: 'Court A',
            postCode: '22222',
            description: 'Doubles',
            participants: [],
            owner: 'someone@example.com',
          },
        ],
      },
    });

    api.post.mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(<Events />);
    await userEvent.click(await screen.findByRole('button', { name: /join event/i }));

    await waitFor(() => {
      expect(screen.getByText(/need to be logged in/i)).toBeInTheDocument();
    });
  });

  it('shows message when no events are returned', async () => {
    api.get.mockResolvedValueOnce({
      data: { Events: [] },
    });

    render(<Events />);
    expect(await screen.findByText(/no events found/i)).toBeInTheDocument();
  });

  // it('handles error if initial fetch fails', async () => {
  //   api.get.mockRejectedValueOnce({
  //     response: { status: 500 },
  //   });
  
  //   // Mock alert
  //   const originalAlert = window.alert;
  //   window.alert = jest.fn();
  
  //   render(<Events />);
  
  //   await waitFor(() => {
  //     expect(window.alert).toHaveBeenCalledWith('Failed to fetch events');
  //   });
  
  //   window.alert = originalAlert;
  // });

  it('handles case where Events data is missing', async () => {
    api.get.mockResolvedValueOnce({
      data: {}, // <-- no "Events" key!
    });
  
    render(<Events />);
    expect(await screen.findByText(/no events found/i)).toBeInTheDocument();
  });

  
  

  it('shows error message on join failure', async () => {
    const mockEvent = {
      title: 'Tennis Match',
      sportType: 'tennis',
      date: '2025-06-12',
      time: '11:00',
      location: 'Court A',
      postCode: '22222',
      description: 'Doubles',
      participants: [],
      owner: 'someOwner@mail.com',
    };
    
    api.get.mockResolvedValueOnce({ data: { Events: [mockEvent] } });
    api.post.mockRejectedValueOnce({
      response: { status: 409, data: { Message: 'Already joined' } },
    });
  
    render(<Events />);
    await userEvent.click(await screen.findByText(/join event/i));
  
    await waitFor(() => {
      expect(screen.getByText(/already joined/i)).toBeInTheDocument();
    });
  });

  it('shows fallback error if response is malformed', async () => {
    const mockEvent = {
      title: 'Volleyball Match',
      sportType: 'volleyball',
      date: '2025-07-01',
      time: '10:00',
      location: 'Beach Court',
      postCode: '00000',
      description: 'Morning beach volley',
      participants: [],
      owner: 'host@example.com',
    };
  
    api.get.mockResolvedValueOnce({ data: { Events: [mockEvent] } });
  
    // Simulate unexpected error shape
    api.post.mockRejectedValueOnce({});
  
    render(<Events />);
    await userEvent.click(await screen.findByText(/join event/i));
  
    await waitFor(() => {
      expect(screen.getByText(/could not join event/i)).toBeInTheDocument();
    });
  });

  it('falls back to generic error if err.response.data.Message is missing', async () => {
    const mockEvent = {
      title: 'Test Event',
      sportType: 'football',
      date: '2025-07-01',
      time: '10:00',
      location: 'Main Court',
      postCode: '00001',
      description: 'Just testing',
      participants: [],
      owner: 'someone@example.com',
    };
  
    api.get.mockResolvedValueOnce({ data: { Events: [mockEvent] } });
  
    // Simulate error with status but no message
    api.post.mockRejectedValueOnce({
      response: { status: 500, data: {} },
    });
  
    render(<Events />);
    await userEvent.click(await screen.findByText(/join event/i));
  
    await waitFor(() => {
      expect(screen.getByText(/could not join event/i)).toBeInTheDocument();
    });
  });

  it('shows alert if event fetch fails', async () => {
    api.get.mockRejectedValueOnce(new Error('Failed to load'));

    // override alert
    const originalAlert = window.alert;
    window.alert = jest.fn();

    render(<Events />);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to fetch events');
    });

    window.alert = originalAlert;
  });

  it('only updates matching event when joining', async () => {
    const events = [
      {
        title: 'Match A',
        sportType: 'football',
        date: '2025-06-20',
        time: '10:00',
        location: 'Stadium 1',
        postCode: '11111',
        description: 'Main event',
        participants: [],
        owner: 'owner1@example.com',
      },
      {
        title: 'Match B',
        sportType: 'football',
        date: '2025-06-20',
        time: '12:00',
        location: 'Stadium 2',
        postCode: '22222',
        description: 'Secondary match',
        participants: [],
        owner: 'owner2@example.com',
      },
    ];

    api.get.mockResolvedValueOnce({ data: { Events: events } });
    api.post.mockResolvedValueOnce({ data: { Message: 'Joined Match A' } });

    render(<Events />);

    // Join Match A (first join button)
    const joinButtons = await screen.findAllByRole('button', { name: /join event/i });
    await userEvent.click(joinButtons[0]);

    // Match A should now say Already Joined
    await waitFor(() => {
      expect(screen.getByText(/already joined/i)).toBeInTheDocument();
    });

    // Match B should still have Join Event
    expect(screen.getAllByRole('button', { name: /join event/i })[0]).toBeEnabled(); // Match B still has enabled Join
  });

});

describe('Events Page Snackbar', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      token: 'mock-token',
      user: { email: 'user@example.com' },
    });

    api.get.mockResolvedValueOnce({
      data: {
        Events: [
          {
            title: 'Football Game',
            sportType: 'football',
            date: '2025-06-20',
            time: '14:00',
            location: 'Beach Court',
            postCode: '99999',
            description: 'Beach showdown',
            participants: [],
            owner: 'organizer@example.com',
          },
        ],
      },
    });

    api.post.mockResolvedValueOnce({
      data: { Message: 'Joined successfully' },
    });
  });

  it('closes snackbar after autoHideDuration', async () => {
    render(<Events />);
    await userEvent.click(await screen.findByRole('button', { name: /join event/i }));

    expect(await screen.findByText(/joined successfully/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText(/joined successfully/i), {
      timeout: 4000,
    });
  }, 10000);
});
