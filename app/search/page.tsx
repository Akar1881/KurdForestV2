import { Suspense } from 'react';
import SearchContent from './SearchContent';

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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
