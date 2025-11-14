'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  subtitleUrl?: string;
  language?: string;
}

// Extended Document interface for browser-specific fullscreen APIs
interface ExtendedDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

export default function VideoPlayer({ tmdbId, type, season, episode, subtitleUrl, language }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement;
      setIsFullscreen(!!fullscreenElement);
      
      if (fullscreenElement) {
        // Don't lock orientation immediately, wait a bit
        setTimeout(async () => {
          try {
            if (screen.orientation && 'lock' in screen.orientation) {
              await (screen.orientation as any).lock('landscape').catch(() => {});
            }
          } catch (error) {
            console.log('Orientation lock not supported');
          }
        }, 300);
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

    const handleKeyDown = (event: KeyboardEvent) => {
      // Allow ESC key to exit fullscreen
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const exitFullscreen = () => {
    const doc = document as ExtendedDocument;
    
    if (doc.fullscreenElement) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen().catch(() => {});
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen().catch(() => {});
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen().catch(() => {});
      }
    }
  };

  // Add a manual exit button for mobile devices
  const ManualExitButton = () => {
    if (!isFullscreen) return null;

    return (
      <button
        onClick={exitFullscreen}
        className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-lg"
        style={{ zIndex: 9999 }}
      >
        Exit Fullscreen
      </button>
    );
  };

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
    <>
      <ManualExitButton />
      <div ref={containerRef} className="w-full aspect-video bg-black rounded-md overflow-hidden" data-testid="player-video">
        <iframe
          ref={iframeRef}
          src={getPlayerUrl()}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; screen-wake-lock"
          title="Video Player"
        />
      </div>
    </>
  );
}
