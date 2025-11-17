'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { WatchlistProvider } from '@/lib/WatchlistContext';
import SessionProvider from '@/components/SessionProvider';

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
      <SessionProvider>
        <WatchlistProvider>
          {children}
        </WatchlistProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
