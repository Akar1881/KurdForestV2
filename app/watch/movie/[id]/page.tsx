'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LanguageSelector from '@/components/LanguageSelector';
import SubtitleProgress from '@/components/SubtitleProgress';
import VideoPlayer from '@/components/VideoPlayer';
import { fetchSubtitle, getSubtitleStatus } from '@/lib/subtitles';
import type { SubtitleStatus } from '@/lib/types';

export default function WatchMoviePage() {
  const params = useParams();
  const id = Number(params.id);
  
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLanguageName, setSelectedLanguageName] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [subtitleUrl, setSubtitleUrl] = useState<string | undefined>();
  const [subtitleStatus, setSubtitleStatus] = useState<SubtitleStatus | null>(null);
  const [isFetchingSubtitle, setIsFetchingSubtitle] = useState(false);

  const handleLanguageSelect = (code: string, name: string) => {
    setSelectedLanguage(code);
    setSelectedLanguageName(name);
  };

  const handleWatchWithSubtitle = async () => {
    if (!selectedLanguage) {
      alert('Please select a language');
      return;
    }

    setIsFetchingSubtitle(true);
    setSubtitleStatus({ processId: 'init', status: 'starting' });

    try {
      const result = await fetchSubtitle({
        tmdbId: id,
        type: 'movie',
        language: selectedLanguage,
      });

      if (result.processId) {
        pollSubtitleStatus(result.processId);
      }
    } catch (error) {
      console.error('Failed to fetch subtitle:', error);
      setSubtitleStatus({ processId: 'error', status: 'failed', error: 'Failed to start subtitle fetch' });
      setIsFetchingSubtitle(false);
    }
  };

  const pollSubtitleStatus = async (processId: string) => {
    const interval = setInterval(async () => {
      try {
        const status: SubtitleStatus = await getSubtitleStatus(processId);
        setSubtitleStatus(status);

        if (status.status === 'complete') {
          clearInterval(interval);
          setSubtitleUrl(status.subtitleUrl);
          setIsFetchingSubtitle(false);
          setShowPlayer(true);
        } else if (status.status === 'failed') {
          clearInterval(interval);
          setIsFetchingSubtitle(false);
        }
      } catch (error) {
        console.error('Failed to get subtitle status:', error);
        clearInterval(interval);
        setIsFetchingSubtitle(false);
      }
    }, 2000);
  };

  const handleWatchWithoutSubtitle = () => {
    setSubtitleUrl(undefined);
    setShowPlayer(true);
  };

  return (
    <div className="min-h-screen bg-black pt-4 px-4 pb-8">
      <div className="max-w-5xl mx-auto">
        {!showPlayer && (
          <>
            {/* Subtitle Instructions */}
            <div className="bg-gray-900 p-6 rounded-md mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                You can request subtitle up to 119 languages but remember we do not provide subtitle our providers do 
                so it takes a little time to fetch. Select your language below and click watch with subtitle or if you 
                don't want subtitles click watch without subtitle
              </p>
            </div>

            {/* Language Selector */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Select Subtitle Language
              </label>
              <LanguageSelector
                onSelect={handleLanguageSelect}
                selectedLanguage={selectedLanguage}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleWatchWithSubtitle}
                disabled={!selectedLanguage || isFetchingSubtitle}
                className="flex-1 bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                data-testid="button-watch-with-subtitle"
              >
                Watch with Subtitle
              </button>
              <button
                onClick={handleWatchWithoutSubtitle}
                disabled={isFetchingSubtitle}
                className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed"
                data-testid="button-watch-without-subtitle"
              >
                Watch without Subtitle
              </button>
            </div>

            {/* Subtitle Progress */}
            {subtitleStatus && isFetchingSubtitle && (
              <div className="mb-6">
                <SubtitleProgress status={subtitleStatus} />
              </div>
            )}
          </>
        )}

        {/* Video Player */}
        {showPlayer && (
          <div className="mt-6">
            <VideoPlayer
              tmdbId={id}
              type="movie"
              subtitleUrl={subtitleUrl}
              language={selectedLanguageName}
            />
          </div>
        )}
      </div>
    </div>
  );
}
