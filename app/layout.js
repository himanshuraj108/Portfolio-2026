import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata = {
  title: {
    default: 'Himanshu Raj — Full-Stack Developer',
    template: '%s | Himanshu Raj',
  },
  description:
    'Computer Science student & Full-Stack Developer. Building impactful web apps with React, Next.js, Node.js, and more.',
  keywords: [
    'Himanshu Raj', 'Full Stack Developer', 'React Developer', 'Next.js', 'Portfolio',
    'Web Developer', 'India', 'LPU', 'JavaScript Developer',
  ],
  authors: [{ name: 'Himanshu Raj', url: 'https://github.com/himanshuraj108' }],
  creator: 'Himanshu Raj',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Himanshu Raj — Full-Stack Developer',
    description: 'Computer Science student & Full-Stack Developer. Building impactful web apps.',
    siteName: 'Himanshu Raj Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himanshu Raj — Full-Stack Developer',
    description: 'Computer Science student & Full-Stack Developer.',
    creator: '@himanshuraj',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain mesh-gradient">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-body)',
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
