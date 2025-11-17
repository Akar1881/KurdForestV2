'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Play, Clock, Calendar, Share2, Copy, Check, X, Twitter, Facebook, MessageCircle, Link2, Bookmark, Heart } from 'lucide-react';
import TrailerModal from '@/components/TrailerModal';
import HorizontalScroller from '@/components/HorizontalScroller';
import { getImageUrl, formatRuntime } from '@/lib/tmdb';
import type { MovieDetails, Cast } from '@/lib/types';
import GAClientTracker from '@/components/GAClientTracker';
import { useWatchlistContext } from '@/lib/WatchlistContext';

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const { isInWatchlist, addToWatchlist, removeFromWatchlist, isInFavorites, addToFavorites, removeFromFavorites } = useWatchlistContext();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/tmdb/details?id=${id}&type=movie`);
        const data = await res.json();
        
        // Handle 404 or error responses
        if (!res.ok || data.error || data.notFound) {
          console.error('Movie not found or error:', data);
          setMovie(null);
        } else {
          setMovie(data);
        }
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const copyToClipboard = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnSocialMedia = (platform: string) => {
    const url = window.location.href;
    const title = movie?.title || 'Check out this movie';
    const text = movie?.overview ? `${title}: ${movie.overview.substring(0, 100)}...` : title;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    };

    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-pulse text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <p className="text-gray-400 mb-8">
            This movie doesn't exist in our database or may have been removed.
          </p>
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl hover:bg-yellow-500 transition-colors font-medium"
            data-testid="button-back-to-movies"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'w1280');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const trailer = movie.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const similar = movie.similar?.results || [];

  return (
    <>
      <GAClientTracker />
      <div className="min-h-screen bg-black">
        {/* Hero Section with Backdrop */}
        <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] max-h-[700px]">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        </div>

        {/* Content Container */}
        <div className="container-custom -mt-24 sm:-mt-32 md:-mt-40 relative z-10 pb-12">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Poster Section */}
            <div className="flex-shrink-0">
              {/* Poster */}
              <div className="relative w-40 h-60 sm:w-48 sm:h-72 md:w-56 md:h-84 lg:w-64 lg:h-96 rounded-xl overflow-hidden bg-card-bg shadow-card-hover border border-card-border mb-4">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                />
              </div>

              {/* Favorite & Watchlist Buttons - Under poster */}
              <div className="flex justify-start gap-3 sm:gap-4">
                {/* Watchlist Button */}
                <button
                  onClick={() => {
                    if (isInWatchlist(Number(id), 'movie')) {
                      removeFromWatchlist(Number(id), 'movie');
                    } else {
                      addToWatchlist({
                        id: Number(id),
                        title: movie.title,
                        poster_path: movie.poster_path,
                        backdrop_path: movie.backdrop_path,
                        vote_average: movie.vote_average,
                        release_date: movie.release_date,
                        media_type: 'movie',
                      });
                    }
                  }}
                  className={`flex items-center justify-center p-3 sm:p-4 rounded-xl transition-all duration-200 border backdrop-blur-md button-press ${
                    isInWatchlist(Number(id), 'movie')
                      ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                      : 'glass-light border-white/20 text-white hover:bg-white/20'
                  }`}
                  data-testid="button-watchlist"
                  aria-label={isInWatchlist(Number(id), 'movie') ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 ${isInWatchlist(Number(id), 'movie') ? 'fill-current' : ''}`} />
                </button>
                
                {/* Favorite Button */}
                <button
                  onClick={() => {
                    if (isInFavorites(Number(id), 'movie')) {
                      removeFromFavorites(Number(id), 'movie');
                    } else {
                      addToFavorites({
                        id: Number(id),
                        title: movie.title,
                        poster_path: movie.poster_path,
                        backdrop_path: movie.backdrop_path,
                        vote_average: movie.vote_average,
                        release_date: movie.release_date,
                        media_type: 'movie',
                      });
                    }
                  }}
                  className={`flex items-center justify-center p-3 sm:p-4 rounded-xl transition-all duration-200 border backdrop-blur-md button-press ${
                    isInFavorites(Number(id), 'movie')
                      ? 'bg-red-500/20 border-red-500/50 text-red-500'
                      : 'glass-light border-white/20 text-white hover:bg-white/20'
                  }`}
                  data-testid="button-favorite"
                  aria-label={isInFavorites(Number(id), 'movie') ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isInFavorites(Number(id), 'movie') ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight" data-testid="text-movie-title">
                {movie.title}
              </h1>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1.5 bg-black/40 glass px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm sm:text-base">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
                {movie.release_date && (
                  <div className="flex items-center gap-1.5 bg-black/40 glass px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm sm:text-base">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-1.5 bg-black/40 glass px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm sm:text-base">
                      {formatRuntime(movie.runtime)}
                    </span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-5 sm:mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-white/10 text-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/10"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-3xl" data-testid="text-overview">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link
                  href={`/watch/movie/${id}`}
                  className="flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl button-press font-semibold text-sm sm:text-base"
                  data-testid="button-watch"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span>Watch Now</span>
                </Link>
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center justify-center gap-2 glass-light text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 backdrop-blur-md button-press font-medium text-sm sm:text-base"
                    data-testid="button-trailer"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Watch Trailer</span>
                  </button>
                )}
                {/* Share Button */}
                <button
                  onClick={handleShareClick}
                  className="flex items-center justify-center gap-2 glass-light text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 backdrop-blur-md button-press font-medium text-sm sm:text-base"
                  data-testid="button-share"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cast Section */}
          {cast.length > 0 && (
            <section className="mb-10 sm:mb-12">
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Cast</h2>
              <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 smooth-scroll">
                {cast.map((person: Cast) => (
                  <div key={person.id} className="flex-shrink-0 w-24 sm:w-28 md:w-32">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-card-bg shadow-card mb-2 border border-card-border">
                      <Image
                        src={getImageUrl(person.profile_path, 'w200')}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                      />
                    </div>
                    <p className="text-white text-xs sm:text-sm font-medium text-center line-clamp-2 mb-0.5">
                      {person.name}
                    </p>
                    <p className="text-gray-400 text-xs text-center line-clamp-1">
                      {person.character}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Similar Movies */}
          {similar.length > 0 && (
            <div className="-mx-4 sm:-mx-6 lg:-mx-8">
              <HorizontalScroller title="Similar Movies" items={similar} type="movie" />
            </div>
          )}
        </div>

        {/* Trailer Modal */}
        {showTrailer && trailer && (
          <TrailerModal videoKey={trailer.key} onClose={() => setShowTrailer(false)} />
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowShareModal(false)}
            />
            
            {/* Modal Content */}
            <div className="relative glass-light rounded-2xl p-6 w-full max-w-sm mx-auto border border-white/20 backdrop-blur-md transform transition-transform">
              {/* Close Button */}
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title */}
              <h3 className="text-white text-lg font-bold mb-6 text-center">Share this movie</h3>

              {/* Social Buttons */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => shareOnSocialMedia('twitter')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                >
                  <Twitter className="w-6 h-6 text-blue-400" />
                  <span className="text-white text-xs">Twitter</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia('facebook')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                >
                  <Facebook className="w-6 h-6 text-blue-500" />
                  <span className="text-white text-xs">Facebook</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia('whatsapp')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                >
                  <MessageCircle className="w-6 h-6 text-green-500" />
                  <span className="text-white text-xs">WhatsApp</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia('telegram')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                >
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                  <span className="text-white text-xs">Telegram</span>
                </button>
              </div>

              {/* Copy Link Button */}
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-3 w-full glass-light text-white px-6 py-4 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 backdrop-blur-md font-medium"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Link2 className="w-5 h-5" />
                )}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}