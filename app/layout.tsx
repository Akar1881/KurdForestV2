import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from './providers';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kurdforest.xyz'),
  title: {
    template: '%s | KurdForest',
    default: "KurdForest – Watch Your Favorite Movies & TV Shows",
  },
  description: "KurdForest - Watch Your Favorite movies & tvshows for free all in one place with your desired language subtitle",
  keywords: "kurdforest, kurd forest, Kurdish movies, Kurdish TV shows, free movies, free tv shows, subtitles",
  authors: [{ name: 'KurdForest', url: 'https://www.kurdforest.xyz' }],
  openGraph: {
    title: "KurdForest – Watch Your Favorite Movies & TV Shows",
    description: "KurdForest - Watch Your Favorite movies & tvshows for free all in one place with your desired language subtitle",
    url: 'https://www.kurdforest.xyz',
    siteName: 'KurdForest',
    images: [
      {
        url: 'https://www.kurdforest.xyz/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KurdForest Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KurdForest – Watch Your Favorite Movies & TV Shows',
    description: 'KurdForest - Watch Your Favorite movies & tvshows for free all in one place with your desired language subtitle',
    images: ['https://www.kurdforest.xyz/og-image.png'],
    creator: '@KurdForest',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4R31TD63KS"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4R31TD63KS', { page_path: window.location.pathname });
          `}
        </Script>
      </head>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-16 sm:pt-18 pb-18 sm:pb-20">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
