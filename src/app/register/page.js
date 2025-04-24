'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import {
  TextField, Button, Typography, Paper, Box, Alert
} from '@mui/material';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/register', { email, password });
      setSuccess(res.data.Message);
      setError('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.Message || 'Registration failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>Register</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleRegister} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained">Register</Button>
        </Box>
      </Paper>
    </Box>
  );
}
