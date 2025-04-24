import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/auth-context';
import ThemeRegistry from '../theme/ThemeRegistry'; // ✅ the safe wrapper

export const metadata = {
  title: 'Sports Social App',
  description: 'Connect through sports!',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ThemeRegistry>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
