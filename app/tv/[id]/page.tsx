import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import Link from 'next/link';
import { tmdbFetch, getImageUrl } from '@/lib/tmdb';
import type { TVDetails } from '@/lib/types';
import TVDetailsClient from './TVDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Use React's cache to deduplicate the fetch between generateMetadata and the component
const getTVShow = cache(async (id: string): Promise<TVDetails | null> => {
  try {
    const data = await tmdbFetch(`/tv/${id}?append_to_response=credits,videos,similar`);
    return data as TVDetails;
  } catch (error) {
    // Check if it's a 404 error (TV show not found)
    if (error instanceof Error && error.message.includes('404')) {
      return null; // This will trigger notFound() in the calling functions
    }
    // For other errors (network issues, server errors), rethrow to surface the problem
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const show = await getTVShow(id);

  if (!show) {
    notFound();
  }

  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : '';
  const rating = show.vote_average ? show.vote_average.toFixed(1) : 'N/A';
  const genres = show.genres?.map(g => g.name).join(', ') || '';
  const seasons = show.number_of_seasons || 0;
  const totalEpisodes = show.seasons?.filter(s => s.season_number > 0).reduce((acc, s) => acc + s.episode_count, 0) || 0;
  
  const posterUrl = show.poster_path 
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : 'https://www.kurdforest.xyz/og-image.png';

  const description = show.overview || 'Watch this TV show on KurdForest';
  
  // Build a rich description for social sharing
  const socialDescription = `⭐ ${rating}/10 | ${year} | ${seasons} Season${seasons !== 1 ? 's' : ''} • ${totalEpisodes} Episodes${genres ? ` | ${genres}` : ''}\n\n${description.substring(0, 150)}${description.length > 150 ? '...' : ''}`;

  return {
    title: `${show.name}${year ? ` (${year})` : ''}`,
    description: socialDescription,
    keywords: `${show.name}, tv show, series, ${genres}, watch online, free tv show, kurdforest`,
    
    openGraph: {
      type: 'video.tv_show',
      title: show.name,
      description: socialDescription,
      url: `https://www.kurdforest.xyz/tv/${id}`,
      siteName: 'KurdForest',
      images: [
        {
          url: posterUrl,
          width: 500,
          height: 750,
          alt: `${show.name} poster`,
        },
      ],
      releaseDate: show.first_air_date,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: show.name,
      description: socialDescription,
      images: [posterUrl],
    },
  };
}

export default async function TVDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const show = await getTVShow(id);

  if (!show) {
    notFound();
  }

  return <TVDetailsClient show={show} id={id} />;
}
