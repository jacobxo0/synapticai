import './globals.css';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from './providers';
import Navigation from './components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SynapticAI - Your Personal AI Assistant',
  description: 'Manage your tasks, goals, and chat with AI assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
} 