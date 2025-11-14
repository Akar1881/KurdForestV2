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

export default function VideoPlayer({ tmdbId, type, season, episode, subtitleUrl, language }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitButton, setShowExitButton] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout>();

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
      const fullscreen = !!document.fullscreenElement;
      setIsFullscreen(fullscreen);
      
      if (fullscreen) {
        // Show button when entering fullscreen
        setShowExitButton(true);
        // Start timer to hide after 3 seconds
        startInactivityTimer();
      } else {
        // Clear timer when exiting fullscreen
        clearInactivityTimer();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const startInactivityTimer = () => {
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(() => {
      setShowExitButton(false);
    }, 3000); // Hide after 3 seconds of inactivity
  };

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = undefined;
    }
  };

  const handleUserActivity = () => {
    if (isFullscreen) {
      setShowExitButton(true);
      startInactivityTimer();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Add event listeners for user activity
  useEffect(() => {
    if (!isFullscreen) return;

    const events = ['mousedown', 'mousemove', 'touchstart', 'touchmove', 'keydown', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isFullscreen]);

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
      {/* Exit Fullscreen Button */}
      {isFullscreen && showExitButton && (
        <button
          onClick={exitFullscreen}
          className="fixed top-4 left-4 z-50 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
          style={{ zIndex: 9999 }}
          aria-label="Exit fullscreen"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
        </button>
      )}

      <div 
        ref={containerRef} 
        className="w-full aspect-video bg-black rounded-md overflow-hidden" 
        data-testid="player-video"
      >
        <iframe
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
