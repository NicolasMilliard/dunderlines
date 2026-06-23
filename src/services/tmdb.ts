const tmdbSeriesId = 2316;
const tmdbApiBaseUrl = 'https://api.themoviedb.org/3';
const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';

type TmdbEpisodeResponse = {
  air_date?: string;
  name?: string;
  overview?: string;
  still_path?: string | null;
  vote_average?: number;
  vote_count?: number;
};

export type TmdbEpisodeDetails = {
  airDate: string;
  imageUrl: string | null;
  overview: string;
  title: string;
  tmdbUrl: string;
  voteAverage: number | null;
  voteCount: number;
};

const episodeCache = new Map<string, Promise<TmdbEpisodeDetails>>();

const tmdbReadAccessToken = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN as
  | string
  | undefined;
const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

export const hasTmdbCredentials = Boolean(tmdbReadAccessToken || tmdbApiKey);

export function getTmdbEpisodeUrl(season: number, episodeNumber: number) {
  return `https://www.themoviedb.org/tv/${tmdbSeriesId}-the-office/season/${season}/episode/${episodeNumber}`;
}

export function getTmdbEpisodeDetails(season: number, episodeNumber: number) {
  const cacheKey = `${season}-${episodeNumber}`;
  const cachedEpisode = episodeCache.get(cacheKey);

  if (cachedEpisode) {
    return cachedEpisode;
  }

  const episodeRequest = fetchTmdbEpisodeDetails(season, episodeNumber);
  episodeCache.set(cacheKey, episodeRequest);

  return episodeRequest;
}

async function fetchTmdbEpisodeDetails(season: number, episodeNumber: number) {
  if (!hasTmdbCredentials) {
    throw new Error('Missing TMDB credentials.');
  }

  const url = new URL(
    `${tmdbApiBaseUrl}/tv/${tmdbSeriesId}/season/${season}/episode/${episodeNumber}`,
  );
  url.searchParams.set('language', 'en-US');

  const headers = new Headers({
    Accept: 'application/json',
  });

  if (tmdbReadAccessToken) {
    headers.set('Authorization', `Bearer ${tmdbReadAccessToken}`);
  } else if (tmdbApiKey) {
    url.searchParams.set('api_key', tmdbApiKey);
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as TmdbEpisodeResponse;

  return {
    airDate: data.air_date ?? '',
    imageUrl: data.still_path ? `${tmdbImageBaseUrl}${data.still_path}` : null,
    overview: data.overview ?? '',
    title: data.name ?? `Episode ${episodeNumber}`,
    tmdbUrl: getTmdbEpisodeUrl(season, episodeNumber),
    voteAverage:
      typeof data.vote_average === 'number' ? data.vote_average : null,
    voteCount: data.vote_count ?? 0,
  };
}
