'use client'

import { Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      minHeight="60vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Sports Social App - Connect With Local Players
      </Typography>
      <Typography variant="h6">
        Find, create, and join local sports events near you.
      </Typography>
    </Box>
  );
}
