import { generatedTmdbEpisodes } from '../data/generated/tmdbEpisodes';

export type TmdbEpisodeDetails = {
  airDate: string;
  imageUrl: string | null;
  overview: string;
  title: string;
  tmdbUrl: string;
  voteAverage: number | null;
  voteCount: number;
};

const tmdbSeriesId = 2316;
const episodeDetailsByKey = new Map(
  generatedTmdbEpisodes.map((episode) => [
    getEpisodeKey(episode.season, episode.episode),
    episode,
  ]),
);

function getEpisodeKey(season: number, episodeNumber: number) {
  return `${season}-${episodeNumber}`;
}

export function getTmdbEpisodeUrl(season: number, episodeNumber: number) {
  return `https://www.themoviedb.org/tv/${tmdbSeriesId}-the-office/season/${season}/episode/${episodeNumber}`;
}

export function getTmdbEpisodeDetails(
  season: number,
  episodeNumber: number,
): TmdbEpisodeDetails | null {
  return episodeDetailsByKey.get(getEpisodeKey(season, episodeNumber)) ?? null;
}
