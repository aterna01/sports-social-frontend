'use client'

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export default function ThemeRegistry({ children }) {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#388e3c' }, // sporty green
      secondary: { main: '#f44336' },
      background: {
        default: '#eaeff1',   // softer than pure white
        paper: '#ffffff',     // cards, forms
      },
      text: {
        primary: '#212121',   // near-black
        secondary: '#555555',
      },
    },
    typography: {
      fontFamily: 'Poppins, Roboto, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
