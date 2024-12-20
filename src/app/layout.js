import './globals.css'

export const metadata = {
  title: 'Instax Filter',
  description: 'Create Instax-style photos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900">{children}</body>
    </html>
  );
}