'use client'

import Link from 'next/link';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button} from '@mui/material';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Sports Social</Typography>
        <div>
          <Button color="inherit" component={Link} href="/">Home</Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} href="/create-event">Create Event</Button>
              <Button color="inherit" component={Link} href="/events">Events</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
              <Typography variant="body2" sx={{ display: 'inline', ml: 2 }}>{user.email}</Typography>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/login">Login</Button>
              <Button color="inherit" component={Link} href="/register">Register</Button>
              <Button color="inherit" component={Link} href="/events">Events</Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
