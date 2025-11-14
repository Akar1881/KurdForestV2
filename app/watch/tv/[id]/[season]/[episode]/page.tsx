'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Languages, PlayCircle, Tv, List } from 'lucide-react';
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
        <div className="animate-pulse text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-gray-500 text-sm">TV show not found</div>
      </div>
    );
  }

  const seasons = show.seasons.filter(s => s.season_number > 0);
  const currentEpisode = seasonDetails?.episodes.find(ep => ep.episode_number === episode);

  return (
    <div className="min-h-screen bg-black pt-6 sm:pt-8 pb-24">
      <div className="container-custom max-w-6xl pb-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tv className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold" data-testid="text-show-title">
              {show.name}
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base" data-testid="text-episode-info">
            Season {season} • Episode {episode}
            {currentEpisode && ` • ${currentEpisode.name}`}
          </p>
        </div>

        {!showPlayer && (
          <>
            {/* Ad Warning */}
            <AdWarning />

            {/* Subtitle Configuration Card */}
            <div className="bg-card-bg rounded-xl border border-card-border shadow-card p-5 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                <h2 className="text-white text-lg sm:text-xl font-bold">Subtitle Settings</h2>
              </div>

              <div className="bg-black/40 rounded-lg p-4 sm:p-5 mb-5 sm:mb-6 border border-gray-800">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  You can request subtitles in up to 119 languages. Please note that subtitle fetching
                  is provided by our partners and may take a moment to process. Select your preferred
                  language below or choose to watch without subtitles.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm sm:text-base font-semibold mb-3">
                  Select Subtitle Language
                </label>
                <LanguageSelector
                  onSelect={handleLanguageSelect}
                  selectedLanguage={selectedLanguage}
                />
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={handleWatchWithSubtitle}
                  disabled={!selectedLanguage || isFetchingSubtitle}
                  className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl button-press disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                  data-testid="button-watch-with-subtitle"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Watch with Subtitle</span>
                </button>
                <button
                  onClick={handleWatchWithoutSubtitle}
                  disabled={isFetchingSubtitle}
                  className="flex items-center justify-center gap-2 glass-light text-white px-6 py-3 sm:py-3.5 rounded-xl font-medium text-sm sm:text-base hover:bg-white/20 transition-all duration-200 border border-white/20 backdrop-blur-md button-press disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-800"
                  data-testid="button-watch-without-subtitle"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Watch without Subtitle</span>
                </button>
              </div>

              {/* Subtitle Progress */}
              {subtitleStatus && isFetchingSubtitle && (
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800">
                  <h3 className="text-white text-base sm:text-lg font-semibold mb-4">
                    Processing Subtitle
                  </h3>
                  <SubtitleProgress status={subtitleStatus} />
                </div>
              )}
            </div>

            {/* Episodes Section */}
            <div className="bg-card-bg rounded-xl border border-card-border shadow-card p-5 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <List className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                <h2 className="text-white text-lg sm:text-xl font-bold">Episodes</h2>
              </div>

              {/* Season Selector */}
              {seasons.length > 0 && (
                <div className="mb-6">
                  <SeasonSelector
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    onSeasonChange={handleSeasonChange}
                  />
                </div>
              )}

              {/* Episodes List */}
              {loadingSeason ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-gray-500 text-sm">Loading episodes...</div>
                </div>
              ) : seasonDetails && seasonDetails.episodes ? (
                <div className="space-y-6 sm:space-y-8">
                  {/* Available Episodes */}
                  <div>
                    <h3 className="text-white text-base sm:text-lg font-semibold mb-4">Available Episodes</h3>
                    <EpisodeList
                      episodes={seasonDetails.episodes}
                      tvId={id}
                      seasonNumber={selectedSeason}
                      filterUnreleased={true}
                    />
                  </div>

                  {/* Upcoming Episodes */}
                  <UpcomingEpisodes
                    episodes={seasonDetails.episodes}
                    tvId={id}
                    seasonNumber={selectedSeason}
                  />
                </div>
              ) : null}
            </div>
          </>
        )}

        {/* Video Player */}
        {showPlayer && (
          <div className="space-y-6">
            <div className="bg-card-bg rounded-xl border border-card-border shadow-card overflow-hidden">
              <VideoPlayer
                tmdbId={id}
                type="tv"
                season={season}
                episode={episode}
                subtitleUrl={subtitleUrl}
                language={selectedLanguageName}
              />
            </div>

            {/* Player Controls */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowPlayer(false);
                  setSubtitleUrl(undefined);
                  setSubtitleStatus(null);
                  setIsFetchingSubtitle(false);
                }}
                className="flex items-center gap-2 glass-light text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 backdrop-blur-md button-press font-medium text-sm"
                data-testid="button-change-episode"
              >
                <Languages className="w-4 h-4" />
                <span>Change Episode or Settings</span>
              </button>
            </div>

            {/* Episodes Section (repeated below player) */}
            {seasonDetails && seasonDetails.episodes && (
              <div className="bg-card-bg rounded-xl border border-card-border shadow-card p-5 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <List className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  <h2 className="text-white text-lg sm:text-xl font-bold">More Episodes</h2>
                </div>

                {/* Season Selector */}
                {seasons.length > 0 && (
                  <div className="mb-6">
                    <SeasonSelector
                      seasons={seasons}
                      selectedSeason={selectedSeason}
                      onSeasonChange={handleSeasonChange}
                    />
                  </div>
                )}

                {/* Episodes List */}
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-white text-base sm:text-lg font-semibold mb-4">Available Episodes</h3>
                    <EpisodeList
                      episodes={seasonDetails.episodes}
                      tvId={id}
                      seasonNumber={selectedSeason}
                      filterUnreleased={true}
                    />
                  </div>

                  <UpcomingEpisodes
                    episodes={seasonDetails.episodes}
                    tvId={id}
                    seasonNumber={selectedSeason}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
