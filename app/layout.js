import { AuthProvider } from '@/app/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'TravelCo - Your Travel Agency',
  description: 'Book your dream vacation with TravelCo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
