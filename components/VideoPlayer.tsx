'use client';

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  subtitleUrl?: string;
  language?: string;
}

export default function VideoPlayer({ tmdbId, type, season, episode, subtitleUrl, language }: VideoPlayerProps) {
  const getPlayerUrl = () => {
    const baseUrl = type === 'movie'
      ? `https://vidlink.pro/movie/${tmdbId}`
      : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`;

    const params = new URLSearchParams({
      autoplay: 'false',
      poster: 'true',
    });

    if (subtitleUrl && language) {
      params.append('sub_file', subtitleUrl);
      params.append('sub_label', language);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="w-full aspect-video bg-black rounded-md overflow-hidden" data-testid="player-video">
      <iframe
        src={getPlayerUrl()}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; screen-orientation-lock"
        title="Video Player"
      />
    </div>
  );
}