import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Manpreet Singh | Software Engineer',
  description:
    'Full-stack software engineer specializing in scalable systems, cloud infrastructure, and AI integration. Based in India.',
  keywords: [
    'Software Engineer',
    'Full Stack Developer',
    'Python',
    'React',
    'Cloud',
    'AI',
  ],
  authors: [{ name: 'Manpreet Singh' }],
  openGraph: {
    title: 'Manpreet Singh | Software Engineer',
    description:
      'Full-stack software engineer building resilient systems at scale.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
