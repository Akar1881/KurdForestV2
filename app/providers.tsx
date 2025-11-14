'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const metadata = {
  title: "KurdForest – Kurdish Movies & TV Shows",
  description: "Watch Kurdish movies and TV shows online on KurdForest.",
  keywords: "kurdforest, kurd forest, Kurdish movies, Kurdish TV shows",
  authors: [{ name: 'KurdForest', url: 'https://www.kurdforest.xyz' }],
  openGraph: {
    title: "KurdForest – Kurdish Movies & TV Shows",
    description: "Watch Kurdish movies and TV shows online on KurdForest.",
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
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
