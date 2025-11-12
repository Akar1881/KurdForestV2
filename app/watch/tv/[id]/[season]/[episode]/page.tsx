'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import SubtitleProgress from '@/components/SubtitleProgress';
import VideoPlayer from '@/components/VideoPlayer';
import AdWarning from '@/components/AdWarning';
import SeasonSelector from '@/components/SeasonSelector';
import EpisodeList from '@/components/EpisodeList';
import UpcomingEpisodes from '@/components/UpcomingEpisodes';
import { fetchSubtitle, getSubtitleStatus } from '@/lib/subtitles';
import type { SubtitleStatus, TVDetails, SeasonDetails } from '@/lib/types';

export default function WatchTVPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const season = Number(params.season);
  const episode = Number(params.episode);
  
  const [show, setShow] = useState<TVDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [loadingShow, setLoadingShow] = useState(true);
  const [loadingSeason, setLoadingSeason] = useState(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLanguageName, setSelectedLanguageName] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [subtitleUrl, setSubtitleUrl] = useState<string | undefined>();
  const [subtitleStatus, setSubtitleStatus] = useState<SubtitleStatus | null>(null);
  const [isFetchingSubtitle, setIsFetchingSubtitle] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await fetch(`/api/tmdb/details?id=${id}&type=tv`);
        const data = await res.json();
        setShow(data);
      } catch (error) {
        console.error('Failed to fetch TV show details:', error);
      } finally {
        setLoadingShow(false);
      }
    };

    fetchShow();
  }, [id]);

  useEffect(() => {
    setSelectedSeason(season);
  }, [season]);

  useEffect(() => {
    if (!show || selectedSeason === 0) return;

    const fetchSeason = async () => {
      setLoadingSeason(true);
      try {
        const res = await fetch(`/api/tmdb/season?id=${id}&season=${selectedSeason}`);
        const data = await res.json();
        setSeasonDetails(data);
      } catch (error) {
        console.error('Failed to fetch season details:', error);
      } finally {
        setLoadingSeason(false);
      }
    };

    fetchSeason();
  }, [id, show, selectedSeason]);

  const handleSeasonChange = (newSeason: number) => {
    setSelectedSeason(newSeason);
  };

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
        type: 'tv',
        language: selectedLanguage,
        season,
        episode,
      });

      if (result.fromCache || result.status === 'from_cache') {
        setSubtitleStatus({ 
          processId: 'cached', 
          status: 'from_cache',
          subtitleUrl: result.subtitleUrl,
          progress: 100,
          fromCache: true
        });
        setSubtitleUrl(result.subtitleUrl);
        setIsFetchingSubtitle(false);
        setShowPlayer(true);
      } else if (result.processId) {
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

  if (loadingShow) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-gray-500">TV show not found</div>
      </div>
    );
  }

  const seasons = show.seasons.filter(s => s.season_number > 0);
  const currentEpisode = seasonDetails?.episodes.find(ep => ep.episode_number === episode);

  return (
    <div className="min-h-screen bg-black pt-4 px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-2" data-testid="text-show-title">
            {show.name}
          </h1>
          <p className="text-gray-400 text-sm" data-testid="text-episode-info">
            Season {season} • Episode {episode}
            {currentEpisode && ` • ${currentEpisode.name}`}
          </p>
        </div>

        {!showPlayer && (
          <>
            {/* Ad Warning */}
            <AdWarning />

            {/* Subtitle Instructions */}
            <div className="bg-gray-900 p-6 rounded-md mb-6 border border-gray-800">
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
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
              <div className="mb-8">
                <SubtitleProgress status={subtitleStatus} />
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-800 my-8"></div>

            {/* Season Selector */}
            {seasons.length > 0 && (
              <SeasonSelector
                seasons={seasons}
                selectedSeason={selectedSeason}
                onSeasonChange={handleSeasonChange}
              />
            )}

            {/* Episodes Section */}
            {loadingSeason ? (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">Loading episodes...</div>
              </div>
            ) : seasonDetails && seasonDetails.episodes ? (
              <>
                {/* Released Episodes */}
                <section className="mb-8">
                  <h2 className="text-white text-2xl font-bold mb-4">Available Episodes</h2>
                  <EpisodeList
                    episodes={seasonDetails.episodes}
                    tvId={id}
                    seasonNumber={selectedSeason}
                    filterUnreleased={true}
                  />
                </section>

                {/* Upcoming Episodes */}
                <UpcomingEpisodes
                  episodes={seasonDetails.episodes}
                  tvId={id}
                  seasonNumber={selectedSeason}
                />
              </>
            ) : null}
          </>
        )}

        {/* Video Player */}
        {showPlayer && (
          <div className="mt-6">
            <VideoPlayer
              tmdbId={id}
              type="tv"
              season={season}
              episode={episode}
              subtitleUrl={subtitleUrl}
              language={selectedLanguageName}
            />

            {/* Back to episode selection */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowPlayer(false)}
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
                data-testid="button-change-episode"
              >
                Change Episode or Settings
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 my-8"></div>

            {/* Show episodes below player too */}
            {seasonDetails && seasonDetails.episodes && (
              <>
                {/* Season Selector */}
                {seasons.length > 0 && (
                  <SeasonSelector
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    onSeasonChange={handleSeasonChange}
                  />
                )}

                {/* Released Episodes */}
                <section className="mb-8">
                  <h2 className="text-white text-2xl font-bold mb-4">Available Episodes</h2>
                  <EpisodeList
                    episodes={seasonDetails.episodes}
                    tvId={id}
                    seasonNumber={selectedSeason}
                    filterUnreleased={true}
                  />
                </section>

                {/* Upcoming Episodes */}
                <UpcomingEpisodes
                  episodes={seasonDetails.episodes}
                  tvId={id}
                  seasonNumber={selectedSeason}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
