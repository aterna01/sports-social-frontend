'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import {
  TextField, Button, MenuItem, Typography, Box, CircularProgress, Alert
} from '@mui/material';


export default function CreateEvent() {
  const {user, token} = useAuth();
  const [form, setForm] = useState({
    title: '', sportType: '', date: '', time: '',
    location: '', postCode: '', description: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  },[token, router]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/event/create', form, {
        headers: { Authorization: token }
      });
      console.log("resssss: ", res);

      if (res.status === 200) {
        // alert(res.data.Message);
        setSuccessMessage(res.data.Message); // ✅ Show success on screen
  
        // ✅ Reset the form fields to empty
        setForm({
          title: '',
          sportType: '',
          date: '',
          time: '',
          location: '',
          postCode: '',
          description: ''
        });

        // router.push('/events');

      }
    } catch (err) {
      console.error("Full error response:", err.response);
      // alert(err.response?.data?.Error || 'Error creating event');
    }
    
  };

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

  return (
    <Box maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>Create Event</Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Box component="form" onSubmit={handleSubmit} mt={2} display="flex" flexDirection="column" gap={2}>
        <TextField label="Title" name="title" value={form.title} onChange={handleChange} required />
        <TextField
          select
          label="Sport Type"
          name="sportType"
          value={form.sportType}
          onChange={handleChange}
          required
        >
          <MenuItem value="football">Football</MenuItem>
          <MenuItem value="basketball">Basketball</MenuItem>
          <MenuItem value="tennis">Tennis</MenuItem>
        </TextField>
        <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField label="Time" name="time" type="time" value={form.time} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField label="Location" name="location" value={form.location} onChange={handleChange} required />
        <TextField label="Post Code" name="postCode" value={form.postCode} onChange={handleChange} required />
        <TextField label="Description" name="description" multiline rows={3} value={form.description} onChange={handleChange} />
        <Button type="submit" variant="contained">Create</Button>
      </Box>
    </Box>
  );
}
