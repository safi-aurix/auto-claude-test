import './globals.css';

export const metadata = {
  title: 'Wanderlust Travel',
  description: 'Your trusted travel agency partner',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
