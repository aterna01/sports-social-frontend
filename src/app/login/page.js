'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuth } from '../../context/auth-context';
import {
  TextField, Button, Typography, Paper, Box, Alert
} from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/login', { email, password });
      
      if (res.status === 200) {
        login(res.data.authToken, email); // update context
        router.push('/create-event');
      }

    } catch (err) {
      if (err.response?.data?.Error) {
        setError(err.response.data.Error); // Use the backend error message
      } else if (err.request) {
        setError("Login failed because of the bad request, please check your email and password");
      } else {
        setError(`Login failed, the error message is: ${err.message}`);
      }
    }
  }


  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={2}>
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
          <Button type="submit" variant="contained">Login</Button>
        </Box>
      </Paper>
    </Box>
  );
}
