import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import Link from 'next/link';
import { tmdbFetch, getImageUrl } from '@/lib/tmdb';
import type { MovieDetails } from '@/lib/types';
import MovieDetailsClient from './MovieDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Use React's cache to deduplicate the fetch between generateMetadata and the component
const getMovie = cache(async (id: string): Promise<MovieDetails | null> => {
  try {
    const data = await tmdbFetch(`/movie/${id}?append_to_response=credits,videos,similar`);
    return data as MovieDetails;
  } catch (error) {
    // Check if it's a 404 error (movie not found)
    if (error instanceof Error && error.message.includes('404')) {
      return null; // This will trigger notFound() in the calling functions
    }
    // For other errors (network issues, server errors), rethrow to surface the problem
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) {
    notFound();
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const genres = movie.genres?.map(g => g.name).join(', ') || '';
  const runtime = movie.runtime ? `${movie.runtime} min` : '';
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://www.kurdforest.xyz/og-image.png';

  const description = movie.overview || 'Watch this movie on KurdForest';
  
  // Build a rich description for social sharing
  const socialDescription = `⭐ ${rating}/10 | ${year} | ${runtime}${genres ? ` | ${genres}` : ''}\n\n${description.substring(0, 150)}${description.length > 150 ? '...' : ''}`;

  return {
    title: `${movie.title}${year ? ` (${year})` : ''}`,
    description: socialDescription,
    keywords: `${movie.title}, movie, ${genres}, watch online, free movie, kurdforest`,
    
    openGraph: {
      type: 'video.movie',
      title: movie.title,
      description: socialDescription,
      url: `https://www.kurdforest.xyz/movie/${id}`,
      siteName: 'KurdForest',
      images: [
        {
          url: posterUrl,
          width: 500,
          height: 750,
          alt: `${movie.title} poster`,
        },
      ],
      releaseDate: movie.release_date,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: movie.title,
      description: socialDescription,
      images: [posterUrl],
    },
  };
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) {
    notFound();
  }

  return <MovieDetailsClient movie={movie} id={id} />;
}
