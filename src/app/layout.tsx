import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ToastProvider } from '@/context/ToastContext';
import AnalyticsTracker from '@/components/shared/AnalyticsTracker';

export const metadata: Metadata = {
  title: 'Satyendra Rao | Youth Reform Movement India | सत्येंद्र राव - युवा सुधार आंदोलन',
  description: 'Official portal of Satyendra Rao: A continuous people\'s movement for transparent, time-bound and fair recruitment processes across India and Rajasthan.',
  keywords: [
    'Satyendra Rao', 'सत्येंद्र राव', 'Youth Reform Movement', 'RPSC Reforms', 'RSSB Reforms',
    'Rajasthan Recruitment Exams', 'Paper Leak Solutions', 'Youth Reform Charter', 'SI Re-Exam'
  ],
  authors: [{ name: 'Satyendra Rao Movement Secretariat' }],
  openGraph: {
    title: 'Satyendra Rao | Youth Reform Movement India',
    description: 'A people\'s movement for fair, transparent and time-bound recruitments across India.',
    url: 'https://satyendrarao.in',
    siteName: 'Satyendra Rao Official Portal',
    images: [
      {
        url: '/images/satyendra_hero.png',
        width: 1200,
        height: 630,
        alt: 'Satyendra Rao - Youth Reform Movement',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satyendra Rao | Youth Reform Movement India',
    description: 'A people\'s movement for fair, transparent and time-bound recruitments across India.',
    images: ['/images/satyendra_hero.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          <ToastProvider>
            <AnalyticsTracker />
            {children}
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
