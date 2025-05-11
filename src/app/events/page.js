'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/auth-context';
import {
  Grid, Card, CardContent, Typography, Box, Alert, CircularProgress, Snackbar, Button,
  TextField, MenuItem
} from '@mui/material';

const SPORT_OPTIONS = ['football', 'basketball', 'tennis'];

export default function Events() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sportType, setSportType] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [sportType]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/event/get',
        {
          params: sportType ? { sportType } : {},
        }
      );
      setEvents(res.data.Events || []);
      setError('');
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (event) => {
    try {
      const body = {
        title: event.title,
        sportType: event.sportType,
        date: event.date,
        time: event.time,
        location: event.location,
        postCode: event.postCode
      };

      const res = await api.post('/event/participate', body, {
        headers: { Authorization: token }
      });

      setMessage(res.data.Message);

      setEvents((prev) =>
        prev.map((ev) =>
          ev.title === event.title &&
          ev.date === event.date &&
          ev.time === event.time
            ? { ...ev, participants: [...ev.participants, user.email] }
            : ev
        )
      );
    } catch (err) {
      if(err.response?.status === 401) {
        setError('You need to be logged in to join an event.');
        return;
      }
      setError(err.response?.data?.Message || 'Could not join event');
    }
  };

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>Upcoming Events</Typography>

      {/* Filter */}
      <Box mb={3} maxWidth={300}>
        <TextField
          select
          fullWidth
          label="Filter by Sport"
          value={sportType}
          onChange={(e) => setSportType(e.target.value)}
          data-cy="sport-filter"
        >
          <MenuItem value="">All Sports</MenuItem>
          {SPORT_OPTIONS.map((sport) => (
            <MenuItem key={sport} value={sport}>{sport.charAt(0).toUpperCase() + sport.slice(1)}</MenuItem>
          ))}
        </TextField>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Snackbar open autoHideDuration={3000} onClose={() => setMessage('')} message={message} />}

      {events.length === 0 ? (
        <Alert severity="info">No events found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {events.map((event, i) => {
            const alreadyJoined = event.participants.includes(user?.email);

            return (
              <Grid key={i} >
                <Card elevation={3}>
                  <CardContent data-cy={`event-${event.title.replace(/\s+/g, '-').toLowerCase()}`}>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {event.sportType} — {event.date} at {event.time}
                    </Typography>
                    <Typography>{event.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {event.location}, {event.postCode}
                    </Typography>
                    <Typography variant="body2">
                      Owner: {event.owner}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Participants: {event.participants.length}
                    </Typography>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleJoin(event)}
                      disabled={alreadyJoined}
                      data-cy="join-btn"
                    >
                      {alreadyJoined ? 'Already Joined' : 'Join Event'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
