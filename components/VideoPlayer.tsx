'use client';

import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  subtitleUrl?: string;
  language?: string;
}

export default function VideoPlayer({ tmdbId, type, season, episode, subtitleUrl, language }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://vidlink.pro') return;
      
      if (event.data?.type === 'MEDIA_DATA' && event.data?.data) {
        try {
          const mediaData = event.data.data;
          
          if (typeof mediaData === 'object' && mediaData !== null) {
            const existingData = localStorage.getItem('vidLinkProgress');
            const allProgress = existingData ? JSON.parse(existingData) : {};
            
            Object.assign(allProgress, mediaData);
            
            localStorage.setItem('vidLinkProgress', JSON.stringify(allProgress));
          }
        } catch (error) {
          console.error('Error saving watch progress:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = async () => {
      if (document.fullscreenElement) {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            await (screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch (error) {
          console.log('Orientation lock not supported');
        }
      } else {
        try {
          if (screen.orientation && 'unlock' in screen.orientation) {
            (screen.orientation as any).unlock();
          }
        } catch (error) {
          console.log('Orientation unlock not supported');
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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
    <div ref={containerRef} className="w-full aspect-video bg-black rounded-md overflow-hidden" data-testid="player-video">
      <iframe
        src={getPlayerUrl()}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; screen-wake-lock"
        title="Video Player"
      />
    </div>
  );
}