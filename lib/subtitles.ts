const SUBTITLE_API_BASE = 'https://api.kurdforest.xyz/api';

export async function fetchSubtitle(params: {
  tmdbId: number;
  type: 'movie' | 'tv';
  language: string;
  season?: number;
  episode?: number;
}) {
  const res = await fetch(`${SUBTITLE_API_BASE}/subtitle/fetch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch subtitle');
  }

  return res.json();
}

export async function getSubtitleStatus(processId: string) {
  const res = await fetch(`${SUBTITLE_API_BASE}/subtitle/status/${processId}`);

  if (!res.ok) {
    throw new Error('Failed to get subtitle status');
  }

  return res.json();
}

export async function getLanguages() {
  const res = await fetch(`${SUBTITLE_API_BASE}/languages`);

  if (!res.ok) {
    throw new Error('Failed to fetch languages');
  }

  return res.json();
}
