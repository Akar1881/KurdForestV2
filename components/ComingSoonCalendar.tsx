'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import type { TMDBMovie } from '@/lib/types';

interface ComingSoonCalendarProps {
  upcomingMovies: TMDBMovie[];
}

export default function ComingSoonCalendar({ upcomingMovies }: ComingSoonCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { monthData, moviesGroupedByDate } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      currentWeek.push(date);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    const moviesByDate: { [key: string]: TMDBMovie[] } = {};
    upcomingMovies.forEach((movie) => {
      const releaseDate = movie.release_date || movie.first_air_date;
      if (releaseDate) {
        const dateKey = new Date(releaseDate).toDateString();
        if (!moviesByDate[dateKey]) {
          moviesByDate[dateKey] = [];
        }
        moviesByDate[dateKey].push(movie);
      }
    });
    
    return { monthData: weeks, moviesGroupedByDate: moviesByDate };
  }, [currentDate, upcomingMovies]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleDateClick = (date: Date) => {
    const dateKey = date.toDateString();
    if (moviesGroupedByDate[dateKey]) {
      setSelectedDate(selectedDate === dateKey ? null : dateKey);
    }
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const hasMovies = (date: Date) => {
    return !!moviesGroupedByDate[date.toDateString()];
  };

  const selectedMovies = selectedDate ? moviesGroupedByDate[selectedDate] || [] : [];

  return (
    <section className="mb-16 sm:mb-20">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <CalendarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
          <h2 className="text-white text-xl sm:text-2xl font-bold" data-testid="text-calendar-title">
            Coming Soon Calendar
          </h2>
        </div>

        <div className="bg-card-bg rounded-xl p-4 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              data-testid="button-prev-month"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            
            <h3 className="text-white text-lg sm:text-xl font-semibold" data-testid="text-current-month">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              data-testid="button-next-month"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-xs sm:text-sm font-semibold text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthData.map((week, weekIndex) => (
              week.map((date, dayIndex) => {
                const dateKey = date.toDateString();
                const hasRelease = hasMovies(date);
                const isSelected = selectedDate === dateKey;
                const inCurrentMonth = isCurrentMonth(date);

                return (
                  <button
                    key={`${weekIndex}-${dayIndex}`}
                    onClick={() => handleDateClick(date)}
                    disabled={!hasRelease}
                    className={`
                      aspect-square rounded-lg p-1 sm:p-2 flex flex-col items-center justify-center
                      transition-all duration-200 relative
                      ${inCurrentMonth ? 'text-white' : 'text-gray-600'}
                      ${hasRelease ? 'cursor-pointer hover:bg-yellow-400/20' : 'cursor-default'}
                      ${isSelected ? 'bg-yellow-400/30 ring-2 ring-yellow-400' : ''}
                    `}
                    data-testid={`calendar-day-${date.getDate()}`}
                  >
                    <span className={`text-xs sm:text-sm ${hasRelease ? 'font-bold' : 'font-medium'}`}>
                      {date.getDate()}
                    </span>
                    {hasRelease && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-400" />
                    )}
                  </button>
                );
              })
            ))}
          </div>

          {selectedMovies.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="text-white font-semibold mb-4 text-sm sm:text-base" data-testid="text-releases-on-date">
                Releases on {selectedDate}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {selectedMovies.map((movie) => {
                  const title = movie.title || movie.name || 'Untitled';
                  const type = movie.media_type || 'movie';
                  const href = type === 'movie' ? `/movie/${movie.id}` : `/tv/${movie.id}`;
                  const imageUrl = getImageUrl(movie.poster_path, 'w300');

                  return (
                    <Link
                      key={movie.id}
                      href={href}
                      className="group block animate-fadeIn"
                      data-testid={`card-upcoming-${movie.id}`}
                    >
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card-bg shadow-card group-hover:shadow-card-hover transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 200px"
                          className="object-cover transition-all duration-300 group-hover:scale-110"
                        />
                        {movie.vote_average > 0 && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 glass px-2 py-1 rounded-full backdrop-blur-md z-20">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-yellow-400 font-bold">
                              {movie.vote_average.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xs sm:text-sm text-white font-semibold line-clamp-2 group-hover:text-yellow-400 transition-colors duration-200 mt-2">
                        {title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {movie.release_date || movie.first_air_date}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
