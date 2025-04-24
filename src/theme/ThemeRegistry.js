'use client'

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// import { useMemo, useState, createContext, useContext } from 'react';

// const ColorModeContext = createContext();

// export function useColorMode() {
//   return useContext(ColorModeContext);
// }

// export default function ThemeRegistry({ children }) {
//   const [mode, setMode] = useState('light');

//   const colorMode = {
//     toggleColorMode: () => {
//       setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
//     },
//   };

//   const theme = useMemo(() => {
//     return createTheme({
//       palette: {
//         mode,
//         ...(mode === 'light'
//           ? {
//             primary: { main: '#388e3c' }, // sporty green
//             secondary: { main: '#f44336' },
//             background: {
//               default: '#eaeff1',   // softer than pure white
//               paper: '#ffffff',     // cards, forms
//             },
//             text: {
//               primary: '#212121',   // near-black
//               secondary: '#555555',
//             },
//           }
//           : {
//               primary: { main: '#81c784' }, // lighter green for dark bg
//               secondary: { main: '#e57373' },
//               background: {
//                 default: '#121212',
//                 paper: '#1e1e1e',
//               },
//               text: {
//                 primary: '#ffffff',
//                 secondary: '#bbbbbb',
//               },
//             }),
//       },
//       typography: {
//         fontFamily: 'Poppins, Roboto, sans-serif',
//       },
//     });
//   }, [mode]);

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }


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