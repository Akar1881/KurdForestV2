'use client';

import { useState, useEffect } from 'react';
import { getLanguages } from '@/lib/subtitles';
import type { Language } from '@/lib/types';

interface LanguageSelectorProps {
  onSelect: (languageCode: string, languageName: string) => void;
  selectedLanguage?: string;
}

export default function LanguageSelector({ onSelect, selectedLanguage }: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await getLanguages();

        // Convert API object to array
        const safeLanguages: Language[] = data && data.languages
          ? Object.entries(data.languages).map(([code, info]: [string, any]) => ({
              code,
              name: info.name,
              nativeName: info.nativeName,
            }))
          : [];

        setLanguages(safeLanguages);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        setLanguages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="text-gray-500">Loading languages...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <select
        value={selectedLanguage || ''}
        onChange={(e) => {
          const code = e.target.value;
          const lang = languages.find((l) => l.code === code);
          if (lang) {
            onSelect(code, lang.name);
          }
        }}
        className="w-full bg-gray-900 text-white px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-700"
        data-testid="select-language"
      >
        <option value="">Select a language</option>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
}